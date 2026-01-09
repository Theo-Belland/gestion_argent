/* eslint-env node */
const express = require('express');
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Savings = require('../models/Savings');
const Credit = require('../models/Credit');
const Visit = require('../models/Visit');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware pour vérifier le rôle admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Rôle admin requis.' });
  }
  next();
};

// GET /admin/users - Lister tous les utilisateurs (admin seulement)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/stats - Statistiques globales (admin seulement)
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const incomeCount = await Income.countDocuments();
    const expenseCount = await Expense.countDocuments();
    const savingsCount = await Savings.countDocuments();
    const creditCount = await Credit.countDocuments();
    const visitCount = await Visit.countDocuments();

    // Calculs totaux (optionnel, pour avoir une idée)
    const totalIncome = await Income.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const totalExpense = await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const totalSavings = await Savings.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);

    res.json({
      users: userCount,
      incomes: incomeCount,
      expenses: expenseCount,
      savings: savingsCount,
      credits: creditCount,
      visits: visitCount,
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      totalSavings: totalSavings[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /admin/users/:id - Supprimer un utilisateur (admin seulement)
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Supprimer l'utilisateur et toutes ses données
    await User.findByIdAndDelete(userId);
    await Income.deleteMany({ user: userId });
    await Expense.deleteMany({ user: userId });
    await Savings.deleteMany({ user: userId });
    await Credit.deleteMany({ user: userId });

    res.json({ message: 'Utilisateur et ses données supprimés' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /admin/users/:id/role - Changer le rôle d'un utilisateur (admin seulement)
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;