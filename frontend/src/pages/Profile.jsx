import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Package,
  ShieldCheck,
  ChevronRight,
  Box,
  CreditCard,
  LogOut,
  Settings,
  Camera,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, settings
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
      // toast.success('Profile updated successfully'); // already handled in context
    } catch (error) {
      // toast.error('Failed to update profile'); // already handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-eco/10 text-green-eco border-green-eco/20';
      case 'Shipped': return 'bg-primary-blue/10 text-primary-blue border-primary-blue/20';
      case 'Processing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-blue rounded-[3rem] opacity-10 rotate-1 scale-[1.02] -z-10" />
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-primary/5 border border-white/50 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-blue flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-primary/30 transform group-hover:scale-105 transition-transform duration-500">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-lg">
                  <ShieldCheck className="h-6 w-6 text-green-eco" />
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                  Hello, <span className="gradient-text">{user.name.split(' ')[0]}</span>
                </h1>
                <p className="text-gray-500 font-medium text-lg mb-6">Welcome back to your eco-dashboard.</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-4 py-2 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500 uppercase tracking-widest border border-gray-100">
                    Member
                  </span>
                  <span className="px-4 py-2 bg-primary/5 rounded-2xl text-xs font-bold text-primary uppercase tracking-widest border border-primary/10">
                    {orders.length} Lifetime Orders
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button
                  onClick={handleLogout}
                  className="px-8 py-4 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-2xl font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Decorative Pattern */}
            <div className="absolute -right-20 -top-20 opacity-[0.03]">
              <User className="h-96 w-96" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'orders', label: 'Order History', icon: Package },
              { id: 'settings', label: 'Account Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-5 rounded-2xl flex items-center space-x-4 transition-all duration-300 font-bold text-sm ${activeTab === tab.id
                    ? 'bg-white shadow-lg shadow-primary/5 text-primary border border-primary/10 scale-105'
                    : 'bg-transparent text-gray-400 hover:bg-white/60 hover:text-gray-600'
                  }`}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-primary' : 'opacity-50'}`} />
                <span>{tab.label}</span>
                {activeTab === tab.id && <ChevronRight className="h-4 w-4 ml-auto" />}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                      <User className="h-6 w-6 text-primary" />
                      Personal Verification
                    </h2>
                    <Button
                      onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
                      variant={isEditing ? 'primary' : 'outline'}
                      className="rounded-xl px-6"
                      onClickCapture={(e) => {
                        if (isEditing) handleSubmit(e);
                        else setIsEditing(true);
                      }}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Details
                        </>
                      )}
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                        <div className={`flex items-center p-4 bg-gray-50 rounded-2xl border ${isEditing ? 'border-primary/30 bg-white' : 'border-transparent'}`}>
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <input
                            disabled={!isEditing}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-transparent w-full font-bold text-gray-900 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Channel</label>
                        <div className="flex items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                          <Mail className="h-5 w-5 text-gray-400 mr-3" />
                          <input
                            disabled
                            value={formData.email}
                            className="bg-transparent w-full font-bold text-gray-500 cursor-not-allowed"
                          />
                          <ShieldCheck className="h-4 w-4 text-green-eco ml-2" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Phone Line</label>
                        <div className={`flex items-center p-4 bg-gray-50 rounded-2xl border ${isEditing ? 'border-primary/30 bg-white' : 'border-transparent'}`}>
                          <Phone className="h-5 w-5 text-gray-400 mr-3" />
                          <input
                            disabled={!isEditing}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Add phone details..."
                            className="bg-transparent w-full font-bold text-gray-900 focus:outline-none placeholder:font-medium placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-8 border-t border-gray-100">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        Shipping Coordinates
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <input
                            disabled={!isEditing}
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            placeholder="Street Address"
                            className={`w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 focus:outline-none transition-all ${isEditing ? 'bg-white border border-primary/30 focus:shadow-lg focus:shadow-primary/5' : 'border border-transparent'}`}
                          />
                        </div>
                        <div>
                          <input
                            disabled={!isEditing}
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            placeholder="City"
                            className={`w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 focus:outline-none transition-all ${isEditing ? 'bg-white border border-primary/30' : 'border border-transparent'}`}
                          />
                        </div>
                        <div>
                          <input
                            disabled={!isEditing}
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleChange}
                            placeholder="Postal Code"
                            className={`w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 focus:outline-none transition-all ${isEditing ? 'bg-white border border-primary/30' : 'border border-transparent'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[500px]"
                >
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-3">
                    <Package className="h-6 w-6 text-primary" />
                    Order Archive
                  </h2>

                  {ordersLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                      <p className="font-bold text-sm text-gray-400 uppercase tracking-widest">Retrieving Data...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="grid gap-6">
                      {orders.map((order) => (
                        <div key={order._id} className="group p-6 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                            <Package className="h-32 w-32 rotate-12" />
                          </div>

                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                <ShoppingBag className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-base font-black text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${getStatusStyle(order.orderStatus)}`}>
                                    {order.orderStatus}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-8 border-t md:border-t-0 border-gray-200 pt-4 md:pt-0">
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total</p>
                                <p className="text-lg font-black text-gray-900">{formatCurrency(order.totalPrice)}</p>
                              </div>
                              <div className="hidden md:block w-px h-10 bg-gray-200" />
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Items</p>
                                <p className="text-lg font-black text-gray-900">{order.items?.length || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                      <Box className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-xl font-black text-gray-900 mb-2">No Active Orders</h3>
                      <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">Your sustainable journey hasn't started yet. Explore our collection to make an impact.</p>
                      <Button onClick={() => navigate('/shop')} className="px-8 rounded-2xl shadow-lg shadow-primary/20">
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100"
                >
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Account Control</h2>
                  <div className="space-y-6">
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                      <h3 className="text-red-900 font-bold mb-2">Danger Zone</h3>
                      <p className="text-red-700/70 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                      <button className="px-6 py-3 bg-white text-red-500 font-bold rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-colors shadow-sm text-sm">
                        Delete Account
                      </button>
                    </div>
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
