const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  discount: String,
  image: {
    type: String,
    required: true,
  },
  link: String,
  active: {
    type: Boolean,
    default: true,
  },
  expiryDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Deal', dealSchema);
