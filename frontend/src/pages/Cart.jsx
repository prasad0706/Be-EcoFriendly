import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const navigate = useNavigate();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItemId(itemId);
    try {
      await updateCartItem(itemId, newQuantity);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const subtotal = cart?.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) || 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-teal to-green">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <ShoppingBag className="h-24 w-24 text-green mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/shop">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-teal to-green">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
            <p className="text-gray-600">
              {cart.totalItems || 0} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 p-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cart.items?.map((item) => (
                  item ? (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center border rounded-xl p-4"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={item?.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={item.product?.name || 'Product Image'}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800">{item.product?.name || 'Unknown Product'}</h3>
                      <p className="text-green font-medium">₹{(item.price || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{item.product?.category || ''}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, (item.quantity || 0) - 1)}
                          disabled={updatingItemId === item._id}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2">{item.quantity || 0}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, (item.quantity || 0) + 1)}
                          disabled={updatingItemId === item._id}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="font-semibold text-gray-800">
                        ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                ) : null
              ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
                <Link to="/shop">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₹{shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full mt-6"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="text-center text-sm text-gray-500 mt-4">
                    Free shipping on orders over ₹50
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;