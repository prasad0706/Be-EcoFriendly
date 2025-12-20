require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Reusable Bamboo Straws Set',
    description: 'Set of 6 eco-friendly bamboo straws with cleaning brush. Perfect alternative to plastic straws.',
    price: 12.99,
    originalPrice: 19.99,
    category: 'Reusable Products',
    images: [{
      url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500',
      publicId: 'sample1'
    }],
    stock: 50,
    featured: true,
    ecoScore: 95,
    tags: ['bamboo', 'reusable', 'zero-waste'],
    specifications: {
      'Material': 'Natural Bamboo',
      'Quantity': '6 straws + brush',
      'Length': '8 inches'
    }
  },
  {
    name: 'Organic Cotton Tote Bag',
    description: 'Durable and stylish organic cotton tote bag. Perfect for grocery shopping and daily use.',
    price: 15.99,
    originalPrice: 24.99,
    category: 'Sustainable Fashion',
    images: [{
      url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500',
      publicId: 'sample2'
    }],
    stock: 100,
    featured: true,
    ecoScore: 90,
    tags: ['cotton', 'organic', 'reusable'],
    specifications: {
      'Material': '100% Organic Cotton',
      'Size': 'Large',
      'Capacity': '15L'
    }
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24h and hot for 12h.',
    price: 29.99,
    originalPrice: 39.99,
    category: 'Reusable Products',
    images: [{
      url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
      publicId: 'sample3'
    }],
    stock: 75,
    featured: true,
    ecoScore: 88,
    tags: ['stainless-steel', 'insulated', 'bpa-free'],
    specifications: {
      'Material': 'Stainless Steel',
      'Capacity': '750ml',
      'Insulation': 'Double-walled'
    }
  },
  {
    name: 'Beeswax Food Wraps',
    description: 'Set of 3 reusable beeswax wraps. Natural alternative to plastic wrap.',
    price: 18.99,
    category: 'Zero Waste',
    images: [{
      url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
      publicId: 'sample4'
    }],
    stock: 60,
    featured: false,
    ecoScore: 92,
    tags: ['beeswax', 'reusable', 'natural'],
    specifications: {
      'Material': 'Organic Cotton & Beeswax',
      'Sizes': 'Small, Medium, Large',
      'Quantity': '3 wraps'
    }
  },
  {
    name: 'Bamboo Toothbrush Set',
    description: 'Pack of 4 biodegradable bamboo toothbrushes with soft bristles.',
    price: 9.99,
    originalPrice: 14.99,
    category: 'Natural Beauty',
    images: [{
      url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500',
      publicId: 'sample5'
    }],
    stock: 120,
    featured: false,
    ecoScore: 94,
    tags: ['bamboo', 'biodegradable', 'dental'],
    specifications: {
      'Material': 'Bamboo Handle',
      'Bristles': 'Soft BPA-Free',
      'Quantity': '4 toothbrushes'
    }
  },
  {
    name: 'Solar-Powered Phone Charger',
    description: 'Portable solar charger for phones and small devices. Perfect for outdoor adventures.',
    price: 49.99,
    category: 'Green Tech',
    images: [{
      url: 'https://images.unsplash.com/photo-1509390144868-87ef9c78c90e?w=500',
      publicId: 'sample6'
    }],
    stock: 30,
    featured: true,
    ecoScore: 85,
    tags: ['solar', 'portable', 'renewable'],
    specifications: {
      'Power': '10000mAh',
      'Panels': 'Monocrystalline',
      'Ports': '2 USB'
    }
  },
  {
    name: 'Organic Green Tea',
    description: 'Premium organic green tea from sustainable farms. 50 biodegradable tea bags.',
    price: 14.99,
    category: 'Organic Foods',
    images: [{
      url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500',
      publicId: 'sample7'
    }],
    stock: 80,
    featured: false,
    ecoScore: 91,
    tags: ['organic', 'tea', 'fair-trade'],
    specifications: {
      'Type': 'Green Tea',
      'Origin': 'Organic Farms',
      'Quantity': '50 tea bags'
    }
  },
  {
    name: 'Recycled Yoga Mat',
    description: 'Eco-friendly yoga mat made from recycled materials. Non-slip and durable.',
    price: 45.99,
    originalPrice: 65.99,
    category: 'Eco-Friendly Home',
    images: [{
      url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
      publicId: 'sample8'
    }],
    stock: 40,
    featured: true,
    ecoScore: 87,
    tags: ['recycled', 'yoga', 'fitness'],
    specifications: {
      'Material': 'Recycled TPE',
      'Size': '183cm x 61cm',
      'Thickness': '6mm'
    }
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products added successfully!');
    console.log(`Added ${sampleProducts.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
