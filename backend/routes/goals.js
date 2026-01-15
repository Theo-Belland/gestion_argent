/* eslint-env node */
const express = require('express');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /goals - Récupérer tous les objectifs de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /goals - Créer un nouvel objectif
router.post('/', auth, async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline, category, description } = req.body;
    
    if (!title || !targetAmount) {
      return res.status(400).json({ message: 'Titre et montant cible requis' });
    }

    const goal = new Goal({
      user: req.user.id,
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
    res.status(500).json({ message: err.message });
  }
});

// PUT /goals/:id - Mettre à jour un objectif
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline, category, description } = req.body;
    
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Objectif non trouvé' });

    if (title) goal.title = title;
    if (targetAmount) goal.targetAmount = targetAmount;
    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (deadline) goal.deadline = deadline;
    if (category) goal.category = category;
    if (description !== undefined) goal.description = description;
    goal.updatedAt = Date.now();

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /goals/:id - Supprimer un objectif
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Objectif non trouvé' });

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Objectif supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
