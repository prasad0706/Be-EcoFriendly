import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Shield, User, Mail, Calendar, Search, Filter, MoreHorizontal, UserCheck, UserPlus, TrendingUp, X, MapPin, AtSign, ShieldCheck } from 'lucide-react';
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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const res = await api.get('/admin/users?limit=100');
      return res.data.data;
    },
    refetchInterval: 10000,
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

  // Stats calculation
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
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">User Base Analytics</h1>
          <p className="text-gray-500 font-medium mt-1">Direct oversight of your global community.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => refetch()}
            className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl shadow-sm font-bold"
          >
            Refresh Hub
          </Button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-blue-50 w-32 h-32 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
              <User className="text-white h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Community</p>
            <h3 className="text-4xl font-black text-gray-900 tabular-nums">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-green-50 w-32 h-32 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="bg-green-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-600/20">
              <ShieldCheck className="text-white h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Administrative Tier</p>
            <h3 className="text-4xl font-black text-gray-900 tabular-nums">{stats.admins}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-purple-50 w-32 h-32 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/20">
              <TrendingUp className="text-white h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">New Registrations</p>
            <h3 className="text-4xl font-black text-gray-900 tabular-nums">+{stats.newThisMonth}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 border border-white shadow-xl shadow-gray-200/50">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Identify user by name or digital address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-gray-200 font-medium shadow-sm"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-gray-200 font-bold text-gray-700 shadow-sm appearance-none min-w-[180px]"
        >
          <option value="">Role: All Access</option>
          <option value="customer">Customer Access</option>
          <option value="admin">Admin Privilege</option>
        </select>
      </div>

      {/* User Ledger */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-8 py-6">Member Identity</th>
                <th className="px-8 py-6">Digital Anchor</th>
                <th className="px-8 py-6">Privilege Tier</th>
                <th className="px-8 py-6">Tenure</th>
                <th className="px-8 py-6 text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((customer) => (
                <motion.tr
                  key={customer._id}
                  layout
                  className="group hover:bg-gray-50/50 transition-all"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-gray-600 shadow-sm border border-white">
                        {customer.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{customer.name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">ID: {customer._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2 text-sm font-bold text-gray-500">
                      <AtSign className="h-4 w-4 text-gray-300" />
                      <span>{customer.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-transparent ${customer.role === 'admin'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                      {customer.role || 'customer'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-400">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 hover:shadow-md transition-all"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Modal - Premium Redesign */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-12 py-12 border-b border-gray-100 shrink-0 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                    {selectedCustomer.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">{selectedCustomer.name}</h2>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedCustomer.role === 'admin'
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 text-white'
                        }`}>
                        {selectedCustomer.role || 'customer'} Tier
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400 text-xs font-bold uppercase">Member since {new Date(selectedCustomer.createdAt).getFullYear()}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-4 hover:bg-gray-100 rounded-[2rem] text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="h-8 w-8" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-12 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Digital Identity</h4>
                      <div className="space-y-4">
                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100/50 flex items-center space-x-4">
                          <Mail className="h-6 w-6 text-gray-400" />
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Primary Email</p>
                            <p className="font-bold text-gray-900">{selectedCustomer.email}</p>
                          </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100/50 flex items-center space-x-4">
                          <MapPin className="h-6 w-6 text-gray-400" />
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Region Access</p>
                            <p className="font-bold text-gray-900">Standard Global</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white">
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">Security & Auth</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-white/60">Verification Status</span>
                          <span className={selectedCustomer.isVerified ? 'text-green-400' : 'text-orange-400'}>
                            {selectedCustomer.isVerified ? 'Syste-Verified' : 'Pending Verification'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-white/60">Account Integrity</span>
                          <span className="text-green-400">Stable</span>
                        </div>
                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                          <span className="text-[10px] text-white/40 uppercase">Identity Hash</span>
                          <span className="text-[10px] font-mono text-white/20 uppercase">{selectedCustomer._id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
                      <div className="bg-gray-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6">
                        <Clock className="h-8 w-8 text-gray-300" />
                      </div>
                      <h4 className="text-lg font-black text-gray-900">Advanced Analytics Locked</h4>
                      <p className="text-xs text-gray-400 font-bold mt-2 leading-relaxed px-6 uppercase tracking-tight">Full transaction history and behavioral data becomes available once first order is processed.</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Access Control Override</h4>
                      <button
                        disabled={updateUserRoleMutation.isPending}
                        onClick={() => handleRoleChange(selectedCustomer._id, selectedCustomer.role === 'admin' ? 'customer' : 'admin')}
                        className={`w-full p-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 ${selectedCustomer.role === 'admin'
                            ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                            : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20'
                          }`}
                      >
                        {selectedCustomer.role === 'admin' ? 'Revoke System Admin' : 'Grant Administrative Privilege'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-12 py-10 bg-gray-50/50 border-t border-gray-100 flex justify-end shrink-0">
                <Button onClick={() => setSelectedCustomer(null)} className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm">
                  Dismiss Dossier
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
