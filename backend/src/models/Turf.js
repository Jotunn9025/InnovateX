const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: String,
  location: String,
  fullAddress: String,
  rating: Number,
  reviews: Number,
  price: Number,
  originalPrice: Number,
  images: [String],
  sports: [String],
  amenities: [String],
  description: String,
  rules: [String],
  owner: {
    name: String,
    phone: String,
    email: String,
    responseTime: String,
  },
  availability: mongoose.Schema.Types.Mixed, // {date: {time: {available, price}}}
});

module.exports = mongoose.model('Turf', turfSchema); 