const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  amount: { type: Number, default: 0 },
  goal: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Savings', savingsSchema);