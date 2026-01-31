import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit3, Save, X, ShoppingBag, Shield, ChevronRight, Box } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
      fetchOrders();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await api.get('/orders/myorders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Profile Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-mint rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">{user.role}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                    <p className="text-sm font-bold text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
                    <p className="text-sm font-bold text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-8"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="bg-primary rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Sustainable Impact</h3>
                <p className="text-sm opacity-90 mb-4">You have made {orders.length} eco-friendly purchases with Be-Eco.</p>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-3/4 rounded-full" />
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield className="h-16 w-16" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-2/3 space-y-8">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                    <Edit3 className="h-5 w-5 mr-3 text-primary" />
                    Update Information
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">Full Name</label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-400 block mb-2 cursor-not-allowed">Email (Read Only)</label>
                        <input
                          value={formData.email}
                          disabled
                          className="w-full px-5 py-3 bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">Phone Number</label>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Shipping Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="text-sm font-bold text-gray-700 block mb-2">Street Address</label>
                          <input
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-gray-700 block mb-2">City</label>
                          <input
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-gray-700 block mb-2">ZIP Code</label>
                          <input
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                      > Cancel </button>
                      <Button type="submit" loading={loading}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-3 text-primary" />
                      Order History
                    </h3>

                    {ordersLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            className="p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-primary/30 transition-all group"
                          >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                              <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Order #{order._id.substring(0, 8)}</p>
                                <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalPrice)}</p>
                                  <div className="flex items-center justify-end space-x-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-green-500' : 'bg-orange-500'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                      {order.isDelivered ? 'Delivered' : 'Processing'}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Box className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No orders found.</p>
                        <Link to="/shop" className="text-primary font-bold hover:underline mt-2 inline-block">Start shopping</Link>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-primary" />
                      Default Address
                    </h3>
                    {user.address?.street ? (
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="font-bold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                          {user.address.street}<br />
                          {user.address.city}, {user.address.state} {user.address.zipCode}<br />
                          {user.address.country}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No address saved yet.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
