import { motion } from 'framer-motion';
import { X, Mail, ShieldCheck, Calendar, Clock, Shield } from 'lucide-react';
import Button from '../common/Button';

const CustomerDetailModal = ({ customer, onClose, onUpdateRole, currentUser, updatingRole }) => {
    if (!customer) return null;

    const formatRole = (role) => {
        if (!role) return '';
        return role
            .replace('super_admin', 'super admin')
            .replace('admin_', '')
            .replace('_', ' ');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
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
                            {customer.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{customer.name || 'Anonymous Entity'}</h2>
                            <div className="flex items-center space-x-3 mt-3">
                                <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-xl border border-white text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">UID: {customer._id.slice(-8).toUpperCase()}</span>
                                <span className={`px-3 py-1 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20`}>{formatRole(customer.role)}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
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
                                        <p className="text-sm font-black text-gray-900 truncate tracking-tight">{customer.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50/50 rounded-[3rem] text-gray-400 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:rotate-12 duration-700">
                                    <ShieldCheck className="h-20 w-20 text-primary-blue" />
                                </div>
                                <h5 className="text-[10px] font-black text-gray-400 uppercase mb-8 tracking-[0.2em]">Matrix Clearances</h5>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Designation Status</span>
                                        <span className="px-4 py-1.5 bg-primary-blue text-gray-100 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary-blue/20">{formatRole(customer.role)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entity Validation</span>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-[10px] font-black text-gray-400 uppercase">{customer.isVerified ? 'Synchronized' : 'Pending Sync'}</span>
                                            <div className={`h-3 w-3 rounded-full ${customer.isVerified ? 'bg-gray-500 shadow-gray-500/50' : 'bg-orange-500 shadow-orange-500/50'} shadow-lg`} />
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
                                            <p className="text-sm font-black text-gray-900 mt-1">{formatDate(customer.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex items-center space-x-5">
                                        <div className="p-3 bg-white rounded-xl shadow-sm">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Access Event</p>
                                            <p className="text-sm font-black text-gray-900 mt-1">{formatDate(customer.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-gray-100">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Management Protocols</h4>
                                {currentUser?.role === 'super_admin' ? (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assign System Role</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['user', 'customer', 'super_admin', 'admin_products', 'admin_orders', 'admin_customers', 'admin_sales', 'admin_reviews'].map((role) => (
                                                <button
                                                    key={role}
                                                    onClick={() => onUpdateRole(customer._id, role)}
                                                    disabled={updatingRole}
                                                    className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-between group ${customer.role === role
                                                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                                                        : 'bg-white text-gray-400 border-gray-100 hover:border-primary/50 hover:text-primary'
                                                        }`}
                                                >
                                                    <span className="truncate mr-2">{formatRole(role)}</span>
                                                    {customer.role === role && <ShieldCheck className="h-3 w-3 text-green-eco" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 text-center">
                                        <Shield className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Insufficient Privileges</p>
                                        <p className="text-gray-400/60 text-[10px] uppercase tracking-wider mt-1">Role Management Locked</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-12 py-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="px-12 font-black uppercase tracking-[0.2em] text-[10px] h-[52px] rounded-2xl border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-white"
                    >
                        Exit Profile View
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerDetailModal;
