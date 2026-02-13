const mongoose = require('mongoose');

const paymentOfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // lucide icon name or image url
  },
  type: {
    type: String,
    enum: ['bank', 'upi', 'rewards', 'paylater'],
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('PaymentOffer', paymentOfferSchema);
