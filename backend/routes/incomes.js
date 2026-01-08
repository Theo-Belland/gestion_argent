const express = require('express');
const Income = require('../models/Income');
const router = express.Router();

// GET all incomes
router.get('/', async (req, res) => {
  try {
    const incomes = await Income.find();
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new income
router.post('/', async (req, res) => {
  const income = new Income(req.body);
  try {
    const newIncome = await income.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update an income
router.put('/:id', async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an income
router.delete('/:id', async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;