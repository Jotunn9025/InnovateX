const express = require('express');
const router = express.Router();
const turfController = require('../controllers/turfController');

router.get('/', turfController.listTurfs);
router.get('/:id', turfController.getTurf);
router.post('/', turfController.addTurf);

module.exports = router; 