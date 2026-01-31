import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, Shield, ChevronRight, Truck, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const subtotal = cart?.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) || 0;
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        shippingAddress: shippingInfo,
        paymentMethod: 'Credit Card'
      };

      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/profile');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please check your connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-40 pb-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-sm p-16 border border-gray-100">
            <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">You need to add items to your cart before checking out.</p>
            <Link to="/shop">
              <Button>Explore Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, label: 'Shipping', icon: MapPin },
    { id: 2, label: 'Payment', icon: CreditCard },
    { id: 3, label: 'Review', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-500 font-medium mt-2">Complete your order in 3 simple steps.</p>
          </div>

          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 gap-1">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex items-center space-x-2 px-6 py-2 rounded-xl transition-all ${step === s.id ? 'bg-primary text-white shadow-md' : 'text-gray-400'
                  }`}
              >
                <s.icon className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Information</h2>

                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 block mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 block mb-2">Street Address</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="House number and street name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">City</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">State / Province</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">ZIP / Postal Code</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="ZIP Code"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">Country</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button type="submit" className="px-10 py-4 font-bold">
                        Continue to Payment
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Method</h2>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 block mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.nameOnCard}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="Name as it appears on card"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 block mb-2">Card Number</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">Expiration Date</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="MM / YY"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">CVV</label>
                        <input
                          type="password"
                          required
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          placeholder="•••"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">Your payment info is secure and encrypted.</p>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                      > Back to Shipping </button>
                      <Button type="submit" className="px-10 py-4 font-bold">
                        Review Order
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Review Your Order</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping To</h3>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <p className="font-bold text-gray-900 mb-1">{shippingInfo.fullName}</p>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                          {shippingInfo.address}<br />
                          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                          {shippingInfo.country}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Method</h3>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-2">
                          <CreditCard className="h-5 w-5 text-gray-700" />
                          <p className="font-bold text-gray-900">Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                        </div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{paymentInfo.nameOnCard}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</h3>
                    <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-white border border-gray-100">
                      {cart.items.map((item) => (
                        <div key={item._id} className="flex items-center p-4 gap-4">
                          <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-white flex-shrink-0">
                            <img src={item.product?.images?.[0]?.url} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.product?.name}</h4>
                            <p className="text-xs font-medium text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-gray-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                    > Back to Payment </button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="px-12 py-5 text-lg font-bold"
                      loading={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order Now'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-32">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Tax (18%)</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(tax)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Truck className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest italic text-primary">Carbon Neutral Delivery</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">By placing your order, you agree to our Terms of Use and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
