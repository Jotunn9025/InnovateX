const Booking = require("../models/Booking");
const User = require("../models/User");
const Turf = require("../models/Turf");
const QRCode = require("qrcode");
const twilio = require("twilio");
// const nodemailer = require('nodemailer'); // Uncomment and configure for real use

function getSlotPrice(turf, date, timeSlot) {
  // date: JS Date or string, timeSlot: "HH:MM"
  const d = new Date(date);
  const day = d.getDay(); // 0=Sunday
  const hour = parseInt(timeSlot.split(":")[0], 10);
  if (!turf.prices || !Array.isArray(turf.prices) || !turf.prices[day])
    return 1000;
  return turf.prices[day][hour] || 1000;
}

exports.createBooking = async (req, res) => {
  try {
    const { userId, turf: turfName, sport, date, timeSlot } = req.body;
    if (!userId || !turfName || !sport || !date || !timeSlot) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Find turf by name
    const turf = await Turf.findOne({ name: turfName });
    if (!turf) return res.status(404).json({ message: "Turf not found" });
    // Check and initialize availability for the date and timeSlot if missing
    if (!turf.availability) turf.availability = {};
    const dateStr = new Date(date).toISOString().slice(0, 10);
    if (!turf.availability[dateStr]) turf.availability[dateStr] = {};
    // Only block slot if already approved for another booking
    if (
      turf.availability[dateStr][timeSlot] &&
      turf.availability[dateStr][timeSlot].available === false
    ) {
      return res.status(400).json({ message: "Slot not available" });
    }
    // Check for any existing non-rejected/cancelled booking for this slot
    const existing = await Booking.findOne({
      turf: turfName,
      date: new Date(date),
      timeSlot,
      status: { $in: ["waiting for approval", "approved", "booked"] },
    });
    let bookingStatus = "waiting for approval";
    if (existing) {
      bookingStatus = "waitlist";
    }
    // Determine price for this slot
    const slotPrice = getSlotPrice(turf, date, timeSlot);
    // Create booking
    const booking = new Booking({
      user: userId,
      turf: turfName,
      sport,
      date,
      timeSlot,
      status: bookingStatus,
      price: slotPrice,
    });
    const qrData = `${booking._id}|${userId}|${turfName}|${sport}|${date}|${timeSlot}`;
    booking.qrCode = await QRCode.toDataURL(qrData);
    await booking.save();
    // Send WhatsApp message to user (booking request)
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        from: "whatsapp:+14155238886",
        to: "whatsapp:+917021420883",
        body: `Hi, your booking request for ${turfName} on ${dateStr} at ${timeSlot} has been received and is pending approval.`,
      });
    } catch (twilioErr) {
      /* Optionally log Twilio error */
    }
    // Real-time notification to turf owner
    const io = req.app.get("io");
    const ownerSocketMap = req.app.get("ownerSocketMap");
    const ownerEmail = turf.owner?.email;
    if (ownerEmail && ownerSocketMap.has(ownerEmail)) {
      io.to(ownerSocketMap.get(ownerEmail)).emit("new-booking", {
        booking: {
          _id: booking._id,
          user: userId,
          turf: turfName,
          sport,
          date,
          timeSlot,
          status: booking.status,
          price: slotPrice,
        },
      });
    }
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.verifyQR = async (req, res) => {
  try {
    const { bookingId, action } = req.body; // action: 'check-in' or 'check-out'
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (action === "check-in") {
      booking.checkIn = new Date();
      booking.status = "checked-in";
    } else if (action === "check-out") {
      booking.checkOut = new Date();
      booking.status = "checked-out";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
    await booking.save();
    res.json({ message: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "confirmed";
    await booking.save();
    // Mark slot as unavailable in turf
    const turf = await Turf.findOne({ name: booking.turf });
    const dateStr = new Date(booking.date).toISOString().slice(0, 10);
    if (!turf.availability) turf.availability = {};
    if (!turf.availability[dateStr]) turf.availability[dateStr] = {};
    turf.availability[dateStr][booking.timeSlot] = { available: false };
    await turf.save();
    // Send WhatsApp message to user (booking approved)
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        from: "whatsapp:+14155238886",
        to: "whatsapp:+917021420883",
        body: `Hi, your booking for ${booking.turf} on ${booking.date
          .toISOString()
          .slice(0, 10)} at ${
          booking.timeSlot
        } has been approved! Enjoy your game.`,
      });
    } catch (twilioErr) {
      /* Optionally log Twilio error */
    }
    res.json({ message: "Booking approved", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "cancelled";
    await booking.save();
    // Promote next waitlist booking (if any) to waiting for approval
    const next = await Booking.findOne({
      turf: booking.turf,
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: "waitlist",
    }).sort({ createdAt: 1 });
    if (next) {
      next.status = "waiting for approval";
      await next.save();
      // Optionally notify admin via socket (if needed)
      const io = req.app.get("io");
      const ownerSocketMap = req.app.get("ownerSocketMap");
      const turf = await Turf.findOne({ name: booking.turf });
      const ownerEmail = turf.owner?.email;
      if (ownerEmail && ownerSocketMap.has(ownerEmail)) {
        io.to(ownerSocketMap.get(ownerEmail)).emit("new-booking", {
          booking: {
            _id: next._id,
            user: next.user,
            turf: next.turf,
            sport: next.sport,
            date: next.date,
            timeSlot: next.timeSlot,
            status: next.status,
          },
        });
      }
    }
    res.json({ message: "Booking rejected", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAdminBookings = async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required" });
    }
    // Find all turfs owned by this admin
    const turfs = await Turf.find({ owner: ownerId });
    const turfNames = turfs.map((t) => t.name);
    // Find all bookings for these turfs
    const bookings = await Booking.find({ turf: { $in: turfNames } });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
