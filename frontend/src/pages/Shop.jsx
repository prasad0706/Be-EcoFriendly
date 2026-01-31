import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, LayoutGrid, List, Sparkles } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCT_CATEGORIES } from '../utils/constants';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const categories = ['all', ...PRODUCT_CATEGORIES];

  const sortOptions = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A-Z' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, sortBy, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: 12,
        sort: sortBy,
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await api.get(`/products?${params}`);
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-mint/50 px-3 py-1 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Our Collection</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Shop <span className="text-primary italic">Sustainable</span>
              </h1>
              <p className="text-gray-600 font-medium max-w-xl">
                Browse our carefully selected range of eco-friendly alternatives for a better lifestyle.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                {['all', 'Reusable Products', 'Zero Waste'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setPage(1); }}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-900'
                      }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm font-bold text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-24">
            <Loading size="lg" />
          </div>
        ) : data?.data?.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {data.data.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {[...Array(data.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === i + 1
                          ? 'bg-primary text-white'
                          : 'text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === data.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500 font-medium mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
