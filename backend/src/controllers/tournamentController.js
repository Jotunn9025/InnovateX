const Tournament = require('../models/Tournament');

exports.createTournament = async (req, res) => {
  try {
    const { name, sport, date, location, prize, organizer } = req.body;
    if (!name || !sport || !date || !location || !organizer) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const tournament = new Tournament({ name, sport, date, location, prize, organizer });
    await tournament.save();
    res.status(201).json({ message: 'Tournament created', tournament });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.joinTournament = async (req, res) => {
  try {
    const { userId } = req.body;
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
    if (tournament.teams.includes(userId)) {
      return res.status(409).json({ message: 'User already joined' });
    }
    tournament.teams.push(userId);
    await tournament.save();
    res.json({ message: 'Joined tournament', tournament });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().populate('organizer', 'firstName lastName');
    res.json({ tournaments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 