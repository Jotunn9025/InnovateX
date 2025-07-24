const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Find players near you
router.get('/find', userController.findPlayers);

// Get all users
router.get('/', userController.getAllUsers); 

// Get user profile by ID
router.get('/:id', userController.getProfile);

module.exports = router;
