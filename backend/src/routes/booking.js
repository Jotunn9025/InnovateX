const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');

// Create booking
router.post('/', bookingController.createBooking);

// Verify QR code (check-in/out)
router.post('/verify', bookingController.verifyQR);

module.exports = router; 