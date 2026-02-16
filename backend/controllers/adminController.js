const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const imagekit = require('../config/imagekit');
const { supabase } = require('../config/supabase');
const XLSX = require('xlsx');
const { 
  calculateCarbonFootprint, 
  calculateEcoScore, 
  calculateNetSavings,
  calculateWaterSaved,
  calculateTreesEquivalent
} = require('../utils/ecoCalculator');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Updated pending status to include all stages before shipping
    const pendingOrders = await Order.countDocuments({ 
      orderStatus: { $in: ['Order Placed', 'Payment Confirmed', 'Processing'] } 
    });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });

    // Recent orders with specific user fields
    const recentOrders = await Order.find()
      .populate('user', 'name email avatar')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(10);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .sort({ stock: 1 })
      .limit(10);

    // Calculate total eco impact across all paid orders
    const ecoImpact = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDoc'
        }
      },
      { $unwind: '$productDoc' },
      {
        $group: {
          _id: null,
          totalCo2Saved: { $sum: { $multiply: ['$items.quantity', { $ifNull: ['$productDoc.netSavings', 0] }] } },
          totalWaterSaved: { $sum: { $multiply: ['$items.quantity', { $ifNull: ['$productDoc.waterSaved', 0] }] } },
          totalTreesOffset: { $sum: { $multiply: ['$items.quantity', { $ifNull: ['$productDoc.treesEquivalent', 0] }] } }
        }
      }
    ]);

    const { range = '7d' } = req.query;
    const days = range === '30d' ? 30 : 7;

    // Calculate growth stats (Comparing current period vs previous period)
    const endDate = new Date();
    const midDate = new Date();
    midDate.setDate(endDate.getDate() - days);
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days * 2));

    const currentPeriodRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: midDate }, isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const previousPeriodRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: midDate }, isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const currentPeriodOrders = await Order.countDocuments({ createdAt: { $gte: midDate } });
    const previousPeriodOrders = await Order.countDocuments({ createdAt: { $gte: startDate, $lt: midDate } });

    const currentPeriodUsers = await User.countDocuments({ createdAt: { $gte: midDate } });
    const previousPeriodUsers = await User.countDocuments({ createdAt: { $gte: startDate, $lt: midDate } });

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number(((current - previous) / previous * 100).toFixed(1));
    };

    const revenueGrowth = calculateGrowth(currentPeriodRevenue[0]?.total || 0, previousPeriodRevenue[0]?.total || 0);
    const ordersGrowth = calculateGrowth(currentPeriodOrders, previousPeriodOrders);
    const usersGrowth = calculateGrowth(currentPeriodUsers, previousPeriodUsers);

    // Sales data for chart
    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: midDate }, isPaid: true } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        deliveredOrders,
        recentOrders,
        lowStockProducts,
        salesData,
        ecoImpact: {
          co2Saved: Number((ecoImpact[0]?.totalCo2Saved || 0).toFixed(2)),
          waterSaved: Math.round(ecoImpact[0]?.totalWaterSaved || 0),
          treesOffset: Number((ecoImpact[0]?.totalTreesOffset || 0).toFixed(2))
        },
        growth: {
          revenue: revenueGrowth,
          orders: ordersGrowth,
          users: usersGrowth
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { range = '7d' } = req.query;
    const endDate = new Date();
    let startDate = new Date();

    if (range === '7d') startDate.setDate(endDate.getDate() - 7);
    else if (range === '30d') startDate.setDate(endDate.getDate() - 30);
    else if (range === '90d') startDate.setDate(endDate.getDate() - 90);
    else startDate = new Date(0); // All time

    const matchQuery = {
      createdAt: { $gte: startDate, $lte: endDate },
      isPaid: true
    };

    // 1. Sales Trend
    const salesTrend = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2. Sales by Category
    const categorySales = await Order.aggregate([
      { $match: matchQuery },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          value: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $project: { name: '$_id', value: 1, _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    // 3. Top Selling Products
    const topProducts = await Order.aggregate([
      { $match: matchQuery },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          category: '$product.category',
          unitsSold: 1,
          revenue: 1,
          rating: '$product.ratings.average'
        }
      }
    ]);

    // 4. Overall Stats for period
    const totalUsers = await User.countDocuments();
    const periodStats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const stats = periodStats[0] || { totalRevenue: 0, totalOrders: 0 };

    // Simple conversion rate proxy (Orders / Total Users)
    const conversionRate = totalUsers > 0 ? ((stats.totalOrders / totalUsers) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        salesTrend,
        categorySales,
        topProducts,
        summary: {
          totalRevenue: stats.totalRevenue,
          totalOrders: stats.totalOrders,
          avgOrderValue: stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0,
          conversionRate
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Auto-calculate eco metrics if LCA data is provided
    if (productData.lca) {
      productData.carbonFootprint = calculateCarbonFootprint(productData.lca);
      productData.ecoScore = calculateEcoScore(productData.carbonFootprint, productData.category);
      productData.netSavings = calculateNetSavings(productData.carbonFootprint, productData.category);
      productData.waterSaved = calculateWaterSaved(productData.carbonFootprint, productData.category);
      productData.treesEquivalent = calculateTreesEquivalent(productData.netSavings);
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Auto-calculate eco metrics if LCA data is updated
    if (updateData.lca || updateData.category) {
      // We might need existing data if not all LCA stages are provided in update
      const existingProduct = await Product.findById(req.params.id);
      if (existingProduct) {
        const fullLca = { 
          ...(existingProduct.lca || {}), 
          ...(updateData.lca || {}) 
        };
        const category = updateData.category || existingProduct.category;
        
        updateData.carbonFootprint = calculateCarbonFootprint(fullLca);
        updateData.ecoScore = calculateEcoScore(updateData.carbonFootprint, category);
        updateData.netSavings = calculateNetSavings(updateData.carbonFootprint, category);
        updateData.waterSaved = calculateWaterSaved(updateData.carbonFootprint, category);
        updateData.treesEquivalent = calculateTreesEquivalent(updateData.netSavings);
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from ImageKit if they exist
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.publicId) {
          try {
            await imagekit.deleteFile(image.publicId);
          } catch (err) {
            console.error('ImageKit delete error:', err);
          }
        }
      }
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload product image
// @route   POST /api/admin/products/upload
// @access  Private/Admin
exports.uploadProductImage = async (req, res) => {
  try {
    // Check if file was uploaded via Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload to ImageKit
    const fileName = `${Date.now()}_${req.file.originalname}`;

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: fileName,
      folder: '/products',
      useUniqueFileName: true
    });

    res.json({
      success: true,
      data: {
        url: result.url,
        fileId: result.fileId
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.trackingHistory.push({
        status: orderStatus,
        timestamp: new Date(),
        comment: `Order status updated to ${orderStatus} by administrator.`
      });
    }
    
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === 'Paid') {
        order.isPaid = true;
        if (!order.paidAt) {
          order.paidAt = Date.now();
          // If tracking history doesn't have Payment Confirmed, add it
          if (!order.trackingHistory.some(h => h.status === 'Payment Confirmed')) {
            order.trackingHistory.push({
              status: 'Payment Confirmed',
              timestamp: new Date(),
              comment: 'Payment has been confirmed.'
            });
          }
        }
      }
    }

    if (orderStatus === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const products = await Product.find({ 'reviews.0': { $exists: true } })
      .populate('reviews.user', 'name email')
      .select('name reviews')
      .sort({ 'reviews.createdAt': -1 });

    // Flatten reviews with product info
    const allReviews = [];
    products.forEach(product => {
      product.reviews.forEach(review => {
        allReviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.name,
          user: review.user,
          userName: review.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        });
      });
    });

    // Sort and paginate
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedReviews = allReviews.slice(startIndex, endIndex);

    // Calculate average rating
    const averageRating = allReviews.length > 0
      ? (allReviews.reduce((acc, rev) => acc + rev.rating, 0) / allReviews.length).toFixed(1)
      : 0;
 
    res.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        totalPages: Math.ceil(allReviews.length / limit),
        currentPage: page,
        total: allReviews.length,
        averageRating
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:productId/:reviewId
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.reviews = product.reviews.filter(
      review => review._id.toString() !== reviewId
    );

    product.calculateAverageRating();
    await product.save();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    const validRoles = [
      'user',
      'admin',
      'super_admin',
      'customer',
      'admin_products',
      'admin_orders',
      'admin_customers',
      'admin_sales',
      'admin_reviews'
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order statistics for tabs
// @route   GET /api/admin/orders/stats
// @access  Private/Admin
exports.getOrderStats = async (req, res) => {
  try {
    // Get counts for each status
    const allOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ 
      orderStatus: { $in: ['Order Placed', 'Payment Confirmed', 'Processing'] } 
    });
    const shippedOrders = await Order.countDocuments({ 
      orderStatus: { $in: ['Shipped', 'Out for Delivery'] } 
    });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

    res.json({
      success: true,
      data: {
        allOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export orders to Excel
// @route   GET /api/admin/orders/export
// @access  Private/Admin
exports.exportOrdersToExcel = async (req, res) => {
  try {
    const { status, filter } = req.query;

    // Build query based on filters
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      query.createdAt = {
        $gte: today,
        $lt: tomorrow
      };
    } else if (filter === 'pending') {
      query.orderStatus = 'Processing';
    }

    // Fetch orders with populated user data
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Transform data for Excel
    const excelData = orders.map(order => ({
      'Order ID': order._id.toString(),
      'Customer Name': order.shippingAddress?.fullName || order.user?.name || 'N/A',
      'Customer Email': order.user?.email || 'N/A',
      'Contact Address': `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}, ${order.shippingAddress?.country || ''}`.replace(/^,\s*|,\s*$/, ''),
      'Number of Items': order.items?.length || 0,
      'Order Total Amount': `₹${order.totalPrice.toFixed(2)}`,
      'Payment Status': order.paymentStatus,
      'Payment Method': order.paymentMethod,
      'Order Status': order.orderStatus,
      'Order Date': new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Create filename based on status
    let fileName = 'orders';
    if (req.query.status) {
      const statusFileNameMap = {
        'Processing': 'pending_orders',
        'Shipped': 'shipped_orders',
        'Delivered': 'delivered_orders',
        'Cancelled': 'cancelled_orders'
      };
      fileName = statusFileNameMap[req.query.status] || 'orders';
    } else if (req.query.filter) {
      fileName = `${req.query.filter}_orders`;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}_${new Date().toISOString().split('T')[0]}.xlsx"`);

    // Send the file
    res.send(buffer);
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export orders to Excel'
    });
  }
};
