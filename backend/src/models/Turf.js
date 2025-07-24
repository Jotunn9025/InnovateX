const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema({
  name: String,
  location: String,
  fullAddress: String,
  rating: Number,
  reviews: Number,
  prices: [[Number]], // [day][slot] pricing
  originalPrice: Number,
  images: [String],
  sports: [String],
  amenities: [String],
  description: String,
  rules: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availability: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  startTime: { type: String }, // e.g., "08:00"
  endTime: { type: String }, // e.g., "22:00"
});

turfSchema.methods.getLowestPrice = function () {
  return Math.min(...this.prices.flat());
};

module.exports = mongoose.model("Turf", turfSchema);
