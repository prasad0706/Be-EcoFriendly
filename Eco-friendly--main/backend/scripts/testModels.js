#!/usr/bin/env node

// Script to test if models are loading correctly
// Usage: node testModels.js

const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing model imports...');

try {
  const User = require('./models/User');
  console.log('User model loaded successfully');
  
  const Product = require('./models/Product');
  console.log('Product model loaded successfully');
  
  const Cart = require('./models/Cart');
  console.log('Cart model loaded successfully');
  
  const Order = require('./models/Order');
  console.log('Order model loaded successfully');
  
  console.log('All models loaded successfully!');
} catch (error) {
  console.error('Error loading models:', error);
}

process.exit(0);