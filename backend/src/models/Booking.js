const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  turf: { type: String, required: true },
  sport: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  qrCode: { type: String },
  status: {
    type: String,
    enum: [
      "booked",
      "waiting for approval",
      "approved",
      "rejected",
      "waitlist",
    ],
    default: "waiting for approval",
  },
  price: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
