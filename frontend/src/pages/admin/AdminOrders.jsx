import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Package,
  Search,
  MapPin,
  Phone,
  Mail,
  X,
  Download,
  Filter,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Receipt,
  ShieldCheck,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../utils/constants';

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUsers, setExpandedUsers] = useState({});

  const queryClient = useQueryClient();

  // Fetch order statistics for tabs
  const { data: stats } = useQuery({
    queryKey: ['orderStats'],
    queryFn: async () => {
      const res = await api.get('/admin/orders/stats');
      return res.data.data;
    },
    refetchInterval: 5000,
  });

  // Fetch orders based on active tab
  const { data, isLoading } = useQuery({
    queryKey: ['adminOrders', activeTab],
    queryFn: async () => {
      let url = '/admin/orders?limit=100';

      if (activeTab !== 'all') {
        const statusMap = {
          'pending': 'Processing',
          'shipped': 'Shipped',
          'delivered': 'Delivered',
          'cancelled': 'Cancelled'
        };
        url += `&status=${statusMap[activeTab]}`;
      }

      const res = await api.get(url);
      return res.data.data;
    },
    refetchInterval: 5000,
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/orders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
      queryClient.invalidateQueries(['orderStats']);
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

  const handleDownloadExcel = async () => {
    try {
      let url = '/admin/orders/export';
      let fileName = 'orders';

      const fileNameMap = {
        'all': 'all_orders',
        'pending': 'pending_orders',
        'shipped': 'shipped_orders',
        'delivered': 'delivered_orders',
        'cancelled': 'cancelled_orders'
      };

      fileName = fileNameMap[activeTab] || 'orders';

      if (activeTab !== 'all') {
        const statusMap = {
          'pending': 'Processing',
          'shipped': 'Shipped',
          'delivered': 'Delivered',
          'cancelled': 'Cancelled'
        };
        url += `?status=${statusMap[activeTab]}`;
      }

      const response = await api.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = downloadUrl;
      link.setAttribute('download', `${fileName}_${dateStr}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`Export successful!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export orders');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-eco/10 text-green-eco border-green-eco/20';
      case 'Shipped': return 'bg-primary-blue/10 text-primary-blue border-primary-blue/20';
      case 'Confirmed': return 'bg-teal/10 text-teal border-teal/20';
      case 'Processing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Paid': return 'bg-green-eco/10 text-green-eco border-green-eco/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const filteredOrders = data?.orders?.filter(order => {
    const searchStr = searchTerm.toLowerCase();
    return order._id.toLowerCase().includes(searchStr) ||
      (order.user?.name || '').toLowerCase().includes(searchStr) ||
      (order.shippingAddress?.fullName || order.shippingAddress?.name || '').toLowerCase().includes(searchStr);
  });

  // Group orders by user content
  const groupedOrders = filteredOrders?.reduce((acc, order) => {
    // Use user ID or falling back to shipping name for guests
    const userId = order.user?._id || order.shippingAddress?.email || 'guest';

    if (!acc[userId]) {
      acc[userId] = {
        id: userId,
        user: order.user || {
          name: order.shippingAddress?.fullName || order.shippingAddress?.name || 'Guest',
          email: order.shippingAddress?.email || 'No Email',
          _id: 'guest'
        },
        orders: [],
        totalSpent: 0,
        lastOrderDate: order.createdAt
      };
    }

    acc[userId].orders.push(order);
    acc[userId].totalSpent += order.totalPrice;
    if (new Date(order.createdAt) > new Date(acc[userId].lastOrderDate)) {
      acc[userId].lastOrderDate = order.createdAt;
    }

    return acc;
  }, {});

  const toggleUserExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  if (isLoading && !data) return <Loading />;

  return (
    <div className="pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="gradient-text">Orders Management</span>
          </h1>
          <p className="text-gray-500 font-medium">Coordinate logistics and track customer fulfillment cycles.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Filter by ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium w-72 shadow-sm transition-all"
            />
          </div>
          <Button
            onClick={handleDownloadExcel}
            variant="outline"
            className="flex items-center space-x-2 border-green-eco/20 text-green-eco hover:bg-green-eco/5 px-6 rounded-2xl h-[46px]"
          >
            <Download className="h-4 w-4" />
            <span className="font-bold uppercase tracking-wider text-[10px]">Export Manifest</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/60 backdrop-blur-sm p-2 rounded-3xl border border-gray-100 shadow-sm inline-flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Orders', count: stats?.allOrders, icon: Receipt },
          { id: 'pending', label: 'Processing', count: stats?.pendingOrders, icon: Clock },
          { id: 'shipped', label: 'In Transit', count: stats?.shippedOrders, icon: Truck },
          { id: 'delivered', label: 'Completed', count: stats?.deliveredOrders, icon: CheckCircle },
          { id: 'cancelled', label: 'Cancelled', count: stats?.cancelledOrders, icon: X },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center space-x-3 ${activeTab === tab.id
              ? 'bg-primary text-white shadow-xl shadow-primary/20'
              : 'text-gray-500 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-100'
              }`}
          >
            <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card-premium overflow-hidden border-none shadow-xl shadow-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Client</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Valuation</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Settlement</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {groupedOrders && Object.values(groupedOrders).map((group) => (
                <>
                  {/* Parent User Row */}
                  <tr
                    key={group.id}
                    onClick={() => toggleUserExpand(group.id)}
                    className="cursor-pointer hover:bg-primary/[0.02] transition-colors border-l-4 border-transparent hover:border-primary"
                  >
                    <td className="px-8 py-5" colSpan="2">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full transition-transform duration-300 ${expandedUsers[group.id] ? 'rotate-90 bg-primary/10 text-primary' : 'text-gray-400'}`}>
                          <ChevronRight className="h-5 w-5" />
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-blue text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-primary/20">
                          {group.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{group.user.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{group.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-900 text-sm">{formatCurrency(group.totalSpent)}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">Total Value</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold shadow-sm">
                          {group.orders.length} orders
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5" colSpan="3">
                      <div className="flex items-center space-x-3 opacity-60">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-500">
                          Latest: {new Date(group.lastOrderDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Child Rows */}
                  {expandedUsers[group.id] && group.orders.map(order => (
                    <tr key={order._id} className="bg-gray-50/50 hover:bg-gray-50 relative group">
                      <td className="px-8 py-4 pl-24">
                        <div className="absolute left-10 top-0 bottom-0 w-px bg-gray-200 border-l border-dashed border-gray-300 h-full" />
                        <div className="absolute left-10 top-1/2 w-8 h-px bg-gray-300 border-t border-dashed" />
                        <span className="font-bold text-gray-700 text-xs tracking-tight bg-white px-2 py-1 rounded border border-gray-200">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        {/* Client details hidden in child row as redundant */}
                      </td>
                      <td className="px-8 py-4">
                        <p className="font-bold text-gray-900 text-xs">{formatCurrency(order.totalPrice)}</p>
                        <p className="text-[10px] text-gray-400 uppercase">{order.items?.length || 0} items</p>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusStyle(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                        <span className="ml-2 text-[10px] text-gray-400 font-bold uppercase">{order.paymentMethod}</span>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusStyle(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-[10px] font-bold text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          className="p-2 bg-white text-gray-400 rounded-xl hover:text-primary hover:shadow-md border border-gray-100 transition-all scale-90 hover:scale-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
          {filteredOrders?.length === 0 && (
            <div className="text-center py-24 bg-gray-50/30">
              <div className="p-6 bg-white rounded-full w-fit mx-auto shadow-sm border border-gray-100 mb-6">
                <Package className="h-12 w-12 text-gray-200" />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">No matching transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
            >
              <div className="px-10 py-10 flex items-center justify-between bg-mesh relative overflow-hidden border-b border-gray-100">
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                    <Receipt className="h-3 w-3" />
                    <span>Transaction Certificate</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="text-xs font-bold text-gray-500/80">Logged on {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase border shadow-sm ${getStatusStyle(selectedOrder.orderStatus)}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="relative z-10 p-3 bg-white/50 backdrop-blur-sm border border-white hover:bg-white rounded-2xl transition-all shadow-sm hover:shadow-md"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Left Column: Items and Money */}
                  <div className="lg:col-span-2 space-y-10">
                    {/* Items */}
                    <div>
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                        <span className="w-8 h-px bg-gray-200 mr-4" />
                        Inventory Assessment
                      </h3>
                      <div className="space-y-4">
                        {selectedOrder.items?.map((item, index) => (
                          <div key={index} className="flex items-center space-x-6 p-5 bg-gray-50/50 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white transition-all group">
                            <div className="relative">
                              <img src={item.image} alt="" className="w-20 h-20 object-cover rounded-2xl shadow-md transition-transform group-hover:scale-105" />
                              <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-base truncate">{item.name}</p>
                              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1.5">
                                Unit Price: {formatCurrency(item.price)}
                              </p>
                            </div>
                            <p className="font-extrabold text-gray-900 text-lg tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Money & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 p-8 opacity-10 transition-transform group-hover:scale-110">
                          <TrendingUp className="h-32 w-32" />
                        </div>
                        <h4 className="text-[10px] font-bold text-white/40 uppercase mb-6 tracking-[0.2em]">Financial Summary</h4>
                        <div className="space-y-4 text-sm font-medium relative z-10">
                          <div className="flex justify-between items-center px-2">
                            <span className="opacity-60 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                            <span className="font-bold tabular-nums">{formatCurrency(selectedOrder.itemsPrice)}</span>
                          </div>
                          <div className="flex justify-between items-center px-2">
                            <span className="opacity-60 font-bold uppercase text-[10px] tracking-widest">Surcharge (Tax)</span>
                            <span className="font-bold tabular-nums">{formatCurrency(selectedOrder.taxPrice)}</span>
                          </div>
                          <div className="flex justify-between items-center px-2">
                            <span className="opacity-60 font-bold uppercase text-[10px] tracking-widest">Logistic Fee</span>
                            <span className="font-bold tabular-nums">{formatCurrency(selectedOrder.shippingPrice)}</span>
                          </div>
                          <div className="pt-6 mt-2 border-t border-white/10 flex justify-between items-center font-black text-2xl px-2">
                            <span className="text-white/80 tracking-tight">Total</span>
                            <span className="text-primary-blue tabular-nums">{formatCurrency(selectedOrder.totalPrice)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-primary transition-transform group-hover:rotate-12 group-hover:scale-110">
                          <CreditCard className="h-24 w-24" />
                        </div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-6 tracking-[0.2em]">Settlement Provider</h4>
                        <p className="text-2xl font-black text-gray-900 mb-2 truncate">{selectedOrder.paymentMethod}</p>
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${selectedOrder.paymentStatus === 'Paid' ? 'bg-green-eco' : 'bg-orange-500'} shadow-lg shadow-current/20`} />
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{selectedOrder.paymentStatus}</p>
                        </div>

                        <button
                          onClick={() => handleStatusUpdate(selectedOrder._id, selectedOrder.orderStatus, selectedOrder.paymentStatus === 'Paid' ? 'Pending' : 'Paid')}
                          className="mt-10 flex items-center space-x-3 text-[10px] font-bold text-primary hover:text-primary-blue transition-colors group/btn"
                        >
                          <div className="p-2 bg-primary/5 rounded-lg group-hover/btn:bg-primary/10">
                            <Clock className="h-4 w-4" />
                          </div>
                          <span className="uppercase tracking-[0.1em] border-b border-primary/20 pb-0.5">Override Settlement: {selectedOrder.paymentStatus === 'Paid' ? 'Pending' : 'Paid'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status Controls & Address */}
                  <div className="space-y-10">
                    <div className="bg-gray-50/80 rounded-[2.5rem] p-8 border border-gray-100 shadow-inner">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                        <Filter className="h-4 w-4 mr-3 text-primary" />
                        Workflow Transition
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {ORDER_STATUSES.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(selectedOrder._id, status, selectedOrder.paymentStatus)}
                            className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-bold transition-all border group ${selectedOrder.orderStatus === status
                              ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 scale-[1.02]'
                              : 'bg-white text-gray-500 border-gray-100 hover:border-primary/40 hover:bg-primary/[0.02] hover:text-gray-900'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${selectedOrder.orderStatus === status ? 'bg-white' : 'bg-gray-200 group-hover:bg-primary/40'}`} />
                                <span>{status}</span>
                              </div>
                              {selectedOrder.orderStatus === status && <CheckCircle className="h-5 w-5 animate-in zoom-in duration-300" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8 px-4">
                      <div className="flex items-start space-x-5">
                        <div className="mt-1 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Deployment Destination</p>
                          <p className="text-base font-bold text-gray-900 mt-2 leading-tight truncate">
                            {selectedOrder.shippingAddress?.fullName || selectedOrder.shippingAddress?.name}
                          </p>
                          <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">
                            {selectedOrder.shippingAddress?.address || selectedOrder.shippingAddress?.street},<br />
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-5">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Direct Line</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-5">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Authorized Mail</p>
                          <p className="text-sm font-bold text-gray-900 mt-1 truncate">{selectedOrder.user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                <Button
                  onClick={() => setSelectedOrder(null)}
                  variant="outline"
                  className="font-bold px-10 rounded-2xl h-[52px] border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-white"
                >
                  Terminate View
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
