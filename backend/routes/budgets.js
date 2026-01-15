/* eslint-env node */
const express = require('express');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /budgets - Récupérer tous les budgets de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // Calculer les dépenses pour chaque budget
    const budgetsWithSpending = await Promise.all(budgets.map(async (budget) => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const expenses = await Expense.find({
        user: req.user.id,
        category: budget.category,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      });
      
      const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const percentage = (spent / budget.maxAmount) * 100;
      
      return {
        ...budget.toObject(),
        spent,
        percentage: Math.round(percentage),
        isExceeded: spent > budget.maxAmount,
        isNearLimit: percentage >= budget.alertThreshold && percentage < 100
      };
    }));
    
    res.json(budgetsWithSpending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /budgets - Créer un nouveau budget
router.post('/', auth, async (req, res) => {
  try {
    const { category, maxAmount, period, alertThreshold } = req.body;
    
    if (!category || !maxAmount) {
      return res.status(400).json({ message: 'Catégorie et montant maximum requis' });
    }

    const budget = new Budget({
      user: req.user.id,
      category,
      maxAmount,
      period: period || 'mensuel',
      alertThreshold: alertThreshold || 80
    });

    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /budgets/:id - Mettre à jour un budget
router.put('/:id', auth, async (req, res) => {
  try {
    const { category, maxAmount, period, alertThreshold } = req.body;
    
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget non trouvé' });

    if (category) budget.category = category;
    if (maxAmount) budget.maxAmount = maxAmount;
    if (period) budget.period = period;
    if (alertThreshold !== undefined) budget.alertThreshold = alertThreshold;
    budget.updatedAt = Date.now();

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /budgets/:id - Supprimer un budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget non trouvé' });

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
