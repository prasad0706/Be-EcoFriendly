#!/usr/bin/env node

// Script to test database connection and cart creation
// Usage: node testDatabase.js

const mongoose = require('mongoose');
require('dotenv').config();
const Cart = require('./models/Cart');
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Test creating a cart
const testCartCreation = async () => {
  try {
    // Find the test user
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('Test user not found');
      return;
    }
    
    console.log('Found user:', user._id);
    
    // Try to create a cart
    const cart = await Cart.create({ 
      user: user._id, 
      items: [] 
    });
    
    console.log('Cart created successfully:', cart._id);
    
    // Clean up - delete the cart
    await Cart.findByIdAndDelete(cart._id);
    console.log('Cart deleted successfully');
    
  } catch (error) {
    console.error('Error in testCartCreation:', error);
  }
};

// Run the script
const run = async () => {
  const connection = await connectDB();
  await testCartCreation();
  await mongoose.connection.close();
  console.log('Database connection closed');
};

run();