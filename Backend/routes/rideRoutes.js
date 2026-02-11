// const express = require("express");
// const {
//   addRide,
//   getRealTimeRides,
//   getRideById,
//   getMyRides,
//   updateRide,
//   deleteRide,
//   listAll,
//   getAllRides,
// } = require("../controllers/rideController");
// const { authenticate, authorizeRoles } = require("../middleware/auth");

// const router = express.Router();

// router.get("/admin/all", authenticate, authorizeRoles("admin"), listAll);
// router.get("/all", authenticate, getAllRides); // For riders to see all rides
// router.get("/mine", authenticate, getMyRides);
// router.get("/", getRealTimeRides);
// router.get("/:id", getRideById);

// router.use(authenticate);
// router.post("/", addRide);
// router.patch("/:id", updateRide);
// router.delete("/:id", deleteRide);

// module.exports = router;

const express = require("express");
const {
  addRide,
  getRealTimeRides,
  getRideById,
  getMyRides,
  updateRide,
  deleteRide,
  listAll,
  getAllRides,
} = require("../controllers/rideController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Admin route: get all rides
router.get("/admin/all", authenticate, authorizeRoles("admin"), listAll);

// Riders: see all rides (including non-live)
router.get("/all", authenticate, getAllRides);

// Logged-in user's rides
router.get("/mine", authenticate, getMyRides);

// Public: see realtime live rides
router.get("/", getRealTimeRides);

// Ride details
router.get("/:id", getRideById);

// Below this line → Authentication required
router.use(authenticate);

// Add ride
router.post("/", addRide);

// Update ride
router.patch("/:id", updateRide);

// Delete ride (NOT allowed if ride is confirmed)
router.delete("/:id", deleteRide);

// ⭐ NEW: Confirm Ride (FINAL WORKING ENDPOINT)
router.patch("/:id/confirm", async (req, res) => {
  try {
    const Ride = require("../models/Ride");

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status === "booked" || ride.status === "completed") {
      return res.status(400).json({ message: "Ride already booked" });
    }

    // Mark ride as booked/confirmed
    ride.status = "booked";
    ride.isConfirmed = true;

    await ride.save();

    return res.json({
      success: true,
      message: "Ride has been successfully confirmed",
      ride,
    });

  } catch (error) {
    console.error("Confirm Ride Error:", error);
    return res.status(500).json({ message: "Unable to confirm ride" });
  }
});

module.exports = router;
