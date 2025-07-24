const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Find players near you
router.get('/find', userController.findPlayers);

// Get user profile
router.get('/:id', userController.getProfile);

module.exports = router; 