import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Shield, User, Mail, Search, X, MapPin, ShieldCheck, TrendingUp, Clock } from 'lucide-react';
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const res = await api.get('/admin/users?limit=100');
      return res.data.data;
    }
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => api.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCustomers']);
      toast.success('Permissions updated successfully');
      setSelectedCustomer(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Permission update failed');
    }
  });

  const handleRoleChange = (userId, newRole) => {
    updateUserRoleMutation.mutate({ userId, role: newRole });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredCustomers = data?.users?.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? customer.role === filterRole : true;
    return matchesSearch && matchesRole;
  }) || [];

  const stats = {
    total: data?.users?.length || 0,
    admins: data?.users?.filter(u => u.role === 'admin').length || 0,
    newThisMonth: data?.users?.filter(u => {
      const d = new Date(u.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length || 0
  };

  if (isLoading && !data) return <Loading />;

  return (
    <div className="pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 font-medium">Manage user accounts and permissions.</p>
        </div>

        <Button variant="outline" onClick={() => refetch()}>
          Refresh Data
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-primary/10 rounded-xl text-primary">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-green-50 rounded-xl text-green-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admins</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.admins}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-purple-50 rounded-xl text-purple-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">+{stats.newThisMonth}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-gray-700 min-w-[180px]"
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                        {customer.name?.charAt(0) || 'U'}
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{customer.name || 'Anonymous'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-sm ${customer.role === 'admin'
                      ? 'bg-green-50 text-green-600 border-green-100'
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                      {customer.role || 'customer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-8 py-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {selectedCustomer.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Customer since {new Date(selectedCustomer.createdAt).getFullYear()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Details</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                          <p className="text-sm font-bold text-gray-900">{selectedCustomer.email}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-900 rounded-2xl text-white">
                        <h5 className="text-[10px] font-bold text-white/40 uppercase mb-3">Permissions</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="opacity-60">Verified Account</span>
                            <span className={selectedCustomer.isVerified ? 'text-green-400' : 'text-orange-400'}>{selectedCustomer.isVerified ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="opacity-60">Current Role</span>
                            <span className="text-primary-blue font-bold uppercase">{selectedCustomer.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                      <Clock className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-900 text-sm">Customer Activity</h4>
                      <p className="text-xs text-gray-500 mt-2">Extended activity history and order analysis for this customer.</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</h4>
                      <Button
                        className="w-full"
                        variant={selectedCustomer.role === 'admin' ? 'outline' : 'primary'}
                        onClick={() => handleRoleChange(selectedCustomer._id, selectedCustomer.role === 'admin' ? 'customer' : 'admin')}
                        loading={updateUserRoleMutation.isPending}
                      >
                        {selectedCustomer.role === 'admin' ? 'Revoke Admin Privileges' : 'Make Administrator'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button onClick={() => setSelectedCustomer(null)} variant="primary" size="sm">
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

export default AdminCustomers;
