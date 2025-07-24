const CommunityPost = require('../models/CommunityPost');

exports.createPost = async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content) return res.status(400).json({ message: 'Missing required fields' });
    const post = new CommunityPost({ user: userId, content });
    await post.save();
    res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ user: userId, text });
    await post.save();
    res.json({ message: 'Comment added', post });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().populate('user', 'firstName lastName').populate('comments.user', 'firstName lastName');
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 