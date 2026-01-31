const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {

    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Error in getCart:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {


    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    console.log('Found product:', product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      console.log('Creating new cart for user:', req.user._id);
      cart = await Cart.create({
        user: req.user._id,
        items: [{
          product: productId,
          quantity,
          price: product.price,
        }],
      });
      console.log('Created new cart:', cart._id);
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = product.price;
        console.log('Updated existing item quantity');
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
        console.log('Added new item to cart');
      }

      await cart.save();
      console.log('Saved cart');
    }

    cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    console.log('Returning updated cart');

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Error in addToCart:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    console.log('updateCartItem called with:', {
      userId: req.user._id,
      itemId: req.params.itemId,
      body: req.body
    });

    const { quantity } = req.body;

    // Validate quantity
    if (quantity < 1) {
      console.log('Invalid quantity:', quantity);
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    console.log('Found cart:', cart?._id);

    if (!cart) {
      console.log('Cart not found for user:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Find item by converting itemId to string for comparison
    const item = cart.items.find(item => {
      const match = item._id.toString() === req.params.itemId;
      console.log('Comparing item IDs:', {
        item_id: item._id.toString(),
        param_id: req.params.itemId,
        match: match
      });
      return match;
    });

    if (!item) {
      console.log('Item not found in cart:', req.params.itemId);
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    const product = await Product.findById(item.product);
    console.log('Found product:', product?._id);

    if (!product) {
      console.log('Product not found:', item.product);
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      console.log('Insufficient stock:', {
        stock: product.stock,
        requested: quantity
      });
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    item.quantity = quantity;
    await cart.save();
    console.log('Cart item updated successfully');

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    console.log('Returning updated cart');

    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    console.log('removeFromCart called with:', {
      userId: req.user._id,
      itemId: req.params.itemId
    });

    const cart = await Cart.findOne({ user: req.user._id });
    console.log('Found cart:', cart?._id);

    if (!cart) {
      console.log('Cart not found for user:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Filter out the item by converting itemId to string for comparison
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => {
        const match = item._id.toString() !== req.params.itemId;
        console.log('Comparing item IDs for removal:', {
          item_id: item._id.toString(),
          param_id: req.params.itemId,
          will_remove: !match
        });
        return match;
      }
    );

    // Check if item was actually removed
    if (cart.items.length === initialLength) {
      console.log('Item not found in cart for removal:', req.params.itemId);
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    await cart.save();
    console.log('Item removed from cart successfully');

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    console.log('Returning updated cart');

    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: updatedCart,
    });
  } catch (error) {
    console.error('Error in clearCart:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};