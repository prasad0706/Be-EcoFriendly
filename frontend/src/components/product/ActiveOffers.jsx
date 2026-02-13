import { useQuery } from '@tanstack/react-query';
import { Tag, Copy, Check, Info } from 'lucide-react';
import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ActiveOffers = ({ productId }) => {
  const [copiedId, setCopiedId] = useState(null);

  const { data: offers, isLoading } = useQuery({
    queryKey: ['offers', productId],
    queryFn: async () => {
      const response = await api.get(`/offers?productId=${productId}`);
      return response.data.data;
    }
  });

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Coupon copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {[1, 2].map((i) => (
        <div key={i} className="min-w-[280px] h-32 bg-gray-100 animate-pulse rounded-2xl" />
      ))}
    </div>
  );

  if (!offers || offers.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
        <Tag className="h-4 w-4 text-accent" />
        Active Offers
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
        {offers.map((offer) => (
          <motion.div
            key={offer._id}
            whileHover={{ y: -2 }}
            className="min-w-[280px] max-w-[280px] bg-white border border-accent/20 rounded-2xl p-4 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-accent/10 text-accent text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  {offer.discountType === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                </span>
                <Info className="h-3.5 w-3.5 text-gray-300 hover:text-gray-500 cursor-pointer" />
              </div>
              
              <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight line-clamp-1">{offer.title}</h4>
              <p className="text-xs text-gray-500 font-medium mb-4 line-clamp-1">{offer.description}</p>
              
              <div className="flex items-center justify-between bg-gray-50 border border-dashed border-gray-200 rounded-xl px-3 py-2">
                <span className="font-mono text-xs font-black text-gray-700 uppercase tracking-wider">
                  {offer.couponCode}
                </span>
                <button 
                  onClick={() => handleCopy(offer.couponCode, offer._id)}
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  {copiedId === offer._id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActiveOffers;
