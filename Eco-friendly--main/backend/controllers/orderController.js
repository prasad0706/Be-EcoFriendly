const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  console.log('=== CREATE ORDER FUNCTION CALLED ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request headers:', req.headers);

  try {
    const { shippingAddress, paymentMethod } = req.body;

    console.log('=== ORDER CREATION STARTED ===');
    console.log('User ID:', req.user._id);
    console.log('Request body:', req.body);

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    console.log('Found cart:', JSON.stringify(cart, null, 2));

    if (!cart) {
      console.log('No cart found for user');
      return res.status(400).json({
        success: false,
        message: 'Cart not found',
      });
    }

    if (!cart.items || cart.items.length === 0) {
      console.log('Cart is empty');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    console.log('Cart items count:', cart.items.length);

    // Create order items from cart items
    const orderItems = cart.items.map(item => {
      console.log('Processing cart item:', item);
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      };
    });

    console.log('Processed order items:', orderItems);

    // Check if we have any order items
    if (orderItems.length === 0) {
      console.log('No order items after processing');
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    // Calculate prices
    const itemsPrice = cart.items.reduce((acc, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      console.log(`Item total for ${item.product?.name || item.product}:`, itemTotal);
      return acc + itemTotal;
    }, 0);

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    console.log('Calculated prices:', { itemsPrice, shippingPrice, taxPrice, totalPrice });

    // Prepare order data
    const orderData = {
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderStatus: 'Processing',
      paymentStatus: 'Pending',
    };

    console.log('Order data to create:', JSON.stringify(orderData, null, 2));

    // Create order
    const order = new Order(orderData);
    const savedOrder = await order.save();

    console.log('Created order:', savedOrder._id);

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: savedOrder,
    });
  } catch (error) {
    console.error('=== ERROR CREATING ORDER ===');
    console.error('Error creating order:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is owner of order or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.updateTime,
      emailAddress: req.body.emailAddress,
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};