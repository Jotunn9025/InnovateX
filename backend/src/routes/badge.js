const express = require('express');
const router = express.Router();

const badgeController = require('../controllers/badgeController');

// List badges
router.get('/', badgeController.listBadges);

module.exports = router; 