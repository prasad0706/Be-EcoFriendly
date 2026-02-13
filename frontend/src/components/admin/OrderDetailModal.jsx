import { motion } from 'framer-motion';
import { X, Receipt, TrendingUp, CreditCard, Clock, Filter, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import Button from '../common/Button';
import { ORDER_STATUSES } from '../../utils/constants';

const OrderDetailModal = ({ order, onClose, onUpdateStatus }) => {
    if (!order) return null;

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

    return (
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
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</h2>
                        <div className="flex items-center space-x-4 mt-3">
                            <span className="text-xs font-bold text-gray-500/80">Logged on {new Date(order.createdAt).toLocaleString()}</span>
                            <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase border shadow-sm ${getStatusStyle(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
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
                                    {order.items?.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-6 p-5 bg-gray-50/50 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white transition-all group">
                                            <div className="relative">
                                                <img src={item.product?.images?.[0]?.url || item.image || 'https://via.placeholder.com/80'} alt="" className="w-20 h-20 object-cover rounded-2xl shadow-md transition-transform group-hover:scale-105" />
                                                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 text-base truncate">{item.product?.name || item.name}</p>
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
                                            <span className="font-bold tabular-nums">{formatCurrency(order.itemsPrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2">
                                            <span className="opacity-60 font-bold uppercase text-[10px] tracking-widest">Surcharge (Tax)</span>
                                            <span className="font-bold tabular-nums">{formatCurrency(order.taxPrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2">
                                            <span className="opacity-60 font-bold uppercase text-[10px] tracking-widest">Logistic Fee</span>
                                            <span className="font-bold tabular-nums">{formatCurrency(order.shippingPrice)}</span>
                                        </div>
                                        <div className="pt-6 mt-2 border-t border-white/10 flex justify-between items-center font-black text-2xl px-2">
                                            <span className="text-white/80 tracking-tight">Total</span>
                                            <span className="text-primary-blue tabular-nums">{formatCurrency(order.totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 text-primary transition-transform group-hover:rotate-12 group-hover:scale-110">
                                        <CreditCard className="h-24 w-24" />
                                    </div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-6 tracking-[0.2em]">Settlement Provider</h4>
                                    <p className="text-2xl font-black text-gray-900 mb-2 truncate">{order.paymentMethod}</p>
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-eco' : 'bg-orange-500'} shadow-lg shadow-current/20`} />
                                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{order.paymentStatus}</p>
                                    </div>

                                    <button
                                        onClick={() => onUpdateStatus(order._id, order.orderStatus, order.paymentStatus === 'Paid' ? 'Pending' : 'Paid')}
                                        className="mt-10 flex items-center space-x-3 text-[10px] font-bold text-primary hover:text-primary-blue transition-colors group/btn"
                                    >
                                        <div className="p-2 bg-primary/5 rounded-lg group-hover/btn:bg-primary/10">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <span className="uppercase tracking-[0.1em] border-b border-primary/20 pb-0.5">Override Settlement: {order.paymentStatus === 'Paid' ? 'Pending' : 'Paid'}</span>
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
                                            onClick={() => onUpdateStatus(order._id, status, order.paymentStatus)}
                                            className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-bold transition-all border group ${order.orderStatus === status
                                                ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 scale-[1.02]'
                                                : 'bg-white text-gray-500 border-gray-100 hover:border-primary/40 hover:bg-primary/[0.02] hover:text-gray-900'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-2 h-2 rounded-full ${order.orderStatus === status ? 'bg-white' : 'bg-gray-200 group-hover:bg-primary/40'}`} />
                                                    <span>{status}</span>
                                                </div>
                                                {order.orderStatus === status && <CheckCircle className="h-5 w-5 animate-in zoom-in duration-300" />}
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
                                            {order.shippingAddress?.fullName || order.shippingAddress?.name}
                                        </p>
                                        <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">
                                            {order.shippingAddress?.address || order.shippingAddress?.street},<br />
                                            {order.shippingAddress?.city}, {order.shippingAddress?.zipCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-5">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Direct Line</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1">{order.shippingAddress?.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-5">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Authorized Mail</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1 truncate">{order.user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="font-bold px-10 rounded-2xl h-[52px] border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-white"
                    >
                        Terminate View
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderDetailModal;
