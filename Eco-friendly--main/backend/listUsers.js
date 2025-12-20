#!/usr/bin/env node

// Script to list all users
// Usage: node listUsers.js

const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
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

// List all users
const listUsers = async () => {
  try {
    // Find all users
    const users = await User.find({}, 'name email role');
    
    if (users.length === 0) {
      console.log('No users found');
      return;
    }
    
    console.log('\nUsers:');
    console.log('------');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    console.log('');
  } catch (error) {
    console.error('Error listing users:', error.message);
    process.exit(1);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await listUsers();
  mongoose.connection.close();
};

run();