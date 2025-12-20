import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, IndianRupee, ShoppingCart, CreditCard } from 'lucide-react';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Loading from '../../components/common/Loading';

const COLORS = ['#2FB973', '#4ade80', '#60a5fa', '#f87171', '#fbbf24'];

const SalesReport = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState([]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (stats?.salesData) {
      const formattedData = stats.salesData.map(item => ({
        date: item._id,
        sales: item.sales,
        orders: item.orders
      }));
      setChartData(formattedData);
    }
  }, [stats]);

  if (isLoading) return <Loading />;

  // Calculate revenue by category
  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home Goods', value: 300 },
    { name: 'Beauty', value: 200 },
    { name: 'Other', value: 100 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Sales Report</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats?.totalRevenue || 0)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.totalOrders ? formatCurrency(stats.totalRevenue / stats.totalOrders) : formatCurrency(0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-800">24.5%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Sales']} />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#2FB973" />
                <Bar dataKey="orders" name="Orders" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sales by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value), 'Sales']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Eco Water Bottle</td>
                <td className="px-6 py-4 text-sm text-gray-600">Reusable Products</td>
                <td className="px-6 py-4 text-sm text-gray-600">1,245</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(12450)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">4.8 ★</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Organic Cotton T-Shirt</td>
                <td className="px-6 py-4 text-sm text-gray-600">Sustainable Fashion</td>
                <td className="px-6 py-4 text-sm text-gray-600">980</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(9800)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">4.6 ★</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Bamboo Toothbrush Set</td>
                <td className="px-6 py-4 text-sm text-gray-600">Zero Waste</td>
                <td className="px-6 py-4 text-sm text-gray-600">756</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(3780)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">4.7 ★</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Solar Charger</td>
                <td className="px-6 py-4 text-sm text-gray-600">Green Tech</td>
                <td className="px-6 py-4 text-sm text-gray-600">523</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(7845)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">4.5 ★</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Recycled Paper Notebook</td>
                <td className="px-6 py-4 text-sm text-gray-600">Eco-Friendly Home</td>
                <td className="px-6 py-4 text-sm text-gray-600">412</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(2060)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">4.4 ★</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;