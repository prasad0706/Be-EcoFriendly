import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Tag, Sparkles, ChevronRight } from 'lucide-react';

const DealsSection = () => {
  const { data: homeData, isLoading } = useQuery({
    queryKey: ['homeData'],
    queryFn: async () => {
      const response = await api.get('/home');
      return response.data.data;
    }
  });

  const deals = homeData?.deals || [];

  if (isLoading || deals.length === 0) return null;

  return (
    <section className="py-8 md:py-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* boAt Style Header */}
        <div className="flex items-center justify-between mb-8 md:mb-16">
          <div className="flex flex-col gap-1">
             <h2 className="text-xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight uppercase leading-none">
               Daily <span className="text-accent italic">Deals</span>
             </h2>
             <div className="w-10 h-1 bg-accent rounded-full" />
          </div>
          <Link to="/deals" className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-primary uppercase tracking-widest hover:gap-2.5 transition-all group">
            All Deals 
            <ChevronRight className="h-3.5 w-3.5 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
          {deals.map((deal, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="relative h-[250px] sm:h-[300px] md:h-[450px] rounded-2xl md:rounded-[3rem] overflow-hidden shadow-lg md:shadow-2xl group border border-gray-100"
            >
              <img 
                src={deal.image} 
                alt={deal.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 md:p-12 flex flex-col justify-end">
                <div className="inline-flex items-center gap-1.5 bg-accent text-white px-3 py-1 md:px-5 md:py-2 rounded md:rounded-full w-fit mb-3 shadow-lg">
                  <Tag className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">{deal.discount} OFF</span>
                </div>
                <h3 className="text-2xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 italic tracking-tighter leading-none drop-shadow-lg uppercase">
                  {deal.title}
                </h3>
                <p className="hidden md:block text-sm md:text-xl text-gray-200 font-medium mb-8 max-w-sm opacity-90 leading-relaxed italic">
                  {deal.description}
                </p>
                <Link to={deal.link || '/shop'} className="w-full sm:w-fit">
                  <Button variant="white" className="w-full sm:w-fit font-black px-8 py-3.5 md:px-12 md:py-5 border-none text-primary hover:bg-accent hover:text-white transition-all shadow-xl rounded-lg md:rounded-2xl text-[10px] md:text-base uppercase tracking-widest flex items-center justify-center gap-2 h-11 md:h-auto overflow-hidden">
                    Grab Offer
                    <Sparkles className="h-3.5 w-3.5 md:h-5 md:w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
