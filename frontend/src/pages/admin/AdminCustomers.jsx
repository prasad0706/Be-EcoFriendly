import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Eye, Shield, User, Mail, Calendar, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const AdminCustomers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const res = await api.get('/admin/users?limit=100');
      return res.data.data;
    },
    refetchInterval: 5000, // Real-time updates
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => api.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCustomers']);
      toast.success('User role updated successfully');
      setSelectedCustomer(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  });

  const handleRoleChange = (userId, newRole) => {
    updateUserRoleMutation.mutate({ userId, role: newRole });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredCustomers = data?.users?.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? customer.role === filterRole : true;
    return matchesSearch && matchesRole;
  }) || [];

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Customers Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Customers Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{data?.total || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Admin Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {data?.users?.filter(u => u.role === 'admin').length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-gray-800">
                {data?.users?.filter(u => {
                  const createdDate = new Date(u.createdAt);
                  const now = new Date();
                  return createdDate.getMonth() === now.getMonth() && 
                         createdDate.getFullYear() === now.getFullYear();
                }).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <motion.tr
                  key={customer._id}
                  layout
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                          {customer.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{customer.name || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {customer.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.role === 'admin' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {customer.role || 'customer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {customer.role !== 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(customer._id, 'admin')}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Customer Details
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0 h-20 w-20">
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                    {selectedCustomer.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.name || 'N/A'}</h3>
                  <p className="text-gray-600">{selectedCustomer.email || 'N/A'}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCustomer.role === 'admin' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedCustomer.role || 'customer'}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-mono">{selectedCustomer._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email Verified:</span>
                      <span>{selectedCustomer.isVerified ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Status:</span>
                      <span>{selectedCustomer.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Registration Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span>{formatDate(selectedCustomer.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span>{formatDate(selectedCustomer.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Management */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Role Management</h4>
                <div className="flex items-center space-x-4">
                  <span>Current Role:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCustomer.role === 'admin' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedCustomer.role || 'customer'}
                  </span>
                  {selectedCustomer.role !== 'admin' ? (
                    <Button
                      onClick={() => handleRoleChange(selectedCustomer._id, 'admin')}
                      className="flex items-center space-x-2"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Make Admin</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleRoleChange(selectedCustomer._id, 'customer')}
                      className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600"
                    >
                      <User className="h-4 w-4" />
                      <span>Revoke Admin</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;