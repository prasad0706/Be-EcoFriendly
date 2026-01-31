import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Shield,
  User,
  Mail,
  Search,
  X,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Clock,
  AlertCircle,
  Calendar,
  ChevronRight,
  RefreshCw,
  Users,
  Target,
  UserCheck,
  Filter 
} from 'lucide-react';
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

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const res = await api.get('/admin/users?limit=100');
      return res.data.data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => api.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
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
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate statistics
  const adminUsers = data?.users?.filter(user => user.role === 'admin') || [];
  const customerUsers = data?.users?.filter(user => user.role === 'user' || user.role === 'customer') || [];

  const now = new Date();
  const newThisMonth = data?.users?.filter(user => {
    const createdDate = new Date(user.createdAt);
    return createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear();
  }) || [];

  const filteredCustomers = data?.users?.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? customer.role === filterRole : true;
    return matchesSearch && matchesRole;
  }) || [];

  if (isLoading && !data) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-mesh rounded-[3rem] border border-gray-100 p-12 text-center shadow-xl">
        <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] mb-8 shadow-inner">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Database Synchronization Interrupted</h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-10 font-bold uppercase tracking-widest text-[10px]">Unable to establish a secure handshake with the user repository.</p>
        <Button onClick={() => refetch()} className="flex items-center space-x-3 px-10 h-14 rounded-2xl shadow-lg shadow-primary/20">
          <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} />
          <span className="font-bold uppercase tracking-widest text-xs">Verify Connection</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            <span className="gradient-text">Customers Repository</span>
          </h1>
          <p className="text-gray-500 font-medium">Analyze user demographics and manage community access levels.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Filter by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium w-80 shadow-sm transition-all"
            />
          </div>
          <button
            onClick={() => refetch()}
            className={`p-3.5 rounded-2xl transition-all shadow-sm border border-gray-100 ${isFetching ? 'animate-spin text-primary bg-primary/10 border-primary/20' : 'text-gray-400 hover:text-gray-600 bg-white hover:shadow-md'}`}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Community Strength', value: customerUsers.length, icon: Users, color: 'bg-primary', lightColor: 'bg-primary/5', textColor: 'text-primary' },
          { label: 'Verified Admins', value: adminUsers.length, icon: ShieldCheck, color: 'bg-green-eco', lightColor: 'bg-green-eco/5', textColor: 'text-green-eco' },
          { label: 'Growth Velocity', value: `+${newThisMonth.length}`, icon: TrendingUp, color: 'bg-teal', lightColor: 'bg-teal/5', textColor: 'text-teal' }
        ].map((stat, i) => (
          <div key={i} className="card-premium p-8 flex items-center space-x-8 relative overflow-hidden group">
            {isFetching && (
              <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
            )}
            <div className={`p-5 rounded-[1.5rem] ${stat.lightColor} ${stat.textColor} shadow-inner transition-transform group-hover:scale-110 duration-500`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-4xl font-black text-gray-900 mt-1.5 tracking-tighter">{stat.value}</h3>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
              <stat.icon className="h-32 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white/80 backdrop-blur-md p-2 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-primary/5 flex items-center space-x-4">
        <div className="flex-1 flex items-center px-6">
          <Filter className="h-4 w-4 text-gray-300 mr-4" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter Matrix:</span>
        </div>
        <div className="flex space-x-2">
          {['', 'user', 'customer', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${filterRole === role
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {role === '' ? 'All Tiers' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="card-premium overflow-hidden border-none shadow-2xl shadow-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Identity Profile</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Digital Contact</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] text-center">Authorization</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Established</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-primary to-primary-blue text-white flex items-center justify-center font-bold text-base shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
                        {customer.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-gray-900 text-sm tracking-tight">{customer.name || 'Anonymous Entity'}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-eco" />
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Core</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center text-sm font-bold text-gray-600 tracking-tight">
                      <Mail className="h-4 w-4 mr-3 text-primary opacity-30" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${customer.role === 'admin'
                        ? 'bg-green-eco/10 text-green-eco border-green-eco/20'
                        : 'bg-primary-blue/10 text-primary-blue border-primary-blue/20'
                      }`}>
                      {customer.role || 'customer'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-xs font-bold text-gray-500 tabular-nums">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-3.5 bg-gray-50 text-gray-400 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/20 active:scale-90 border border-transparent hover:border-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="py-32 text-center bg-gray-50/20">
              <div className="p-8 bg-white rounded-full w-fit mx-auto shadow-sm border border-gray-100 mb-8">
                <Users className="h-16 w-16 text-gray-100" />
              </div>
              <h4 className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em]">Matrix Filtration Yielded Zero Results</h4>
            </div>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[3.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
            >
              <div className="px-12 py-12 flex items-center justify-between bg-mesh border-b border-gray-100 relative overflow-hidden">
                <div className="relative z-10 flex items-center space-x-8">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary to-primary-blue flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-primary/30">
                    {selectedCustomer.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{selectedCustomer.name || 'Anonymous Entity'}</h2>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-xl border border-white text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">UID: {selectedCustomer._id.slice(-8).toUpperCase()}</span>
                      <span className={`px-3 py-1 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20`}>Tier: {selectedCustomer.role}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="relative z-10 p-4 bg-white/50 backdrop-blur-sm hover:bg-white rounded-2xl transition-all shadow-sm hover:shadow-lg border border-white hover:border-gray-100"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-10">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center">
                        <Mail className="h-3 w-3 mr-3 text-primary" />
                        Encrypted Communications
                      </h4>
                      <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex items-center space-x-5 group hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all">
                        <div className="p-3 bg-white rounded-[1.25rem] shadow-md group-hover:scale-110 transition-transform">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Vector</p>
                          <p className="text-sm font-black text-gray-900 truncate tracking-tight">{selectedCustomer.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-gray-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:rotate-12 duration-700">
                        <ShieldCheck className="h-20 w-20 text-primary-blue" />
                      </div>
                      <h5 className="text-[10px] font-black text-white/40 uppercase mb-8 tracking-[0.2em]">Matrix Clearances</h5>
                      <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Designation Status</span>
                          <span className="px-4 py-1.5 bg-primary-blue text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary-blue/20">{selectedCustomer.role}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Entity Validation</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-[10px] font-black text-white/80 uppercase">{selectedCustomer.isVerified ? 'Synchronized' : 'Pending Sync'}</span>
                            <div className={`h-3 w-3 rounded-full ${selectedCustomer.isVerified ? 'bg-green-eco shadow-green-eco/50' : 'bg-orange-500 shadow-orange-500/50'} shadow-lg`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center">
                        <Calendar className="h-3 w-3 mr-3 text-primary" />
                        Temporal Metrics
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex items-center space-x-5">
                          <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Onboarding Cycle</p>
                            <p className="text-sm font-black text-gray-900 mt-1">{formatDate(selectedCustomer.createdAt)}</p>
                          </div>
                        </div>
                        <div className="p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex items-center space-x-5">
                          <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Access Event</p>
                            <p className="text-sm font-black text-gray-900 mt-1">{formatDate(selectedCustomer.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Management Protocols</h4>
                      <div className="space-y-4">
                        <Button
                          className="w-full h-16 flex justify-between items-center px-10 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/10 group"
                          variant={selectedCustomer.role === 'admin' ? 'outline' : 'primary'}
                          onClick={() => handleRoleChange(selectedCustomer._id, selectedCustomer.role === 'admin' ? 'customer' : 'admin')}
                          loading={updateUserRoleMutation.isPending}
                        >
                          <div className="flex items-center space-x-4">
                            <Shield className={`h-5 w-5 ${selectedCustomer.role === 'admin' ? 'text-red-500' : 'text-white'}`} />
                            <span>{selectedCustomer.role === 'admin' ? 'Revoke Authorization' : 'Grant Admin Override'}</span>
                          </div>
                          <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${selectedCustomer.role === 'admin' ? 'text-gray-300' : 'text-white/40'}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-12 py-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button
                  onClick={() => setSelectedCustomer(null)}
                  variant="outline"
                  className="px-12 font-black uppercase tracking-[0.2em] text-[10px] h-[52px] rounded-2xl border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-white"
                >
                  Exit Profile View
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
