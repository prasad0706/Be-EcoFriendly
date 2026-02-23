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
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-premium p-10 md:p-16 border border-gray-100">
            <ShoppingBag className="h-12 w-12 md:h-16 md:w-16 text-gray-200 mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">Your cart is empty</h1>
            <p className="text-sm md:text-base text-gray-500 mb-8 font-medium">You need to add items to your cart before checking out.</p>
            <Link to="/shop">
              <Button className="px-10 py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm">Explore Products</Button>
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
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>
            <p className="text-sm md:text-base text-gray-500 font-medium mt-2">Complete your order in 3 simple steps.</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 gap-1 overflow-x-auto scrollbar-hide">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex items-center space-x-2 px-4 md:px-6 py-2 rounded-lg md:rounded-xl transition-all shrink-0 ${step === s.id ? 'bg-primary text-white shadow-md' : 'text-gray-400'
                  }`}
              >
                <s.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-premium border border-gray-100"
                >
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-8 tracking-tight">Shipping Information</h2>

                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                      <div className="md:col-span-2">
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="Your complete name"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="House number and street name"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">City</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">State / Province</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">ZIP / Postal Code</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="000000"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Country</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    <div className="flex justify-center md:justify-end pt-6">
                      <Button type="submit" className="w-full md:w-auto px-10 py-4.5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-primary/10 h-14 md:h-auto">
                        Continue to Payment
                        <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-premium border border-gray-100"
                >
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-8 tracking-tight">Payment Method</h2>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                      <div className="md:col-span-2">
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.nameOnCard}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="Name as it appears on card"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Card Number</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Expiration Date</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="MM / YY"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">CVV</label>
                        <input
                          type="password"
                          required
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all text-sm md:text-base border-gray-100"
                          placeholder="•••"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-primary shrink-0" />
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">Your payment information is end-to-end encrypted.</p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[10px] md:text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                      > Back to Shipping </button>
                      <Button type="submit" className="w-full md:w-auto px-10 py-4.5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm h-14 md:h-auto shadow-xl shadow-primary/10">
                        Review Order
                        <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-premium border border-gray-100"
                >
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-8 tracking-tight">Review Your Order</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
                    <div>
                      <h3 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Shipping Information</h3>
                      <div className="bg-gray-50/50 p-5 md:p-6 rounded-2xl border border-gray-100">
                        <p className="font-black text-gray-900 mb-1">{shippingInfo.fullName}</p>
                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-bold">
                          {shippingInfo.address}<br />
                          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                          {shippingInfo.country}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Information</h3>
                      <div className="bg-gray-50/50 p-5 md:p-6 rounded-2xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-2">
                          <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
                          <p className="font-black text-gray-900 text-sm md:text-base">Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                        </div>
                        <p className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">{paymentInfo.nameOnCard}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Order Items ({cart.items.length})</h3>
                    <div className="bg-gray-50/30 rounded-2xl overflow-hidden divide-y divide-white border border-gray-100">
                      {cart.items.map((item) => (
                        <div key={item._id} className="flex items-center p-4 gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                            <img src={item.product?.images?.[0]?.url} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-black text-gray-900 text-xs md:text-sm leading-tight truncate">{item.product?.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-black text-gray-900 text-xs md:text-sm shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-[10px] md:text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors"
                    > Back to Payment </button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full md:w-auto px-12 py-5 rounded-xl md:rounded-2xl text-base md:text-lg font-black uppercase tracking-widest h-14 md:h-auto shadow-2xl shadow-primary/20"
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
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-premium border border-gray-100 sticky top-32">
              <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-black">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Shipping Fees</span>
                  <span className="text-gray-900 font-black">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Total Tax (18%)</span>
                  <span className="text-gray-900 font-black">{formatCurrency(tax)}</span>
                </div>
                <div className="pt-4 mt-2 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900">Total</span>
                  <span className="text-2xl font-black text-primary tracking-tighter">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Truck className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Carbon Neutral Guaranteed</span>
                </div>
                <p className="text-[9px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">By placing order, you agree to our Terms and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
