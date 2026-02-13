const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Offer = require('../models/Offer');
const PaymentOffer = require('../models/PaymentOffer');
const connectDB = require('../config/database');

const offers = [
  {
    title: 'Welcome 10',
    description: 'Get extra 10% off on your first order. Minimum purchase ₹500.',
    discountType: 'percentage',
    value: 10,
    couponCode: 'WELCOME10',
    applicableCategories: [],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Eco Warrior Special',
    description: 'Flat ₹200 off on Reusable Products above ₹1000.',
    discountType: 'flat',
    value: 200,
    couponCode: 'ECOWARRIOR',
    applicableCategories: ['Reusable Products'],
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Zero Waste Flash',
    description: '25% off on Zero Waste category items!',
    discountType: 'percentage',
    value: 25,
    couponCode: 'ZEROWASTE25',
    applicableCategories: ['Zero Waste'],
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
];

const paymentOffers = [
  {
    title: 'ZestMoney Pay Later',
    description: 'Shop now and pay in easy EMIs. No credit card required.',
    type: 'paylater',
    icon: 'Wallet'
  },
  {
    title: 'IDFC FIRST Bank',
    description: 'Flat 10% instant discount on IDFC Credit Cards up to ₹500.',
    type: 'bank',
    icon: 'CreditCard'
  },
  {
    title: 'Google Pay Rewards',
    description: 'Pay via GPay and win a scratch card up to ₹1000.',
    type: 'upi',
    icon: 'Zap'
  },
  {
    title: 'HDFC Bank Credit Card',
    description: '5% Unlimited Cashback on all Eco-Friendly Home items.',
    type: 'bank',
    icon: 'CreditCard'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await Offer.deleteMany();
    await PaymentOffer.deleteMany();

    await Offer.insertMany(offers);
    await PaymentOffer.insertMany(paymentOffers);

    console.log('✅ Offers and Payment Offers seeded successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
