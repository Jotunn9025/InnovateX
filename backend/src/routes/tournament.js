const express = require('express');
const router = express.Router();

const tournamentController = require('../controllers/tournamentController');

// Create tournament
router.post('/', tournamentController.createTournament);

// Join tournament
router.post('/:id/join', tournamentController.joinTournament);

// List tournaments
router.get('/', tournamentController.listTournaments);

module.exports = router; 