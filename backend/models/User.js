const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferences: {
    currency: { type: String, default: 'EUR' },
    language: { type: String, default: 'fr' },
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' },
    goalMails: { type: Boolean, default: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);