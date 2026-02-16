import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Truck, 
  Package, 
  MapPin, 
  CreditCard,
  X,
  ChevronRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

const STEPS = [
  { id: 'Order Placed', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
  { id: 'Payment Confirmed', label: 'Payment Confirmed', icon: CreditCard, description: 'Payment successful' },
  { id: 'Processing', label: 'Processing', icon: Clock, description: 'Your order is being prepared' },
  { id: 'Shipped', label: 'Shipped', icon: Truck, description: 'Order is on the way' },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin, description: 'Reaching you today' },
  { id: 'Delivered', label: 'Delivered', icon: CheckCircle2, description: 'Delivered successfully' }
];

const OrderTrackingModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const currentStepIndex = STEPS.findIndex(step => step.id === order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-blue p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Order ID</p>
              <h2 className="text-2xl font-black tracking-tight">#{order._id.slice(-8).toUpperCase()}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
              <p className="font-black text-sm">{order.orderStatus}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Expected Delivery</p>
              <p className="font-black text-sm">3-4 Business Days</p>
            </div>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isCancelled ? (
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
              <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-black text-red-900 mb-2">Order Cancelled</h3>
              <p className="text-red-700 font-medium">This order has been cancelled and a refund has been initiated if applicable.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Stepper Vertical Line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-1 bg-gray-100" />
              
              <div className="space-y-8">
                {STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const historyItem = order.trackingHistory?.find(h => h.status === step.id);
                  
                  return (
                    <div key={step.id} className="flex gap-6 relative group">
                      <div className={`relative z-10 w-14 h-14 flex items-center justify-center rounded-2xl border-4 border-white shadow-xl transition-all duration-500 ${
                        isCompleted ? 'bg-primary text-white scale-110' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <step.icon className={`h-6 w-6 ${isCurrent ? 'animate-pulse' : ''}`} />
                      </div>
                      
                      <div className="flex-1 pt-2">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-black text-base ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </h4>
                          {historyItem && (
                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                              {new Date(historyItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm font-medium ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                          {step.description}
                        </p>
                        {historyItem?.comment && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold leading-relaxed">{historyItem.comment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shipping Address Summary */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Destination</h3>
            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.fullName}</p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5">
                  {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                  {order.shippingAddress.state}, {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
            Carbon Neutral Delivery Verified
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderTrackingModal;
