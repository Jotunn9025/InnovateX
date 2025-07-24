const Turf = require('../models/Turf');
const User = require('../models/User');

exports.listTurfs = async (req, res) => {
  try {
    const { owner } = req.query;
    let query = {};
    if (owner) {
      query.owner = owner;
    }
    const turfs = await Turf.find(query);
    res.json({ turfs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTurf = async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: 'Turf not found' });
  res.json({ turf });
};

exports.addTurf = async (req, res) => {
  try {
    const { owner, ...turfData } = req.body;
    if (!owner) {
      return res.status(400).json({ message: 'Owner userId is required' });
    }
    const user = await User.findById(owner);
    if (!user || user.userType !== 'admin') {
      return res.status(400).json({ message: 'Owner must be a valid admin user' });
    }
    const turf = new Turf({ ...turfData, owner });
    await turf.save();
    res.status(201).json({ turf });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 