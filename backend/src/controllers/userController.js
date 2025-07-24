const User = require('../models/User');

// Find players near you based on query params
exports.findPlayers = async (req, res) => {
  try {
    const { city, pincode, sport } = req.query;
    const query = {};

    if (city) query.location = { $regex: city, $options: 'i' };
    if (pincode) query.location = { $regex: pincode, $options: 'i' };
    if (sport) query.sport = sport;

    const users = await User.find(query).select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a user's profile by ID
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
