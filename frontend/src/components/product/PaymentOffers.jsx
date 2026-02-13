import { useQuery } from '@tanstack/react-query';
import { CreditCard, Wallet, Zap, Leaf, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  Wallet: Wallet,
  CreditCard: CreditCard,
  Zap: Zap,
  Leaf: Leaf
};

const PaymentOffers = () => {
  const [expandedId, setExpandedId] = useState(null);

  const { data: offers, isLoading } = useQuery({
    queryKey: ['paymentOffers'],
    queryFn: async () => {
      const response = await api.get('/payment-offers');
      return response.data.data;
    }
  });

  if (isLoading || !offers) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rewards & Payment Offers</h3>
      
      <div className="space-y-2">
        {offers.map((offer, idx) => {
          const Icon = iconMap[offer.icon] || CreditCard;
          const isExpanded = expandedId === (offer._id || idx);
          
          return (
            <div 
              key={offer._id || idx}
              className={`border rounded-2xl transition-all duration-300 ${isExpanded ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : (offer._id || idx))}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${isExpanded ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{offer.title}</h4>
                    {!isExpanded && <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-0.5">TAP TO VIEW DETAIL</p>}
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 ml-14">
                      <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                        {offer.description}
                      </p>
                      <button className="mt-4 text-[10px] font-black text-primary border-b-2 border-primary pb-px hover:border-primary-dark transition-all">
                        VIEW TERMS & CONDITIONS
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentOffers;
