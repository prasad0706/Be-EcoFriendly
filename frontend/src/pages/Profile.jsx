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
  ShoppingBag,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';
import OrderTrackingModal from '../components/product/OrderTrackingModal';

const Profile = () => {
  const queryClient = useQueryClient();
  const { user, isAdmin, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, settings
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
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

  // Real-time order fetching with React Query
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const response = await api.get('/orders/myorders');
      return response.data.data;
    },
    enabled: !!user,
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });

  const orders = ordersData || [];

  // Update selected order details in real-time if modal is open
  useEffect(() => {
    if (isTrackingModalOpen && selectedOrder && orders.length > 0) {
      const updatedOrder = orders.find(o => o._id === selectedOrder._id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  }, [orders, isTrackingModalOpen, selectedOrder]);

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
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
      case 'Out for Delivery': return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      case 'Processing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Order Placed': return 'bg-primary/10 text-primary border-primary/20';
      case 'Payment Confirmed': return 'bg-mint text-primary border-primary/10';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 md:pt-32 pb-12 md:pb-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="relative mb-8 md:mb-12 text-center md:text-left">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-blue rounded-[2rem] md:rounded-[3rem] opacity-10 rotate-1 scale-[1.02] -z-10" />
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-xl shadow-primary/5 border border-white/50 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-blue flex items-center justify-center text-3xl md:text-5xl font-black text-white shadow-2xl shadow-primary/30 transform group-hover:scale-105 transition-transform duration-500">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-xl shadow-lg border border-gray-100">
                  <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-green-eco" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-2 truncate">
                  Hello, <span className="gradient-text">{user.name.split(' ')[0]}</span>
                </h1>
                <p className="text-sm md:text-lg text-gray-500 font-medium mb-6">Welcome back to your eco-dashboard.</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                  <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black text-gray-400 border border-gray-100 uppercase tracking-widest">
                    Verified Member
                  </span>
                  <span className="px-3 md:px-4 py-1.5 md:py-2 bg-primary/5 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black text-primary border border-primary/10 uppercase tracking-widest">
                    {orders.length} Global Orders
                  </span>
                </div>
              </div>

               <div className="flex flex-col gap-3 w-full md:w-auto">
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-6 md:px-8 py-3.5 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-primary/20 hover:scale-[1.02]"
                  >
                    <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-6 md:px-8 py-3.5 md:py-4 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-xl md:rounded-2xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] md:text-xs"
                >
                  <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Decorative Pattern */}
            <div className="absolute -right-20 -top-20 opacity-[0.03] hidden md:block">
              <User className="h-96 w-96" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Sidebar Navigation - Sticky Tabs on Mobile Container */}
          <div className="lg:col-span-1">
             <div className="flex lg:flex-col p-1.5 bg-gray-100/50 rounded-2xl md:rounded-3xl gap-1 overflow-x-auto scrollbar-hide lg:sticky lg:top-32">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'orders', label: 'History', lgLabel: 'Order History', icon: Package },
                  { id: 'settings', label: 'Account', lgLabel: 'Account Settings', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 lg:flex-none py-3.5 md:py-4 lg:py-5 px-4 md:px-6 rounded-xl md:rounded-2xl flex items-center justify-center lg:justify-start gap-3 md:gap-4 transition-all duration-300 font-black text-[10px] md:text-xs uppercase tracking-widest shrink-0 ${activeTab === tab.id
                        ? 'bg-white shadow-lg shadow-primary/5 text-primary border border-primary/10 lg:scale-105'
                        : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    <tab.icon className={`h-3.5 w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 ${activeTab === tab.id ? 'text-primary' : 'opacity-50'}`} />
                    <span className="lg:hidden">{tab.label}</span>
                    <span className="hidden lg:inline">{tab.lgLabel || tab.label}</span>
                    {activeTab === tab.id && <ChevronRight className="h-4 w-4 ml-auto hidden lg:block" />}
                  </button>
                ))}
             </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-premium border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8 md:mb-10 text-center sm:text-left">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center justify-center sm:justify-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      Identity Profile
                    </h2>
                    <Button
                      onClickCapture={(e) => {
                        if (isEditing) handleSubmit(e);
                        else setIsEditing(true);
                      }}
                      className={`rounded-xl px-8 h-12 md:h-14 font-black uppercase tracking-widest text-xs ${isEditing ? 'bg-primary shadow-glow' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-primary/20 hover:text-primary'}`}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Commit Changes
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Update Bio
                        </>
                      )}
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-5 md:space-y-6">
                      <div>
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Legal Name</label>
                        <div className={`flex items-center p-3.5 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border transition-all ${isEditing ? 'border-primary/30 bg-white ring-4 ring-primary/5' : 'border-transparent'}`}>
                          <User className="h-4 w-4 md:h-5 md:w-5 text-gray-400 mr-3" />
                          <input
                            disabled={!isEditing}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-transparent w-full font-black text-gray-900 focus:outline-none text-sm md:text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Primary Email</label>
                        <div className="flex items-center p-3.5 md:p-4 bg-gray-50/50 rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden">
                          <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-400 mr-3 shrink-0" />
                          <input
                            disabled
                            value={formData.email}
                            className="bg-transparent w-full font-black text-gray-400 cursor-not-allowed text-sm md:text-base truncate"
                          />
                          <ShieldCheck className="h-4 w-4 text-green-eco ml-2 shrink-0" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-5 md:space-y-6">
                      <div>
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Contact Line</label>
                        <div className={`flex items-center p-3.5 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border transition-all ${isEditing ? 'border-primary/30 bg-white ring-4 ring-primary/5' : 'border-transparent'}`}>
                          <Phone className="h-4 w-4 md:h-5 md:w-5 text-gray-400 mr-3" />
                          <input
                            disabled={!isEditing}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Add phone..."
                            className="bg-transparent w-full font-black text-gray-900 focus:outline-none placeholder:font-bold placeholder:text-gray-300 text-sm md:text-base font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-8 md:pt-10 border-t border-gray-50">
                      <h3 className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <div className="p-1.5 bg-accent/10 rounded-lg">
                          <MapPin className="h-3.5 w-3.5 text-accent" />
                        </div>
                        Shipping Coordinates
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="md:col-span-2">
                          <input
                            disabled={!isEditing}
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            placeholder="Complete Street Address"
                            className={`w-full p-3.5 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl font-black text-gray-900 focus:outline-none transition-all text-sm md:text-base ${isEditing ? 'bg-white border border-primary/30 ring-4 ring-primary/5' : 'border border-transparent'}`}
                          />
                        </div>
                        <div>
                          <input
                            disabled={!isEditing}
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            placeholder="City"
                            className={`w-full p-3.5 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl font-black text-gray-900 focus:outline-none transition-all text-sm md:text-base ${isEditing ? 'bg-white border border-primary/30 ring-4 ring-primary/5' : 'border border-transparent'}`}
                          />
                        </div>
                        <div>
                          <input
                            disabled={!isEditing}
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleChange}
                            placeholder="Postal Code"
                            className={`w-full p-3.5 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl font-black text-gray-900 focus:outline-none transition-all text-sm md:text-base ${isEditing ? 'bg-white border border-primary/30 ring-4 ring-primary/5' : 'border border-transparent'}`}
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
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-premium border border-gray-100 min-h-[500px]"
                >
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    Order Archive
                  </h2>

                  {ordersLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                      <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-primary mb-4"></div>
                      <p className="font-black text-[10px] md:text-xs text-gray-400 uppercase tracking-widest italic">Scanning Records...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="grid gap-4 md:gap-6">
                      {orders.map((order) => (
                        <div 
                          key={order._id} 
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsTrackingModalOpen(true);
                          }}
                          className="group p-5 md:p-6 rounded-[1.5rem] md:rounded-3xl bg-gray-50 hover:bg-white border border-gray-50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer relative overflow-hidden"
                        >
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-white rounded-xl md:rounded-2xl shadow-sm group-hover:scale-110 transition-transform hidden sm:block">
                                <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1.5">
                                  <h3 className="text-sm md:text-base font-black text-gray-900">ID #{order._id.slice(-6).toUpperCase()}</h3>
                                  <span className={`px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase border tracking-widest ${getStatusStyle(order.orderStatus)}`}>
                                    {order.orderStatus}
                                  </span>
                                </div>
                                <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 italic">
                                  <Box className="h-3 w-3" />
                                  Placed {new Date(order.createdAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 border-t border-gray-100/50 pt-4 md:pt-0">
                              <div className="text-center md:text-right">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 opacity-50">Volume</p>
                                <p className="text-sm md:text-lg font-black text-gray-900 leading-none">{order.items?.length || 0} PCS</p>
                              </div>
                              <div className="text-center md:text-right">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 opacity-50">Amount</p>
                                <p className="text-sm md:text-lg font-black text-primary leading-none tracking-tighter">{formatCurrency(order.totalPrice)}</p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                      <div className="w-16 md:w-20 h-16 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Box className="h-8 md:h-10 w-8 md:w-10 text-gray-200" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Workspace Empty</h3>
                      <p className="text-xs md:text-sm text-gray-400 font-bold mb-8 max-w-xs mx-auto px-4 uppercase tracking-widest">Your sustainable order history is waiting to be written.</p>
                      <Button onClick={() => navigate('/shop')} className="px-8 py-4 rounded-xl md:rounded-2xl shadow-xl shadow-primary/10 font-black uppercase tracking-widest text-xs">
                        Initiate Shopping
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-premium border border-gray-100"
                >
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Settings className="h-5 w-5 text-accent" />
                    </div>
                    System Controls
                  </h2>
                  <div className="space-y-6">
                    <div className="p-6 md:p-8 bg-red-50/50 rounded-[2rem] border border-red-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <X className="h-5 w-5 text-red-500" />
                        </div>
                        <h3 className="text-red-900 font-black text-sm md:text-base uppercase tracking-widest">Termination Zone</h3>
                      </div>
                      <p className="text-red-700/60 text-xs md:text-sm font-bold mb-8 leading-relaxed">System account deletion is permanent and cannot be reversed. All environmental logs will be purged.</p>
                      <button className="w-full md:w-auto px-8 py-4 bg-white text-red-500 font-black rounded-xl md:rounded-2xl border-2 border-red-50 hover:bg-red-500 hover:text-white transition-all shadow-sm text-[10px] md:text-xs uppercase tracking-widest">
                        Purge Account Records
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <OrderTrackingModal 
        order={selectedOrder}
        isOpen={isTrackingModalOpen}
        onClose={() => {
          setIsTrackingModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default Profile;
