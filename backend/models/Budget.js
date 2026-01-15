/* eslint-env node */
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  maxAmount: { type: Number, required: true },
  period: { type: String, enum: ['mensuel', 'annuel'], default: 'mensuel' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  alertThreshold: { type: Number, default: 80 }, // % avant alerte
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', budgetSchema);
