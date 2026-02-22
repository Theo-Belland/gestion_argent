/* eslint-env node */
const express = require('express');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /goals - Récupérer tous les objectifs de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /goals - Créer un nouvel objectif
router.post('/', auth, async (req, res) => {
  try {
    console.log('POST /api/goals body:', req.body);
    const { title, targetAmount, currentAmount, deadline, category, description } = req.body;
    
    if (!title || !targetAmount) {
      return res.status(400).json({ message: 'Titre et montant cible requis' });
    }

    const goal = new Goal({
      user: req.userId,
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      category,
      description
    });

    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    console.error('Erreur création objectif:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

// PUT /goals/:id - Mettre à jour un objectif
const { sendGoalProgressMail } = require('../utils/mail');
const User = require('../models/User');
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('[GOAL PUT] Payload reçue:', req.body);
    const { title, targetAmount, currentAmount, deadline, category, description } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.userId });
    if (!goal) return res.status(404).json({ message: 'Objectif non trouvé' });

    console.log('[GOAL PUT] Avant modification:', goal);

    if (title) goal.title = title;
    if (targetAmount) goal.targetAmount = targetAmount;
    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (deadline) goal.deadline = deadline;
    if (category) goal.category = category;
    if (description !== undefined) goal.description = description;
    goal.updatedAt = Date.now();

    // --- Détection des paliers et envoi de mail ---
    let percent = 0;
    if (goal.targetAmount > 0) {
      percent = (goal.currentAmount / goal.targetAmount) * 100;
    }
    const user = await User.findById(goal.user);
    // Respecte la préférence utilisateur pour les mails d'objectifs
    if (user.preferences?.goalMails !== false) {
      // 50%
      if (percent >= 50 && !goal.mailSent50) {
        await sendGoalProgressMail(
          user.email,
          `Bravo ! 50% de votre objectif atteint !`,
          `Vous avez atteint 50% de votre objectif "${goal.title}". Continuez comme ça !`
        );
        goal.mailSent50 = true;
      }
      // 80%
      if (percent >= 80 && !goal.mailSent80) {
        await sendGoalProgressMail(
          user.email,
          `Super ! 80% de votre objectif atteint !`,
          `Vous avez atteint 80% de votre objectif "${goal.title}". Vous touchez au but !`
        );
        goal.mailSent80 = true;
      }
      // 100%
      if (percent >= 100 && !goal.mailSent100) {
        await sendGoalProgressMail(
          user.email,
          `Félicitations ! Objectif atteint !`,
          `Bravo ! Vous avez atteint 100% de votre objectif "${goal.title}". Félicitations pour votre réussite !`
        );
        goal.mailSent100 = true;
      }
    }
    // ---

    console.log('[GOAL PUT] Après modification:', goal);
    const updatedGoal = await goal.save();
    console.log('[GOAL PUT] Après save (en base):', updatedGoal);
    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /goals/:id - Supprimer un objectif
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.userId });
    if (!goal) return res.status(404).json({ message: 'Objectif non trouvé' });

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Objectif supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
