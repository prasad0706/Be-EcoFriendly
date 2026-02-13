import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Utensils, 
  Home, 
  Shirt, 
  Trash2, 
  Sparkles, 
  Smartphone, 
  Zap 
} from 'lucide-react';

const categoryIcons = {
  'Reusable Products': <Leaf className="h-8 w-8" />,
  'Organic Foods': <Utensils className="h-8 w-8" />,
  'Eco-Friendly Home': <Home className="h-8 w-8" />,
  'Sustainable Fashion': <Shirt className="h-8 w-8" />,
  'Zero Waste': <Trash2 className="h-8 w-8" />,
  'Natural Beauty': <Sparkles className="h-8 w-8" />,
  'Green Tech': <Smartphone className="h-8 w-8" />,
  'Other': <Zap className="h-8 w-8" />,
};

const CategorySection = () => {
  const { data: homeData, isLoading } = useQuery({
    queryKey: ['homeData'],
    queryFn: async () => {
      const response = await api.get('/home');
      return response.data.data;
    }
  });

  const categories = homeData?.categories || [];

  if (isLoading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-around">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-24 h-24 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Shop by Category</h2>
          <p className="text-gray-500 font-medium">Find exactly what you're looking for</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              to={`/shop?category=${encodeURIComponent(cat)}`}
              className="flex flex-col items-center group"
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.05 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-premium group-hover:shadow-glow transition-all mb-6 border border-gray-50"
              >
                <div className="text-accent group-hover:scale-110 transition-transform duration-300">
                  {categoryIcons[cat] || <Leaf className="h-8 w-8" />}
                </div>
              </motion.div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors text-center max-w-[120px]">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
