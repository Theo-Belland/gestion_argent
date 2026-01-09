/* eslint-env node */
const express = require('express');
const Visit = require('../models/Visit');
const router = express.Router();

// POST /metrics/visit - enregistre une visite
router.post('/visit', async (req, res) => {
  try {
    const { path, user } = req.body || {};
    await Visit.create({ path: path || 'unknown', user });
    res.json({ message: 'Visit recorded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
