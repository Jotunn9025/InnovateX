const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

// Create booking
router.post("/", bookingController.createBooking);

// Verify QR code (check-in/out)
router.post("/verify", bookingController.verifyQR);

// Get bookings for a user
router.get("/user/:userId", bookingController.getUserBookings);

// Get bookings for all turfs owned by an admin
router.get("/admin", bookingController.getAdminBookings);

// Approve a booking
router.put("/:id/approve", bookingController.approveBooking);

// Reject a booking
router.put("/:id/reject", bookingController.rejectBooking);

module.exports = router;
