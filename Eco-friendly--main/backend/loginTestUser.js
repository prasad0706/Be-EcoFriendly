#!/usr/bin/env node

// Script to login as test user and get a valid token
// Usage: node loginTestUser.js

const axios = require('axios');
require('dotenv').config();

const loginUser = async () => {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('Login successful!');
    console.log('Token:', response.data.data.token);
    console.log('\nYou can use this token in your requests by setting the Authorization header:');
    console.log(`Authorization: Bearer ${response.data.data.token}`);
    
    return response.data.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

loginUser();