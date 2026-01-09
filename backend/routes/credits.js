const express = require('express');
const Credit = require('../models/Credit');
const auth = require('../middleware/auth');
const router = express.Router();

// GET all credits for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const credits = await Credit.find({ userId: req.user.userId });
    res.json(credits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new credit
router.post('/', auth, async (req, res) => {
  const credit = new Credit({
    ...req.body,
    userId: req.user.userId
  });
  try {
    const newCredit = await credit.save();
    res.status(201).json(newCredit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a credit
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedCredit = await Credit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedCredit) {
      return res.status(404).json({ message: 'Credit not found' });
    }
    res.json(updatedCredit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a credit
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedCredit = await Credit.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedCredit) {
      return res.status(404).json({ message: 'Credit not found' });
    }
    res.json({ message: 'Credit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;