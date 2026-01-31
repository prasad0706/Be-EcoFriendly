const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Reusable Products', 'Organic Foods', 'Eco-Friendly Home', 'Sustainable Fashion', 'Zero Waste', 'Natural Beauty', 'Green Tech', 'Other'],
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    publicId: String,
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
  specifications: {
    type: Map,
    of: String,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
productSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    return;
  }

  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.ratings.average = (sum / this.reviews.length).toFixed(1);
  this.ratings.count = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
