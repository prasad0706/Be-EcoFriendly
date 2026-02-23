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
      <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 md:w-24 h-20 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-sm">
              <ShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">Your cart is empty</h1>
            <p className="text-sm md:text-base text-gray-500 mb-8 md:mb-10 font-medium">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop">
              <Button className="px-10 py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-primary/10">Explore Products</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-8 md:mb-10 tracking-tight text-center md:text-left">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              <AnimatePresence>
                {cart.items.map((item) => (
                  item && (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col sm:flex-row items-center p-6 gap-6 text-center sm:text-left"
                    >
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                        <img
                          src={item?.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-grow">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block">{item.product?.category}</span>
                        <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{item.product?.name}</h3>
                        <p className="text-sm font-bold text-gray-400">{formatCurrency(item.price)}</p>
                      </div>

                      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, (item.quantity || 0) - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                          disabled={updatingItemId === item._id || item.quantity <= 1}
                        > <Minus className="h-3.5 w-3.5" /> </button>
                        <span className="text-sm font-black text-gray-900 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, (item.quantity || 0) + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                          disabled={updatingItemId === item._id}
                        > <Plus className="h-3.5 w-3.5" /> </button>
                      </div>

                      <div className="sm:text-right sm:min-w-[120px]">
                        <p className="text-lg font-black text-gray-900 mb-1">{formatCurrency(item.price * item.quantity)}</p>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center justify-center sm:justify-end gap-1 mx-auto sm:mx-0"
                        > 
                          <Trash2 className="h-3 w-3" />
                          Remove 
                        </button>
                      </div>
                    </motion.div>
                  )))}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link to="/shop" className="inline-flex items-center space-x-2 text-xs md:text-sm font-black text-primary uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>
              <button
                onClick={clearCart}
                className="text-[10px] md:text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
              > Clear Shopping Cart </button>
            </div>
          </div>

          {/* summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-premium border border-gray-100 sticky top-32">
              <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-black">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Shipping Fees</span>
                  <span className="text-gray-900 font-black">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Estimated Tax (18%)</span>
                  <span className="text-gray-900 font-black">{formatCurrency(tax)}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-primary tracking-tighter">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full py-5 text-base md:text-lg font-black rounded-xl md:rounded-2xl shadow-xl shadow-primary/20 uppercase tracking-widest"
              >
                Checkout Now
              </Button>

              <div className="mt-8 space-y-4 border-t border-gray-50 pt-6">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Truck className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Eco-Friendly Delivery</span>
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
