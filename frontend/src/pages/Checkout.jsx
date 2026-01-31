import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import Button from '../components/common/Button';

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
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

  // Calculate order totals
  const subtotal = cart?.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) || 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || 
        !shippingInfo.state || !shippingInfo.zipCode || !shippingInfo.country) {
      alert('Please fill in all required shipping fields');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.nameOnCard) {
      alert('Please fill in all payment fields');
      return;
    }
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    try {
      // In a real app, this would process the payment first
      // For demo purposes, we'll just create the order
      const orderData = {
        shippingAddress: shippingInfo,
        paymentMethod: 'Credit Card'
      };
      
      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        alert('Order placed successfully! Thank you for your purchase.');
        navigate('/profile');
      } else {
        alert(`Error placing order: ${response.data.message || 'Unknown error'}. Please try again.`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Error placing order: ${errorMessage}. Please try again.`);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-teal to-green">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate('/shop')} size="lg">
              Continue Shopping
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-teal to-green">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Cart
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
              <div></div> {/* Spacer */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
            {/* Progress Steps */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Progress</h2>
                
                <div className="space-y-4">
                  <div className={`flex items-center p-3 rounded-lg ${step >= 1 ? 'bg-primary/10 border border-primary' : 'bg-gray-100'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-300'}`}>
                      1
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">Shipping Information</h3>
                      <p className="text-sm text-gray-600">Enter your delivery details</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center p-3 rounded-lg ${step >= 2 ? 'bg-primary/10 border border-primary' : 'bg-gray-100'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-300'}`}>
                      2
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">Payment Method</h3>
                      <p className="text-sm text-gray-600">Secure payment options</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center p-3 rounded-lg ${step >= 3 ? 'bg-primary/10 border border-primary' : 'bg-gray-100'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-300'}`}>
                      3
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">Order Review</h3>
                      <p className="text-sm text-gray-600">Confirm and place order</p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
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
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Forms */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center mb-6">
                    <MapPin className="h-6 w-6 text-primary mr-2" />
                    <h2 className="text-xl font-bold text-gray-800">Shipping Information</h2>
                  </div>
                  
                  <form onSubmit={handleShippingSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="123 Main Street"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="New York"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="NY"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="10001"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="United States"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button type="submit" size="lg">
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center mb-6">
                    <CreditCard className="h-6 w-6 text-primary mr-2" />
                    <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
                  </div>
                  
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.nameOnCard}
                          onChange={(e) => setPaymentInfo({...paymentInfo, nameOnCard: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-green/5 rounded-lg border border-green/20">
                        <Shield className="h-5 w-5 text-green mr-2" />
                        <p className="text-sm text-gray-700">
                          Your payment information is securely encrypted and processed.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        Back to Shipping
                      </Button>
                      <Button type="submit" size="lg">
                        Review Order
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Order Review</h2>
                  
                  <div className="space-y-6">
                    {/* Shipping Info */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Shipping Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium">{shippingInfo.fullName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                        {shippingInfo.phone && <p className="mt-2">{shippingInfo.phone}</p>}
                      </div>
                    </div>
                    
                    {/* Payment Info */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                          <span className="font-medium">
                            **** **** **** {paymentInfo.cardNumber.slice(-4)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Expires {paymentInfo.expiryDate}
                        </p>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                      <div className="space-y-4">
                        {cart.items.map((item) => (
                          <div key={item._id} className="flex items-center border-b pb-4">
                            <img
                              src={item.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                              alt={item.product?.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="ml-4 flex-grow">
                              <h4 className="font-medium text-gray-800">{item.product?.name}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="font-semibold">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span>₹{shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Back to Payment
                    </Button>
                    <Button onClick={handlePlaceOrder} size="lg">
                      Place Order
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;