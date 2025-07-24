const Turf = require('../models/Turf');

exports.listTurfs = async (req, res) => {
  const turfs = await Turf.find();
  res.json({ turfs });
};

exports.getTurf = async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: 'Turf not found' });
  res.json({ turf });
};

exports.addTurf = async (req, res) => {
  const turf = new Turf(req.body);
  await turf.save();
  res.status(201).json({ turf });
}; 