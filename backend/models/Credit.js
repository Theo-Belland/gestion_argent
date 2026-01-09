const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  durationMonths: { type: Number, required: true },
  startDate: { type: Date, required: true },
  balance: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date }
});

module.exports = mongoose.model('Credit', creditSchema);