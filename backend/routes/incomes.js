const express = require('express');
const Income = require('../models/Income');
const auth = require('../middleware/auth');
const router = express.Router();

// GET all incomes for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.userId });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new income
router.post('/', auth, async (req, res) => {
  const income = new Income({
    ...req.body,
    userId: req.user.userId
  });
  try {
    const newIncome = await income.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update an income
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedIncome = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.json(updatedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an income
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedIncome = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.json({ message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;