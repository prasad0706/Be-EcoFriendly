import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Package, Truck, CheckCircle, Search, MapPin, Phone, Mail, Clock, CreditCard, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { ORDER_STATUSES } from '../../utils/constants';

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  // Fetch orders
  const { data, isLoading } = useQuery({
    queryKey: ['adminOrders', filterStatus],
    queryFn: async () => {
      let url = '/admin/orders?limit=100';
      if (filterStatus) {
        url += `&status=${filterStatus}`;
      }
      const res = await api.get(url);
      return res.data.data;
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/orders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
      toast.success('Order updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order');
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
      (order.shippingAddress?.fullName || '').toLowerCase().includes(searchStr);
  });

  if (isLoading && !data) return <Loading />;

  return (
    <div className="pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 font-medium">Manage and track customer orders.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm font-bold text-gray-700"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs">
                        {(order.user?.name || order.shippingAddress?.fullName || 'G')[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{order.user?.name || order.shippingAddress?.fullName || 'Guest'}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{order.user?.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 text-sm">{formatCurrency(order.totalPrice)}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{order.items?.length || 0} items</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusStyle(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders?.length === 0 && (
            <div className="text-center py-20">
              <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No orders found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Items */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-xl" />
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500 font-medium">Quantity: {item.quantity} × {formatCurrency(item.price)}</p>
                            </div>
                            <p className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-gray-900 rounded-2xl text-white">
                        <h4 className="text-[10px] font-bold text-white/40 uppercase mb-4">Financial Summary</h4>
                        <div className="space-y-2 text-sm font-medium">
                          <div className="flex justify-between">
                            <span className="opacity-60">Subtotal</span>
                            <span>{formatCurrency(selectedOrder.itemsPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-60">Tax</span>
                            <span>{formatCurrency(selectedOrder.taxPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-60">Shipping</span>
                            <span>{formatCurrency(selectedOrder.shippingPrice)}</span>
                          </div>
                          <div className="pt-3 border-t border-white/10 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary-blue">{formatCurrency(selectedOrder.totalPrice)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-4">Payment</h4>
                        <p className="text-sm font-bold text-gray-900">Method: {selectedOrder.paymentMethod}</p>
                        <div className="flex items-center mt-2">
                          <div className={`w-2 h-2 rounded-full mr-2 ${selectedOrder.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-orange-500'}`} />
                          <p className="text-sm font-bold">{selectedOrder.paymentStatus}</p>
                        </div>
                        <button
                          onClick={() => handleStatusUpdate(selectedOrder._id, selectedOrder.orderStatus, selectedOrder.paymentStatus === 'Paid' ? 'Pending' : 'Paid')}
                          className="mt-4 text-[10px] font-bold text-primary hover:underline uppercase"
                        >
                          Toggle Payment Status
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Update Status</h3>
                      <div className="space-y-2">
                        {ORDER_STATUSES.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(selectedOrder._id, status, selectedOrder.paymentStatus)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${selectedOrder.orderStatus === status
                              ? 'bg-primary text-white border-primary shadow-md'
                              : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                              }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 px-2">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Shipping To</p>
                          <p className="text-xs font-bold text-gray-900 mt-1 leading-relaxed">
                            {selectedOrder.shippingAddress?.fullName}<br />
                            {selectedOrder.shippingAddress?.address},<br />
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                          <p className="text-xs font-bold text-gray-900">{selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                          <p className="text-xs font-bold text-gray-900 truncate">{selectedOrder.user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button onClick={() => setSelectedOrder(null)} variant="primary" size="sm">
                  Close
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
