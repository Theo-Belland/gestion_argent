const express = require('express');
const Savings = require('../models/Savings');
const auth = require('../middleware/auth');
const router = express.Router();

// GET all savings for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const savings = await Savings.find({ userId: req.user.userId });
    res.json(savings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new savings
router.post('/', auth, async (req, res) => {
  const savings = new Savings({
    ...req.body,
    userId: req.user.userId
  });
  try {
    const newSavings = await savings.save();
    res.status(201).json(newSavings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a savings
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedSavings = await Savings.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedSavings) {
      return res.status(404).json({ message: 'Savings not found' });
    }
    res.json(updatedSavings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a savings
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedSavings = await Savings.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedSavings) {
      return res.status(404).json({ message: 'Savings not found' });
    }
    res.json({ message: 'Savings deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;