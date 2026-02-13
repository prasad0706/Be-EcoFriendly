const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
  },
  description: {
    type: String,
    required: [true, 'Offer description is required'],
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    required: [true, 'Discount type is required'],
  },
  value: {
    type: Number,
    required: [true, 'Discount value is required'],
  },
  couponCode: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  applicableCategories: [{
    type: String,
  }],
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Offer', offerSchema);
