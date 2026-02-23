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
  Zap,
  ChevronRight
} from 'lucide-react';

const categoryIcons = {
  'Reusable Products': <Leaf className="h-5 w-5 md:h-9 md:w-9" />,
  'Organic Foods': <Utensils className="h-5 w-5 md:h-9 md:w-9" />,
  'Eco-Friendly Home': <Home className="h-5 w-5 md:h-9 md:w-9" />,
  'Sustainable Fashion': <Shirt className="h-5 w-5 md:h-9 md:w-9" />,
  'Zero Waste': <Trash2 className="h-5 w-5 md:h-9 md:w-9" />,
  'Natural Beauty': <Sparkles className="h-5 w-5 md:h-9 md:w-9" />,
  'Green Tech': <Smartphone className="h-5 w-5 md:h-9 md:w-9" />,
  'Other': <Zap className="h-5 w-5 md:h-9 md:w-9" />,
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
      <div className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 md:gap-8 min-w-max">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-16 h-16 md:w-28 md:h-28 bg-gray-100 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* boAt Style Header */}
        <div className="flex items-center justify-between mb-8 md:mb-16">
          <div className="flex flex-col gap-1">
             <h2 className="text-xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight uppercase leading-none">
               Explore <span className="text-primary italic">Shop</span>
             </h2>
             <div className="w-10 h-1 bg-primary rounded-full" />
          </div>
          <Link to="/shop" className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-primary uppercase tracking-widest hover:gap-2.5 transition-all group">
            All Collections 
            <ChevronRight className="h-3.5 w-3.5 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide pb-4 md:pb-0 md:flex-wrap md:justify-center gap-4 md:gap-12 md:px-4">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              to={`/shop?category=${encodeURIComponent(cat)}`}
              className="flex flex-col items-center group shrink-0"
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="w-16 h-16 md:w-32 md:h-32 bg-gray-50 md:bg-white rounded-full md:rounded-[2.5rem] flex items-center justify-center shadow-sm md:shadow-premium group-hover:shadow-glow-accent transition-all mb-2.5 md:mb-6 border border-gray-100"
              >
                <div className="text-accent group-hover:scale-110 transition-transform duration-500">
                  {categoryIcons[cat] || <Leaf className="h-6 w-6 md:h-9 md:w-9" />}
                </div>
              </motion.div>
              <span className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-primary transition-colors text-center max-w-[70px] md:max-w-[140px] leading-tight">
                {cat.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
