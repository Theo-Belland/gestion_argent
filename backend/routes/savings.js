const express = require('express');
const Savings = require('../models/Savings');
const router = express.Router();

// GET all savings
router.get('/', async (req, res) => {
  try {
    const savings = await Savings.find();
    res.json(savings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new savings
router.post('/', async (req, res) => {
  const savings = new Savings(req.body);
  try {
    const newSavings = await savings.save();
    res.status(201).json(newSavings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a savings
router.put('/:id', async (req, res) => {
  try {
    const updatedSavings = await Savings.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSavings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a savings
router.delete('/:id', async (req, res) => {
  try {
    await Savings.findByIdAndDelete(req.params.id);
    res.json({ message: 'Savings deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;