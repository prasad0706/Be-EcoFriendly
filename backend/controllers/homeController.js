const Banner = require('../models/Banner');
const Deal = require('../models/Deal');
const Product = require('../models/Product');

// @desc    Get all home data (banners, deals, categories)
// @route   GET /api/home
// @access  Public
exports.getHomeData = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort('order');
    const deals = await Deal.find({ active: true });
    
    // Get unique categories from products
    const categories = await Product.distinct('category');

    res.json({
      success: true,
      data: {
        banners,
        deals,
        categories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get categories only
// @route   GET /api/home/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
