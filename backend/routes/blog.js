/* eslint-env node */
const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /blog - Récupérer tous les posts
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /blog/admin/all - Récupérer tous les posts (admin seulement)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /blog/:id - Récupérer un post par ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /blog/:id - Mettre à jour un post (admin seulement)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, category, status, updatedAt: Date.now() },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /blog - Créer un post (admin seulement)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content required' });
    }

    const post = new Blog({
      title,
      content,
      category: category || 'conseil',
      author: req.user.email,
      status: status || 'published'
    });

    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /blog/:id/comments - Ajouter un commentaire
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, content, rating } = req.body;
    if (!author || !content) {
      return res.status(400).json({ message: 'Author and content required' });
    }

    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ author, content, rating: rating || 5 });
    const updatedPost = await post.save();
    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /blog/:id/comments/:commentId - Supprimer un commentaire (admin)
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /blog/:id - Supprimer un post (admin seulement)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
