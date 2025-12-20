#!/usr/bin/env node

// Script to test route handlers
// Usage: node testRoutes.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

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

// Mock user for testing
const mockUser = {
  _id: '6933e538b79887eccae29161',
  name: 'Test User',
  email: 'test@example.com'
};

// Mock request and response objects
const mockReq = {
  user: mockUser,
  params: {},
  body: {}
};

const mockRes = {
  json: function(data) {
    console.log('Response:', data);
    return this;
  },
  status: function(code) {
    console.log('Status:', code);
    return this;
  }
};

// Test the cart controller
const testCartController = async () => {
  try {
    console.log('Testing cart controller...');
    
    const cartController = require('./controllers/cartController');
    
    console.log('Calling getCart...');
    await cartController.getCart(mockReq, mockRes);
    
    console.log('Cart controller test completed');
  } catch (error) {
    console.error('Error in testCartController:', error);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await testCartController();
  await mongoose.connection.close();
  console.log('Database connection closed');
};

run();