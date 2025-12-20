#!/usr/bin/env node

// Script to create a test user
// Usage: node createTestUser.js

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create test user
const createTestUser = async () => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: 'test@example.com' });
    if (userExists) {
      console.log('Test user already exists');
      console.log('User:', userExists.name, userExists.email);
      process.exit(0);
    }
    
    // Create new user without explicitly setting supabaseId
    // This will ensure supabaseId is not included in the document
    // and thus won't cause duplicate key issues with sparse index
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      // Note: Not including supabaseId to avoid null values
    });
    
    console.log('Test user created successfully:');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('ID:', user._id);
    console.log('supabaseId:', user.supabaseId);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error.message);
    process.exit(1);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createTestUser();
  mongoose.connection.close();
};

run();