/* eslint-env node */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /register - Inscription d'un nouvel utilisateur
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Vérifier si c'est le premier utilisateur (pour le définir comme admin)
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le nouvel utilisateur
    const user = new User({
      email,
      password: hashedPassword,
      role
    });

    const newUser = await user.save();

    // Créer le token JWT
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /login - Connexion d'un utilisateur
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /me - Récupérer les informations de l'utilisateur connecté (nécessite auth)
router.get('/me', auth, async (req, res) => {
  try {
    // Le middleware d'auth ajoutera req.user
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Migrer les données existantes sans userId vers cet utilisateur
    await migrateExistingData(req.user.userId);

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fonction pour migrer les données existantes
async function migrateExistingData(userId) {
  try {
    const Income = require('../models/Income');
    const Expense = require('../models/Expense');
    const Savings = require('../models/Savings');
    const Credit = require('../models/Credit');

    // Migrer les revenus sans userId
    await Income.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: userId } }
    );

    // Migrer les dépenses sans userId
    await Expense.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: userId } }
    );

    // Migrer les épargnes sans userId
    await Savings.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: userId } }
    );

    // Migrer les crédits sans userId
    await Credit.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: userId } }
    );

    console.log(`Données migrées vers l'utilisateur ${userId}`);
  } catch (err) {
    console.error('Erreur lors de la migration des données:', err);
  }
}

module.exports = router;