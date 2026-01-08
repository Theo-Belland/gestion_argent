const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date }
});

module.exports = mongoose.model('Credit', creditSchema);