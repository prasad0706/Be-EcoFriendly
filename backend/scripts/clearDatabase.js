#!/usr/bin/env node

/**
 * Script to clear test data from the database.
 * This clears Orders, Reviews, Carts, and Products.
 * It also provides an option to clear non-admin users.
 * 
 * Usage: node scripts/clearDatabase.js [--all-users]
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import Models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Review model might not exist yet
let Review;
try {
    Review = require('../models/Review');
} catch (e) {
    // Model not found, skip reviews later
}

const clearAllUsers = process.argv.includes('--all-users');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\x1b[32mMongoDB Connected: ${conn.connection.host}\x1b[0m`);
    } catch (error) {
        console.error(`\x1b[31mError: ${error.message}\x1b[0m`);
        process.exit(1);
    }
};

const clearData = async () => {
    try {
        console.log('\x1b[36mStarting database cleanup...\x1b[0m');

        // 1. Clear Orders
        const orderCount = await Order.countDocuments();
        await Order.deleteMany({});
        console.log(`- Cleared ${orderCount} Orders`);

        // 2. Clear Reviews (if model exists)
        if (Review) {
            const reviewCount = await Review.countDocuments();
            await Review.deleteMany({});
            console.log(`- Cleared ${reviewCount} Reviews`);
        } else {
            console.log('- Skipping Reviews (Model not found)');
        }

        // 3. Clear Carts
        const cartCount = await Cart.countDocuments();
        await Cart.deleteMany({});
        console.log(`- Cleared ${cartCount} Carts`);

        // 4. Clear Products
        const productCount = await Product.countDocuments();
        await Product.deleteMany({});
        console.log(`- Cleared ${productCount} Products`);

        // 5. Handle Users
        if (clearAllUsers) {
            const adminCount = await User.countDocuments({ role: 'admin' });
            const userCount = await User.countDocuments({ role: { $ne: 'admin' } });
            await User.deleteMany({ role: { $ne: 'admin' } });
            console.log(`- Cleared ${userCount} non-admin Users (Preserved ${adminCount} Admins)`);
        } else {
            console.log('- User accounts preserved (use --all-users to clear non-admins)');
        }

        console.log('\n\x1b[32m\x1b[1mCleanup complete! Your database is now fresh and ready for real use.\x1b[0m');

    } catch (error) {
        console.error(`\x1b[31mCleanup failed: ${error.message}\x1b[0m`);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

const run = async () => {
    await connectDB();

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\x1b[31m\x1b[1mWARNING: This will permanently delete data from your database!\x1b[0m');
    readline.question('Are you sure you want to proceed? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes') {
            await clearData();
        } else {
            console.log('Cleanup cancelled.');
            mongoose.connection.close();
            process.exit(0);
        }
        readline.close();
    });
};

run();
