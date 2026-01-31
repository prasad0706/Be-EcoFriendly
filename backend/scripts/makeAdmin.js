#!/usr/bin/env node

// Script to make a user an admin
// Usage: node makeAdmin.js <user-email>

const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.log('Usage: node makeAdmin.js <user-email>');
  process.exit(1);
}

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

// Make user an admin
const makeAdmin = async () => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    // Update user role to admin (bypass validation and middleware)
    const result = await User.updateOne(
      { _id: user._id },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`User ${user.name} (${user.email}) has been made an admin`);
    } else {
      console.log(`No changes were made to user ${user.name} (${user.email})`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error making user admin:', error.message);
    process.exit(1);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await makeAdmin();
  mongoose.connection.close();
};

run();