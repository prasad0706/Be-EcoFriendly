const mongoose = require('mongoose');
const dns = require('dns');

// Fix for ECONNREFUSED when resolving MongoDB Atlas SRV records on some networks (common on macOS/Node 18+)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Note: Could not set custom DNS servers for MongoDB resolution.');
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
