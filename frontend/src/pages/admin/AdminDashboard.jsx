import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertCircle,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  MessageSquare,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Loading from '../../components/common/Loading';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats', timeRange],
    queryFn: async () => {
      const res = await api.get(`/admin/stats?range=${timeRange}`);
      return res.data.data;
    },
    refetchInterval: 5000, // Update every 5 seconds for real-time feel
  });

  if (isLoading) return <Loading />;

  // Transform sales data for chart
  const revenueData = stats?.salesData?.map(item => ({
    name: new Date(item._id).toLocaleDateString('en-IN', { weekday: 'short' }),
    value: item.sales
  })) || [];

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: `${stats?.growth?.revenue >= 0 ? '+' : ''}${stats?.growth?.revenue || 0}%`,
      isPositive: (stats?.growth?.revenue || 0) >= 0,
      icon: IndianRupee,
      color: 'bg-primary',
    },
    {
      title: 'Active Orders',
      value: stats?.pendingOrders || 0,
      change: `${stats?.growth?.orders >= 0 ? '+' : ''}${stats?.growth?.orders || 0}%`,
      isPositive: (stats?.growth?.orders || 0) >= 0,
      icon: ShoppingCart,
      color: 'bg-green-600',
    },
    {
      title: 'Customers',
      value: stats?.totalUsers || 0,
      change: `${stats?.growth?.users >= 0 ? '+' : ''}${stats?.growth?.users || 0}%`,
      isPositive: (stats?.growth?.users || 0) >= 0,
      icon: Users,
      color: 'bg-purple-600',
    }
  ];

  return (
    <div className="pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium">Welcome back to your store's control center.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === '7d' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === '30d' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {stat.change}
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Eco Store Impact */}
      <div className="bg-primary p-6 md:p-12 rounded-3xl md:rounded-[3.5rem] relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="max-w-xs">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6">
                 <Leaf className="h-3 w-3" /> Mission Status
              </div>
              <h2 className="text-4xl font-black text-white leading-none tracking-tighter mb-4">Total Planet <span className="opacity-50">Impact.</span></h2>
              <p className="text-white/60 font-medium">Real-time aggregate of all sustainable choices made by our customers.</p>
           </div>
           
           <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                 <div className="p-3 bg-white w-fit rounded-2xl text-primary mb-6">
                    <TrendingUp className="h-6 w-6" />
                 </div>
                 <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-1">CO2 Saved</p>
                 <h3 className="text-3xl font-bold text-white tracking-tight">{stats?.ecoImpact?.co2Saved || 0}kg</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                 <div className="p-3 bg-white w-fit rounded-2xl text-blue-500 mb-6">
                    <ShoppingCart className="h-6 w-6" />
                 </div>
                 <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-1">Water Saved</p>
                 <h3 className="text-3xl font-bold text-white tracking-tight">{stats?.ecoImpact?.waterSaved || 0}L</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                 <div className="p-3 bg-white w-fit rounded-2xl text-accent mb-6">
                    <ArrowUpRight className="h-6 w-6" />
                 </div>
                 <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-1">Trees Offset</p>
                 <h3 className="text-3xl font-bold text-white tracking-tight">{stats?.ecoImpact?.treesOffset || 0}</h3>
              </div>
           </div>
        </div>
        {/* Decorative Leaf */}
        <Leaf className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 pointer-events-none rotate-12" />
      </div>

      {/* Analytics & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Revenue Performance</h3>
            <div className={`flex items-center text-sm font-bold ${ (stats?.growth?.revenue || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${(stats?.growth?.revenue || 0) < 0 ? 'rotate-180' : ''}`} />
              {stats?.growth?.revenue >= 0 ? '+' : ''}{stats?.growth?.revenue || 0}% growth
            </div>
          </div>

          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2FB973" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2FB973" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ color: '#2FB973', fontWeight: 700 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2FB973"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl text-black shadow-lg relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/admin/products" className="flex items-center justify-between p-4 bg-gray-500/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all group">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 opacity-60" />
                  <span className="text-sm font-bold">Manage Products</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              <Link to="/admin/customers" className="flex items-center justify-between p-4 bg-gray-500/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all group">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 opacity-60" />
                  <span className="text-sm font-bold">View Customers</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              <Link to="/admin/reviews" className="flex items-center justify-between p-4 bg-gray-500/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all group">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 opacity-60" />
                  <span className="text-sm font-bold">Manage Reviews</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </div>
          </div>

          <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-500 rounded-xl text-white">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-gray-900">Inventory Alerts</h4>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-6">
              {stats?.lowStockProducts?.length || 0} items are running low on stock.
            </p>

            <div className="space-y-3">
              {stats?.lowStockProducts?.slice(0, 2).map((p) => (
                <div key={p._id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-200">
                  <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{p.name}</span>
                  <span className="text-xs font-bold text-red-500">{p.stock} units left</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">View All Orders</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">#{order._id?.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 font-bold text-gray-600 text-sm">{order.user?.name || order.shippingAddress?.fullName || 'Guest'}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">{formatCurrency(order.totalPrice || 0)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' :
                        order.orderStatus === 'Processing' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-orange-50 text-orange-600'
                      }`}>
                      {order.orderStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
