const express = require('express');
const router = express.Router();

const demandController = require('../controllers/demandController');

// Get demand estimation (mock)
router.get('/', demandController.getDemand);

module.exports = router; 