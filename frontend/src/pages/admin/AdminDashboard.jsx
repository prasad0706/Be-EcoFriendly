import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Loading from '../../components/common/Loading';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    },
    refetchInterval: 10000,
  });

  if (isLoading) return <Loading />;

  // Mock data for trends (In a real app, this would come from the backend)
  const revenueData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 5000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  const categoryData = [
    { name: 'Home', value: 400 },
    { name: 'Tech', value: 300 },
    { name: 'Fashion', value: 300 },
    { name: 'Beauty', value: 200 },
  ];

  const COLORS = ['#0F4C81', '#2FB973', '#FFBB28', '#FF8042'];

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: '+12.5%',
      isPositive: true,
      icon: IndianRupee,
      color: 'from-blue-600 to-indigo-700',
    },
    {
      title: 'Active Orders',
      value: stats?.totalOrders || 0,
      change: '+3.2%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Customer Growth',
      value: stats?.totalUsers || 0,
      change: '-1.4%',
      isPositive: false,
      icon: Users,
      color: 'from-violet-500 to-purple-600',
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Analytics</h1>
          <p className="text-gray-500 font-medium mt-1">Global overview of your eco-system performance.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20">Last 7 Days</button>
          <button className="px-5 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl text-sm font-bold transition-colors">Last 30 Days</button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100/50"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-[5rem]`} />

            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-indigo-200`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
              <div className="flex items-center mt-4">
                <span className={`flex items-center text-sm font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'} bg-${stat.isPositive ? 'green' : 'red'}-50 px-2 py-1 rounded-lg`}>
                  {stat.isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                  {stat.change}
                </span>
                <span className="text-xs text-gray-400 font-bold ml-3 uppercase tracking-tighter">vs last period</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Revenue Stream</h2>
              <p className="text-gray-400 font-bold text-sm uppercase mt-1">Weekly Performance</p>
            </div>
            <div className="flex items-center bg-gray-50 p-1 rounded-xl">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2 ml-2" />
              <span className="text-sm font-black text-gray-900 mr-2">+18.2%</span>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0F4C81" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontWeight: 700, fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontWeight: 700, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                  itemStyle={{ fontWeight: 800, color: '#0F4C81' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0F4C81"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Live Activity */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-900/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-xl font-black mb-8 relative z-10">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <button className="flex flex-col items-center justify-center p-5 bg-white/10 hover:bg-white/20 rounded-[2rem] border border-white/10 transition-all group">
                <Package className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Add Product</span>
              </button>
              <button className="flex flex-col items-center justify-center p-5 bg-white/10 hover:bg-white/20 rounded-[2rem] border border-white/10 transition-all group">
                <Users className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Customers</span>
              </button>
            </div>
          </div>

          {/* Low Stock Counter */}
          <div className="bg-[#FFEDD5] rounded-[2.5rem] p-10 border border-[#FDBA74]/50 shadow-xl shadow-orange-100">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <h4 className="text-orange-950 font-black text-2xl mb-1">{stats?.lowStockProducts?.length || 0} Products</h4>
            <p className="text-orange-900/60 font-bold text-sm uppercase tracking-widest">Requiring Stock Update</p>

            <div className="mt-8 space-y-4">
              {stats?.lowStockProducts?.slice(0, 2).map(product => (
                <div key={product._id} className="flex items-center justify-between bg-white/40 p-3 rounded-xl border border-white/50">
                  <span className="text-xs font-bold text-orange-950 truncate max-w-[120px]">{product.name}</span>
                  <span className="text-xs font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">{product.stock} Left</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Layout Refinement */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Recent Transactions</h2>
            <p className="text-gray-400 font-bold text-sm uppercase mt-1">Real-time update stream</p>
          </div>
          <button className="px-6 py-3 bg-gray-50 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-100 transition-colors">View All Orders</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Identifier</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Volume</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders?.map((order) => (
                <tr key={order._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6 text-sm font-black text-gray-900 capitalize">
                    #{order._id?.slice(-8)}
                  </td>
                  <td className="px-6 py-6 font-bold text-sm text-gray-600">
                    {order.user?.name || order.shippingAddress?.name || 'Guest'}
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-gray-900">
                    {formatCurrency(order.totalPrice || 0)}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' :
                      order.orderStatus === 'Processing' ? 'bg-indigo-50 text-indigo-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                      {order.orderStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-gray-400 tabular-nums">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
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
