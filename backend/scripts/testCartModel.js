#!/usr/bin/env node

// Script to test Cart model
// Usage: node testCartModel.js

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

// Test Cart model
const testCartModel = async () => {
  try {
    // Find the test user
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('Test user not found');
      return;
    }
    
    console.log('Found user:', user._id);
    
    // Delete any existing cart for this user
    await Cart.deleteMany({ user: user._id });
    console.log('Deleted existing carts for user');
    
    // Try to create a cart using the model directly
    console.log('Creating cart...');
    const cart = new Cart({ 
      user: user._id, 
      items: [] 
    });
    
    console.log('Saving cart...');
    await cart.save();
    
    console.log('Cart saved successfully:', cart._id);
    
    // Test the pre-save hook
    console.log('Testing pre-save hook...');
    cart.items.push({
      product: user._id, // Using user ID as a dummy product ID
      quantity: 2,
      price: 100
    });
    
    console.log('Saving cart with items...');
    await cart.save();
    
    console.log('Cart with items saved successfully');
    console.log('Total items:', cart.totalItems);
    console.log('Total price:', cart.totalPrice);
    
    // Clean up - delete the cart
    await Cart.findByIdAndDelete(cart._id);
    console.log('Cart deleted successfully');
    
  } catch (error) {
    console.error('Error in testCartModel:', error);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await testCartModel();
  await mongoose.connection.close();
  console.log('Database connection closed');
};

run();