const createError = require("http-errors");
const Booking = require("../models/Booking");
const Ride = require("../models/Ride");
const Rating = require("../models/Rating");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { sendEmail } = require("../utils/emailService");
const {
  bookingNotificationTemplate,
  bookingCancellationTemplate,
  bookingConfirmationTemplate,
} = require("../utils/emailTemplates");

exports.confirmBooking = asyncHandler(async (req, res) => {
  const { rideId, bookingMessage } = req.body;
  const userId = req.user.id;

  // Check if user account is active
  const passenger = await User.findById(userId).select("name email phone isActive role");
  if (!passenger || !passenger.isActive) {
    throw createError(403, "Account deactivated. You cannot book rides.");
  }

  // Riders cannot book rides, only customers can
  if (passenger.role === "rider") {
    throw createError(403, "Riders cannot book rides. Only customers can book rides.");
  }

  const ride = await Ride.findById(rideId).populate("riderId");
  if (!ride) throw createError(404, "Ride not found");
  if (ride.status === "booked" || ride.status === "completed") {
    throw createError(400, "Ride already booked");
  }

  // Block booking if a confirmed booking exists but ride status wasn't updated
  const existingConfirmedBooking = await Booking.findOne({ rideId, status: "confirmed" });
  if (existingConfirmedBooking) {
    throw createError(400, "Ride already booked");
  }

  // Check if rider account is active
  if (!ride.riderId || !ride.riderId.isActive) {
    throw createError(403, "This ride is no longer available. The rider account has been deactivated.");
  }

  // Check if customer already has a pending or confirmed booking for this ride
  let booking = await Booking.findOne({ rideId, userId });
  if (booking && (booking.status === "confirmed" || booking.status === "pending")) {
    throw createError(400, "You already have a booking request for this ride");
  }

  // Create a pending booking (request) - rider needs to confirm
  if (!booking) {
    booking = await Booking.create({ rideId, userId, status: "pending", bookingMessage });
  } else {
    booking.status = "pending";
    if (typeof bookingMessage === "string") {
      booking.bookingMessage = bookingMessage;
    }
    await booking.save();
  }

  // Send email notification to rider about new booking request
  if (ride.riderId?.email) {
    await sendEmail({
      to: ride.riderId.email,
      ...bookingNotificationTemplate(
        ride.riderId.name,
        ride,
        passenger?.name || "A passenger",
        booking.bookingMessage
      ),
    });
  }

  // res.json({
  //   success: true,
  //   message: "Ride booking request sent successfully. Waiting for rider confirmation.",
  //   data: booking,
  // });
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const basePopulate = [
    {
      path: "rideId",
      populate: { path: "riderId", select: "name phone rating email" },
    },
    { path: "userId", select: "name phone rating email" },
  ];

  const passengerBookings = await Booking.find({ userId })
    .populate(basePopulate)
    .sort({ createdAt: -1 })
    .lean();

  const rideIds = await Ride.find({ riderId: userId }).select("_id");
  let riderBookings = [];
  if (rideIds.length) {
    riderBookings = await Booking.find({ rideId: { $in: rideIds.map((ride) => ride._id) } })
      .populate(basePopulate)
      .lean();
  }

  const ratings = await Rating.find({ byUser: userId }).select("rideId toUser").lean();
  const ratedPairs = new Set(
    ratings.map((rating) => `${rating.rideId.toString()}_${rating.toUser.toString()}`)
  );

  const toSerializable = (booking, role) => {
    const counterparty = role === "customer" ? booking.rideId?.riderId : booking.userId;
    const rideIdentifier =
      typeof booking.rideId === "object" ? booking.rideId?._id?.toString() : booking.rideId?.toString();
    const counterpartyId = counterparty?._id?.toString();
    const canRate = booking.status === "completed" && Boolean(rideIdentifier && counterpartyId);
    const hasRated = canRate && ratedPairs.has(`${rideIdentifier}_${counterpartyId}`);

    return {
      ...booking,
      role,
      counterparty,
      canRate,
      hasRated,
    };
  };

  const combined = [
    ...passengerBookings.map((booking) => toSerializable(booking, "customer")),
    ...riderBookings.map((booking) => toSerializable(booking, "rider")),
  ]
    .filter((booking) => booking.status !== "cancelled")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ success: true, data: combined });
});

exports.getBookingStatus = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const booking = await Booking.findOne({ rideId, userId: req.user.id });
  if (!booking) throw createError(404, "Booking not found");

  res.json({ success: true, data: booking });
});

exports.riderConfirmBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const riderId = req.user.id;

  const booking = await Booking.findById(bookingId).populate([
    { path: "rideId" },
    { path: "userId", select: "name email" },
  ]);
  if (!booking) throw createError(404, "Booking not found");

  const ride = booking.rideId;
  
  // Only the ride owner (rider) can confirm bookings
  if (ride.riderId.toString() !== riderId && req.user.role !== "admin") {
    throw createError(403, "Only the ride owner can confirm bookings");
  }

  // Check if user account is active
  const user = await User.findById(req.user.id);
  if (!user || !user.isActive) {
    throw createError(403, "Account deactivated. You cannot confirm bookings.");
  }

  // Only pending bookings can be confirmed
  if (booking.status !== "pending") {
    throw createError(400, `Cannot confirm booking. Current status: ${booking.status}`);
  }

  // Check if ride is still available
  if (ride.status === "booked") {
    throw createError(400, "This ride is already booked by another passenger");
  }

  const otherConfirmed = await Booking.findOne({
    rideId: ride._id,
    status: "confirmed",
    _id: { $ne: bookingId },
  });
  if (otherConfirmed) {
    throw createError(400, "This ride is already booked by another passenger");
  }

  if (ride.status === "completed") {
    throw createError(400, "This ride is already completed");
  }

  // Confirm the booking
  booking.status = "confirmed";
  ride.status = "booked";
  ride.isConfirmed = true;

  // Cancel all other bookings for this ride and notify the passengers
  const otherBookings = await Booking.find({
    rideId: ride._id,
    _id: { $ne: bookingId },
    status: { $in: ["pending", "confirmed"] },
  }).populate({ path: "userId", select: "name email" });

  // Cancel, notify, and then hard-delete all other booking requests
  const cancellationPromises = otherBookings.map(async (other) => {
    other.status = "cancelled";
    await other.save();

    if (other.userId?.email) {
      await sendEmail({
        to: other.userId.email,
        ...bookingCancellationTemplate(other.userId.name || "Passenger", ride),
      });
    }

    // rejected/cancelled requests should be removed
    await other.deleteOne();
  });

  await Promise.all([booking.save(), ride.save(), ...cancellationPromises]);

  // Send confirmation email to the passenger
  if (booking.userId?.email) {
    await sendEmail({
      to: booking.userId.email,
      ...bookingConfirmationTemplate(
        booking.userId.name || "Passenger",
        user?.name || "Your rider",
        ride
      ),
    });
  }

  // Populate booking details
  await booking.populate([
    {
      path: "rideId",
      populate: { path: "riderId", select: "name phone rating email" },
    },
    { path: "userId", select: "name phone rating email" },
  ]);

  res.json({
    success: true,
    message: "Booking confirmed successfully",
    data: booking,
  });
});

exports.riderRejectBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const riderId = req.user.id;

  const booking = await Booking.findById(bookingId).populate([
    { path: "rideId" },
    { path: "userId", select: "name email" },
  ]);
  if (!booking) throw createError(404, "Booking not found");

  const ride = booking.rideId;
  
  // Only the ride owner (rider) can reject bookings
  if (ride.riderId.toString() !== riderId && req.user.role !== "admin") {
    throw createError(403, "Only the ride owner can reject bookings");
  }

  // Check if user account is active
  const user = await User.findById(req.user.id);
  if (!user || !user.isActive) {
    throw createError(403, "Account deactivated. You cannot reject bookings.");
  }

  // Only pending bookings can be rejected
  if (booking.status !== "pending") {
    throw createError(400, `Cannot reject booking. Current status: ${booking.status}`);
  }

  // Reject the booking (mark as cancelled so we can include status in the response)
  booking.status = "cancelled";
  await booking.save();

  // Notify passenger about rejection
  if (booking.userId?.email) {
    await sendEmail({
      to: booking.userId.email,
      ...bookingCancellationTemplate(booking.userId.name || "Passenger", ride),
    });
  }

  // Populate booking details for the response
  await booking.populate([
    {
      path: "rideId",
      populate: { path: "riderId", select: "name phone rating email" },
    },
    { path: "userId", select: "name phone rating email" },
  ]);

  // Business rule: remove rejected booking from the system after notifying
  await booking.deleteOne();

  res.json({
    success: true,
    message: "Booking rejected successfully",
    data: booking,
  });
});

exports.markCompleted = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId).populate("rideId");
  if (!booking) throw createError(404, "Booking not found");

  const ride = booking.rideId;
  const isRider = ride.riderId.toString() === req.user.id;
  const isPassenger = booking.userId.toString() === req.user.id;
  if (!isRider && !isPassenger && req.user.role !== "admin") {
    throw createError(403, "Only ride owner or passenger can close the trip");
  }

  // Check if user account is active
  const user = await User.findById(req.user.id);
  if (!user || !user.isActive) {
    throw createError(403, "Account deactivated. You cannot mark rides as completed.");
  }

  if (booking.status === "completed") {
    await booking.populate([
      {
        path: "rideId",
        populate: { path: "riderId", select: "name phone rating email" },
      },
      { path: "userId", select: "name phone rating email" },
    ]);
    return res.json({ success: true, message: "Ride already marked completed", data: booking });
  }

  // Only confirmed bookings can be marked as completed
  if (booking.status !== "confirmed") {
    throw createError(400, `Cannot mark booking as completed. Current status: ${booking.status}. Booking must be confirmed first.`);
  }

  booking.status = "completed";
  ride.status = "completed";
  await Promise.all([booking.save(), ride.save()]);

  await User.findByIdAndUpdate(ride.riderId, { $inc: { ridesCompleted: 1 } });
  await User.findByIdAndUpdate(booking.userId, { $inc: { ridesCompleted: 1 } });

  await booking.populate([
    {
      path: "rideId",
      populate: { path: "riderId", select: "name phone rating email" },
    },
    { path: "userId", select: "name phone rating email" },
  ]);

  res.json({ success: true, message: "Ride marked as completed", data: booking });
});

