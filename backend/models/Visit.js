const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  path: { type: String, required: true },
  user: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Visit', visitSchema);
