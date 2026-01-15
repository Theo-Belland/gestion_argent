const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Obtenir le profil utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Getting profile for userId:', req.userId);
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      console.log('User not found:', req.userId);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    console.log('User found:', user.email, 'role:', user.role);
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour le profil
router.put('/profile', auth, async (req, res) => {
  try {
    const { email, preferences } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (email && email !== user.email) {
      // Vérifier si l'email est déjà utilisé
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }
      user.email = email;
    }

    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();
    res.json({ message: 'Profil mis à jour', user: { email: user.email, preferences: user.preferences } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Changer le mot de passe
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe actuel
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer le compte
router.delete('/account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    // Supprimer toutes les données associées
    const Income = require('../models/Income');
    const Expense = require('../models/Expense');
    const Savings = require('../models/Savings');
    const Credit = require('../models/Credit');

    await Promise.all([
      Income.deleteMany({ userId: req.userId }),
      Expense.deleteMany({ userId: req.userId }),
      Savings.deleteMany({ userId: req.userId }),
      Credit.deleteMany({ userId: req.userId }),
      User.findByIdAndDelete(req.userId)
    ]);

    res.json({ message: 'Compte supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
