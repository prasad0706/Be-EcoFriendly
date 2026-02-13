import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Shield, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/currency';

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

  const subtotal = cart?.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) || 0;
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-10">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop">
              <Button className="px-10 py-4">Explore Products</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
              <AnimatePresence>
                {cart.items.map((item) => (
                  item && (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col sm:flex-row items-center p-6 gap-6"
                    >
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                        <img
                          src={item?.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-grow">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">{item.product?.category}</span>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.product?.name}</h3>
                        <p className="text-sm font-bold text-gray-500">{formatCurrency(item.price)}</p>
                      </div>

                      <div className="flex items-center space-x-4 bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, (item.quantity || 0) - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 disabled:opacity-30"
                          disabled={updatingItemId === item._id || item.quantity <= 1}
                        > <Minus className="h-4 w-4" /> </button>
                        <span className="text-sm font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, (item.quantity || 0) + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 disabled:opacity-30"
                          disabled={updatingItemId === item._id}
                        > <Plus className="h-4 w-4" /> </button>
                      </div>

                      <div className="text-right sm:min-w-[100px]">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-xs font-bold text-red-400 hover:text-red-500 mt-1 transition-colors"
                        > Remove </button>
                      </div>
                    </motion.div>
                  )))}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/shop" className="inline-flex items-center space-x-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>
              <button
                onClick={clearCart}
                className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
              > Clear Cart </button>
            </div>
          </div>

          {/* summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-32">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">EST. Tax (18%)</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(tax)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 text-lg font-bold"
              >
                Checkout Now
              </Button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Truck className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Eco-Friendly Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
