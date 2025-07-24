const express = require('express');
const router = express.Router();

const communityController = require('../controllers/communityController');

// Create post
router.post('/', communityController.createPost);

// Add comment
router.post('/:id/comment', communityController.addComment);

// List posts
router.get('/', communityController.listPosts);

module.exports = router; 