const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['fixed', 'variable'], default: 'variable' },
  category: { type: String },
  isRecurring: { type: Boolean, default: false },
  period: { type: String, default: 'monthly' },
  tags: { type: [String], default: [] }
});

module.exports = mongoose.model('Expense', expenseSchema);