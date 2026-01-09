const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String },
  isRecurring: { type: Boolean, default: false },
  period: { type: String, default: 'monthly' }
});

module.exports = mongoose.model('Income', incomeSchema);