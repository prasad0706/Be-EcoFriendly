import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Tag } from 'lucide-react';

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
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deals.map((deal, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl"
            >
              <img 
                src={deal.image} 
                alt={deal.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 md:p-12 flex flex-col justify-end">
                <div className="inline-flex items-center gap-2 bg-accent text-white px-4 py-1.5 rounded-full w-fit mb-4">
                  <Tag className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{deal.discount}</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-4 italic tracking-tighter">
                  {deal.title}
                </h3>
                <p className="text-gray-200 font-medium mb-8 max-w-sm">
                  {deal.description}
                </p>
                <Link to={deal.link || '/shop'}>
                  <Button variant="white" className="w-fit font-black px-8 py-4 border-none text-primary hover:bg-primary hover:text-white transition-all shadow-xl">
                    Grab the Deal
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
