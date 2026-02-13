require('dotenv').config();
const mongoose = require('mongoose');
const Banner = require('../models/Banner');
const Deal = require('../models/Deal');
const Product = require('../models/Product');

const banners = [
  {
    title: 'Better for You, Better for Earth',
    subtitle: 'Discover our curated collection of sustainable alternatives.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&h=900&fit=crop',
    link: '/shop',
    ctaText: 'Shop Now',
    active: true,
    order: 1
  },
  {
    title: 'Zero Waste Lifestyle',
    subtitle: 'Start your journey towards a cleaner future today.',
    image: 'https://images.unsplash.com/photo-1591193516411-eb69c6f96615?w=1600&h=900&fit=crop',
    link: '/shop?category=Zero+Waste',
    ctaText: 'Explore More',
    active: true,
    order: 2
  }
];

const deals = [
  {
    title: 'Summer Eco Sale',
    description: 'Up to 40% off on all bamboo products.',
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1610473068502-990db86c5f78?w=800&h=400&fit=crop',
    link: '/shop?category=Reusable+Products',
    active: true
  },
  {
    title: 'Organic Fair',
    description: 'Buy 2 Get 1 on all organic food items.',
    discount: 'BUY 2 GET 1',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    link: '/shop?category=Organic+Foods',
    active: true
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Banner.deleteMany();
    await Deal.deleteMany();

    // Insert new
    await Banner.insertMany(banners);
    await Deal.insertMany(deals);

    // Update products with random ecoScore
    const products = await Product.find();
    for (const product of products) {
      product.ecoScore = Math.floor(Math.random() * 41) + 60; // 60-100
      await product.save();
    }

    console.log('Home data seeded and products updated successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
