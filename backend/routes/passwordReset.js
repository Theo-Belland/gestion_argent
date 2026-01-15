const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User');

// Stocker les tokens de reset en mémoire (en production, utiliser Redis ou DB)
const resetTokens = new Map();

// Demander un reset de mot de passe
router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    }

    // Générer un token unique
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 heure

    // Stocker le token
    resetTokens.set(token, { email: user.email, expires });

    // En production, envoyer un email avec le lien
    // Pour le développement, on retourne le token
    console.log(`Reset token for ${email}: ${token}`);
    console.log(`Reset link: http://localhost:5173/reset-password/${token}`);

    res.json({ 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
      // Seulement en dev:
      devToken: token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vérifier la validité d'un token
router.get('/verify-token/:token', (req, res) => {
  const { token } = req.params;
  const resetData = resetTokens.get(token);

  if (!resetData || resetData.expires < Date.now()) {
    return res.status(400).json({ valid: false, message: 'Token invalide ou expiré' });
  }

  res.json({ valid: true });
});

// Réinitialiser le mot de passe
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const resetData = resetTokens.get(token);

    if (!resetData || resetData.expires < Date.now()) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    const user = await User.findOne({ email: resetData.email });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Mettre à jour le mot de passe (sera hashé par le pre-save hook)
    user.password = newPassword;
    await user.save();

    // Supprimer le token utilisé
    resetTokens.delete(token);

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nettoyer les tokens expirés (à exécuter périodiquement)
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of resetTokens.entries()) {
    if (data.expires < now) {
      resetTokens.delete(token);
    }
  }
}, 600000); // Toutes les 10 minutes

module.exports = router;
