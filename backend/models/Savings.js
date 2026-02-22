const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  amount: { type: Number, default: 0 },
  interestRate: { type: Number, default: 0 },
  frequency: { type: String, enum: ['annual', 'monthly'], default: 'annual' },
  startDate: { type: Date, default: Date.now },
  lastUpdate: { type: Date, default: Date.now },
  goal: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Savings', savingsSchema);