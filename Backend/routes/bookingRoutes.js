const express = require("express");
const {
  confirmBooking,
  getBookingStatus,
  markCompleted,
  getMyBookings,
  riderConfirmBooking,
  riderRejectBooking,
} = require("../controllers/bookingController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

router.get("/", getMyBookings);
router.post("/confirm", confirmBooking);
router.get("/:rideId", getBookingStatus);
router.patch("/:bookingId/complete", markCompleted);
router.patch("/:bookingId/rider-confirm", riderConfirmBooking);
router.patch("/:bookingId/rider-reject", riderRejectBooking);

module.exports = router;

