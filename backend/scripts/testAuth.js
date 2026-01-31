#!/usr/bin/env node

// Script to test auth middleware
// Usage: node testAuth.js

const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');

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

// Mock request and response objects
const mockReq = {
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzNlNTM4Yjc5ODg3ZWNjYWUyOTE2MSIsImlhdCI6MTc2NTAwODcxOSwiZXhwIjoxNzY1NjEzNTE5fQ.eug1fw52XxsVBRnQEzSvQgr1ksQuZlWnDwAJ31HZzf0'
  }
};

const mockRes = {
  status: function(code) {
    console.log('Status:', code);
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('Response:', data);
    return this;
  }
};

// Test the auth middleware
const testAuthMiddleware = async () => {
  try {
    console.log('Testing auth middleware...');
    
    const auth = require('./middleware/auth');
    
    console.log('Calling protect middleware...');
    
    // Create a promise to handle the async middleware
    const nextCalled = new Promise((resolve) => {
      auth.protect(mockReq, mockRes, () => {
        console.log('Next function called');
        resolve(true);
      });
    });
    
    const result = await nextCalled;
    console.log('Auth middleware test completed, next called:', result);
    console.log('User attached to request:', mockReq.user);
    
  } catch (error) {
    console.error('Error in testAuthMiddleware:', error);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await testAuthMiddleware();
  await mongoose.connection.close();
  console.log('Database connection closed');
};

run();