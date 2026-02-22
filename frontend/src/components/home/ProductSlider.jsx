import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import ProductCard from '../product/ProductCard';
import { ChevronRight, ArrowRight } from 'lucide-react';
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
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-8" />
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[280px] h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>
          <Link to={link} className="flex items-center text-primary font-bold hover:gap-2 transition-all">
            View All <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
            {products.map((product) => (
              <div key={product._id} className="min-w-[280px] md:min-w-[320px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
            <Link 
              to={link}
              className="min-w-[200px] flex flex-col items-center justify-center bg-soft-green rounded-2xl border-2 border-dashed border-accent/30 group hover:border-accent transition-all"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <ArrowRight className="h-6 w-6 text-accent" />
              </div>
              <span className="font-bold text-primary">View All {title}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
