import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import ProductCard from '../product/ProductCard';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductSlider = ({ title, queryParams, link }) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: async () => {
      const response = await api.get('/products', { params: { ...queryParams, limit: 10 } });
      return response.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 md:h-10 w-48 md:w-64 bg-gray-100 animate-pulse rounded-xl mb-6 md:mb-10" />
          <div className="flex gap-4 md:gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[160px] md:min-w-[320px] h-[250px] md:h-[450px] bg-gray-50 animate-pulse rounded-xl md:rounded-[2rem] border border-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="py-6 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* boAt Style Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <div className="flex flex-col gap-1">
             <h2 className="text-xl md:text-4xl font-black text-gray-900 tracking-tight uppercase leading-none">
               {title}
             </h2>
             <div className="w-10 h-1 bg-primary rounded-full" />
          </div>
          <Link to={link} className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-primary uppercase tracking-widest hover:gap-2.5 transition-all group">
            View All 
            <ChevronRight className="h-3.5 w-3.5 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative">
          <div className="flex gap-3 md:gap-8 overflow-x-auto pb-4 md:pb-10 scrollbar-hide snap-x px-1">
            {products.map((product) => (
              <div key={product._id} className="min-w-[170px] md:min-w-[320px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
            
            {/* View All Link Card */}
            <Link 
              to={link}
              className="min-w-[140px] md:min-w-[240px] flex flex-col items-center justify-center bg-gray-50/50 rounded-xl md:rounded-[2.5rem] border-2 border-dashed border-primary/20 group hover:border-primary/50 hover:bg-white transition-all snap-start"
            >
              <div className="w-10 h-10 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-premium">
                <ArrowRight className="h-4 w-4 md:h-8 md:w-8 text-primary" />
              </div>
              <span className="text-[8px] md:text-xs font-black text-primary uppercase tracking-widest text-center px-4">
                Full Collection
              </span>
            </Link>
          </div>
          
          {/* Subtle Fade Effect */}
          <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none hidden md:block" />
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
