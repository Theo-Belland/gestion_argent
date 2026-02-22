const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Récupérer les notifications non lues (admin seulement)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    const notifications = await Notification.find({ read: false }).sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur notifications' });
  }
});

// Marquer une notification comme lue
router.put('/:id/read', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur notifications' });
  }
});

module.exports = router;
