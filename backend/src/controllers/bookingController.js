const Booking = require('../models/Booking');
const User = require('../models/User');
const Turf = require('../models/Turf');
const QRCode = require('qrcode');
// const nodemailer = require('nodemailer'); // Uncomment and configure for real use

exports.createBooking = async (req, res) => {
  try {
    const { userId, turf: turfName, sport, date, timeSlot } = req.body;
    if (!userId || !turfName || !sport || !date || !timeSlot) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Find turf by name
    const turf = await Turf.findOne({ name: turfName });
    if (!turf) return res.status(404).json({ message: 'Turf not found' });
    // Check availability
    const dateStr = new Date(date).toISOString().slice(0,10);
    if (!turf.availability?.[dateStr]?.[timeSlot]?.available) {
      return res.status(400).json({ message: 'Slot not available' });
    }
    // Mark slot as unavailable
    turf.availability[dateStr][timeSlot].available = false;
    await turf.save();
    // Create booking
    const booking = new Booking({ user: userId, turf: turfName, sport, date, timeSlot });
    const qrData = `${booking._id}|${userId}|${turfName}|${sport}|${date}|${timeSlot}`;
    booking.qrCode = await QRCode.toDataURL(qrData);
    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyQR = async (req, res) => {
  try {
    const { bookingId, action } = req.body; // action: 'check-in' or 'check-out'
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (action === 'check-in') {
      booking.checkIn = new Date();
      booking.status = 'checked-in';
    } else if (action === 'check-out') {
      booking.checkOut = new Date();
      booking.status = 'checked-out';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
    await booking.save();
    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 