const Offer = require('../models/Offer');
const Product = require('../models/Product');

// GET /api/offers?productId=xyz
exports.getOffers = async (req, res) => {
  try {
    const { productId } = req.query;
    let category = null;

    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        category = product.category;
      }
    }

    const query = {
      active: true,
      expiryDate: { $gte: new Date() }
    };

    if (category) {
      query.$or = [
        { applicableCategories: { $size: 0 } }, // Universal offers
        { applicableCategories: category }      // Category specific
      ];
    }

    const offers = await Offer.find(query);

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
