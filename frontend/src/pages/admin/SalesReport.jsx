import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, IndianRupee, ShoppingCart, CreditCard, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Loading from '../../components/common/Loading';

const COLORS = ['#0F4C81', '#2FB973', '#60a5fa', '#f87171', '#fbbf24'];

const SalesReport = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: salesReport, isLoading } = useQuery({
    queryKey: ['salesReport', timeRange],
    queryFn: async () => {
      const res = await api.get(`/admin/sales-report?range=${timeRange}`);
      return res.data.data;
    }
  });

  if (isLoading) return <Loading />;

  const summary = salesReport?.summary || {};
  const salesTrend = salesReport?.salesTrend || [];
  const categorySales = salesReport?.categorySales || [];
  const topProducts = salesReport?.topProducts || [];

  return (
    <div className="pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
          <p className="text-gray-500 font-medium">Detailed analysis of your store's sales performance.</p>
        </div>

        <div className="relative inline-block">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: formatCurrency(summary.totalRevenue || 0), icon: IndianRupee, color: 'text-primary' },
          { label: 'Total Orders', value: summary.totalOrders || 0, icon: ShoppingCart, color: 'text-green-600' },
          { label: 'Avg. Order Value', value: formatCurrency(summary.avgOrderValue || 0), icon: CreditCard, color: 'text-purple-600' },
          { label: 'Conversion Rate', value: `${summary.conversionRate || 0}%`, icon: TrendingUp, color: 'text-orange-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-60`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Sales Trend</h2>
          <div className="h-[350px]">
            {salesTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="sales" name="Revenue" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="orders" name="Orders" fill="#2FB973" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium italic">
                No sales data for this period
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Sales by Category</h2>
          <div className="h-[350px]">
            {categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium italic">
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Units Sold</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-900 text-sm">{product.name}</div>
                      {product.rating && (
                        <div className="flex items-center text-[10px] text-yellow-500 font-bold mt-1">
                          <Star className="h-3 w-3 fill-yellow-500 mr-1" />
                          {product.rating}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center text-sm font-bold text-gray-700">
                      {product.unitsSold.toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-right text-sm font-bold text-primary">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-medium italic">
                    No sales data recorded for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;