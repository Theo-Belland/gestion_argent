const express = require('express');
const Credit = require('../models/Credit');
const router = express.Router();

// GET all credits
router.get('/', async (req, res) => {
  try {
    const credits = await Credit.find();
    res.json(credits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new credit
router.post('/', async (req, res) => {
  const credit = new Credit(req.body);
  try {
    const newCredit = await credit.save();
    res.status(201).json(newCredit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a credit
router.put('/:id', async (req, res) => {
  try {
    const updatedCredit = await Credit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCredit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a credit
router.delete('/:id', async (req, res) => {
  try {
    await Credit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Credit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;