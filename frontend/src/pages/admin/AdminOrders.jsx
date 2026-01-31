import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Package, Truck, CheckCircle, XCircle, Search, Filter, ArrowRight, MapPin, Phone, Mail, User, Clock, CreditCard, MoreVertical, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../utils/constants';

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminOrders', filterStatus],
    queryFn: async () => {
      const res = await api.get(`/admin/orders?status=${filterStatus}&limit=100`);
      return res.data.data;
    },
    refetchInterval: 10000,
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/orders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
      toast.success('Order synchronized successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Synchronization failed');
    }
  });

  const handleStatusUpdate = (orderId, orderStatus, paymentStatus) => {
    updateOrderMutation.mutate({
      id: orderId,
      data: { orderStatus, paymentStatus }
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Confirmed': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Processing': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const filteredOrders = data?.orders?.filter(order => {
    const searchStr = searchTerm.toLowerCase();
    return order._id.toLowerCase().includes(searchStr) ||
      (order.user?.name || '').toLowerCase().includes(searchStr) ||
      (order.shippingAddress?.name || '').toLowerCase().includes(searchStr);
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Fulfillment Hub</h1>
          <p className="text-gray-500 font-medium mt-1">Track and manage global order lifecycle.</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filterStatus === '' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            All Shipments
          </button>
          <button
            onClick={() => setFilterStatus('Processing')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filterStatus === 'Processing' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Processing
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 border border-white shadow-xl shadow-gray-200/50">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by ID, Customer, or Region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-gray-200 font-medium shadow-sm"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-gray-200 font-bold text-gray-700 shadow-sm appearance-none min-w-[200px]"
        >
          <option value="">Status: All Filters</option>
          {ORDER_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Orders Ledger */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Ref</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Recipient</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Volume</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status Bundle</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Timeline</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Interact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders?.map((order) => (
                <motion.tr
                  key={order._id}
                  layout
                  className="group hover:bg-gray-50/50 transition-all"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">Eco-Pack Standard</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-500">
                        {(order.user?.name || order.shippingAddress?.name || 'G')[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{order.user?.name || order.shippingAddress?.name || 'Guest User'}</p>
                        <p className="text-xs text-gray-400 font-medium">{order.shippingAddress?.city || 'Region Hidden'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">
                    {formatCurrency(order.totalPrice)}
                    <span className="block text-[10px] text-gray-400 mt-1 font-bold italic">{order.items?.length || 0} ITEMS</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border w-fit ${getStatusStyle(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        PAYMENT: <span className={order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-orange-500'}>{order.paymentStatus}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-400 tabular-nums">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-3 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal - Premium Glassmorphic Redesign */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white rounded-[3rem] shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-12 py-10 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-gray-900 flex items-center justify-center">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                      Order Spec #{selectedOrder._id.slice(-8).toUpperCase()}
                    </h2>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase">Standard Fulfillment</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400 text-xs font-bold uppercase">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-4 hover:bg-gray-100 rounded-[2rem] text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-12 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left Column: Line Items */}
                  <div className="lg:col-span-2 space-y-10">
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Manifest Items</h3>
                      <div className="space-y-4">
                        {selectedOrder.items?.map((item, index) => (
                          <div key={index} className="flex items-center space-x-6 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100/50 group transition-all hover:bg-white hover:shadow-xl">
                            <img src={item.image} alt="" className="w-24 h-24 object-cover rounded-[1.5rem] shadow-md group-hover:scale-105 transition-transform" />
                            <div className="flex-1">
                              <p className="font-black text-lg text-gray-900">{item.name}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-black text-gray-600">QTY: {item.quantity}</span>
                                <span className="text-sm font-bold text-gray-400">Unit: {formatCurrency(item.price)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Grid */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white overflow-hidden relative">
                        <CreditCard className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
                        <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-6">Fiscal Summary</h4>
                        <div className="space-y-3 font-bold">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Subtotal</span>
                            <span>{formatCurrency(selectedOrder.itemsPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Sustainability Levy (Tax)</span>
                            <span>{formatCurrency(selectedOrder.taxPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Eco-Logistics (Shipping)</span>
                            <span>{formatCurrency(selectedOrder.shippingPrice)}</span>
                          </div>
                          <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                            <span className="text-lg">Total Amount</span>
                            <span className="text-3xl font-black text-green-400">{formatCurrency(selectedOrder.totalPrice)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col justify-between">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Payment Vector</h4>
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">Provider: {selectedOrder.paymentMethod}</p>
                          <div className="flex items-center mt-3">
                            <div className={`w-3 h-3 rounded-full mr-2 ${selectedOrder.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-orange-500'}`} />
                            <span className="text-lg font-black text-gray-900">{selectedOrder.paymentStatus}</span>
                          </div>
                        </div>
                        <Button
                          className="mt-6 w-full py-4 rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 font-black text-xs uppercase"
                          onClick={() => handleStatusUpdate(selectedOrder._id, selectedOrder.orderStatus, selectedOrder.paymentStatus === 'Paid' ? 'Pending' : 'Paid')}
                        >
                          Toggle Status
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Flow Controls */}
                  <div className="space-y-10">
                    <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Fulfillment Flow</h3>
                      <div className="space-y-4">
                        {ORDER_STATUSES.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(selectedOrder._id, status, selectedOrder.paymentStatus)}
                            className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] transition-all border ${selectedOrder.orderStatus === status
                                ? 'bg-gray-900 text-white border-gray-900 shadow-xl'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                              }`}
                          >
                            <span className="font-black text-sm uppercase tracking-widest">{status}</span>
                            {selectedOrder.orderStatus === status && <CheckCircle className="h-5 w-5 text-green-400" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6 px-4">
                      <div className="flex items-start space-x-4">
                        <MapPin className="h-6 w-6 text-gray-400 shrink-0 mt-1" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Destination</p>
                          <p className="text-sm font-bold text-gray-900 leading-relaxed">
                            {selectedOrder.shippingAddress?.street},<br />
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode},<br />
                            {selectedOrder.shippingAddress?.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Phone className="h-6 w-6 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Terminal</p>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Mail className="h-6 w-6 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Communication Channel</p>
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{selectedOrder.user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-12 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Last modified system sync: {new Date().toLocaleTimeString()}</span>
                </div>
                <Button onClick={() => setSelectedOrder(null)} className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm">
                  Dismiss View
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
