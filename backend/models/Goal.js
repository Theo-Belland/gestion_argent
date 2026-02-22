/* eslint-env node */
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  category: { type: String, default: 'Épargne' },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  mailSent50: { type: Boolean, default: false },
  mailSent80: { type: Boolean, default: false },
  mailSent100: { type: Boolean, default: false }
});

module.exports = mongoose.model('Goal', goalSchema);
