const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const router = express.Router();

// GET all expenses for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new expense
router.post('/', auth, async (req, res) => {
  const expense = new Expense({
    ...req.body,
    userId: req.user.userId
  });
  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update an expense
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;