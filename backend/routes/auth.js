const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const auth = require('../middleware/auth');
const { sendGoalProgressMail } = require('../utils/mail');
const Notification = require('../models/Notification');

const router = express.Router();

// --------------------
// INSCRIPTION
// --------------------
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role
    });


    const newUser = await user.save();

    // Créer une notification pour l'admin
    await Notification.create({
      type: 'new_user',
      message: `Nouveau compte créé : ${newUser.email}`
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: { id: newUser._id, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('Erreur register:', err);
    res.status(500).json({ message: 'Erreur serveur lors de l’inscription' });
  }
});

// --------------------
// CONNEXION
// --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

// --------------------
// MOT DE PASSE OUBLIÉ
// --------------------
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requis' });

    const user = await User.findOne({ email });
    if (!user) {
      // Pour la sécurité, ne pas révéler si l’email existe
      return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600 * 1000; // 1 heure
    await user.save();

    const resetUrl = `https://geretonbudget.theobelland.fr/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const subject = 'Réinitialisation de votre mot de passe';
    const text = `Vous avez demandé à réinitialiser votre mot de passe. Copiez ce lien dans votre navigateur : ${resetUrl}`;
    const html = `<p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                  <p><a href="${resetUrl}">Réinitialiser mon mot de passe</a></p>
                  <p>Ce lien est valable 1 heure.</p>`;

    await sendGoalProgressMail(email, subject, text, html);

    res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
  } catch (err) {
    console.error('Erreur forgot-password:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la demande de réinitialisation' });
  }
});

// --------------------
// RÉINITIALISATION DU MOT DE PASSE
// --------------------
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    console.log('ResetPassword body:', req.body); // <-- debug

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'Paramètres manquants' });
    }

    const user = await User.findOne({
      email: email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Lien invalide ou expiré' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    console.error('ResetPassword error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// --------------------
// RÉCUPÉRER L’UTILISATEUR CONNECTÉ
// --------------------
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(user);
  } catch (err) {
    console.error('Erreur /me:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l’utilisateur' });
  }
});

module.exports = router;
