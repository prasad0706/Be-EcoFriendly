import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDrawer from '../components/shop/FilterDrawer';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Filter State
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    ecoScore: searchParams.get('ecoScore') || '',
    inStock: searchParams.get('inStock') === 'true',
    tags: searchParams.get('tags') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Sync with searchParams
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || 'all',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      rating: searchParams.get('rating') || '',
      ecoScore: searchParams.get('ecoScore') || '',
      inStock: searchParams.get('inStock') === 'true',
      tags: searchParams.get('tags') || '',
      sort: searchParams.get('sort') || 'newest'
    });
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (filters.category !== 'all') params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.ecoScore) params.append('ecoScore', filters.ecoScore);
    if (filters.inStock) params.append('inStock', 'true');
    if (filters.tags) params.append('tags', filters.tags);
    if (filters.sort) params.append('sort', filters.sort);
    
    setSearchParams(params);
    setPage(1);
  };

  const removeFilter = (key, value = null) => {
    const newFilters = { ...filters };
    if (key === 'category') {
      const cats = filters.category.split(',').filter(c => c !== value);
      newFilters.category = cats.length > 0 ? cats.join(',') : 'all';
    } else if (key === 'tags') {
      const tags = filters.tags.split(',').filter(t => t !== value);
      newFilters.tags = tags.length > 0 ? tags.join(',') : '';
    } else {
      newFilters[key] = key === 'inStock' ? false : '';
    }
    
    // Auto-apply after removing a chip
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all') params.append(k, v);
    });
    setSearchParams(params);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products', searchQuery, filters, page, searchParams.toString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...Object.fromEntries(searchParams.entries())
      });
      if (searchQuery) params.set('search', searchQuery);

      const response = await api.get(`/products?${params}`);
      return response.data;
    },
  });

  const activeChips = [];
  if (filters.category !== 'all') filters.category.split(',').forEach(c => activeChips.push({ key: 'category', label: c, value: c }));
  if (filters.tags) filters.tags.split(',').forEach(t => activeChips.push({ key: 'tags', label: t, value: t }));
  if (filters.minPrice) activeChips.push({ key: 'minPrice', label: `Min: $${filters.minPrice}` });
  if (filters.maxPrice) activeChips.push({ key: 'maxPrice', label: `Max: $${filters.maxPrice}` });
  if (filters.rating) activeChips.push({ key: 'rating', label: `${filters.rating}★ & Above` });
  if (filters.ecoScore) activeChips.push({ key: 'ecoScore', label: `Eco: ${filters.ecoScore}+` });
  if (filters.inStock) activeChips.push({ key: 'inStock', label: 'In Stock' });

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <FilterDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-mint/50 px-3 py-1 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium Collection</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                Explore <span className="text-primary italic">Better</span>
              </h1>
              <p className="text-gray-500 font-medium max-w-xl">
                Discover eco-friendly products that don't compromise on quality or style.
              </p>
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="group flex items-center gap-3 bg-white border-2 border-primary/20 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl shadow-primary/5 active:scale-95"
            >
              <SlidersHorizontal className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              Filters
            </button>
          </div>
        </div>

        {/* Search & Sort Row */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center bg-gray-50/50 p-4 rounded-[2.5rem] border border-gray-100">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all shadow-sm"
            />
          </div>

          <div className="w-full md:w-64">
            <select
              value={filters.sort}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, sort: e.target.value }));
                const p = new URLSearchParams(searchParams);
                p.set('sort', e.target.value);
                setSearchParams(p);
              }}
              className="w-full px-8 py-4 bg-white border border-gray-100 rounded-[2rem] font-black text-xs uppercase tracking-widest text-gray-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_1.5rem_center] bg-no-repeat shadow-sm outline-none focus:ring-4 focus:ring-primary/10"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        <AnimatePresence>
          {activeChips.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {activeChips.map((chip, i) => (
                <motion.div
                  key={`${chip.key}-${chip.value || i}`}
                  layout
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-primary font-bold text-[11px] uppercase tracking-wider"
                >
                  {chip.label}
                  <button 
                    onClick={() => removeFilter(chip.key, chip.value)}
                    className="hover:bg-primary/10 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors ml-2"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-24">
            <Loading size="lg" />
          </div>
        ) : data?.data?.length > 0 ? (
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              <AnimatePresence mode="popLayout">
                {data.data.map((product, index) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex justify-center items-center space-x-3 pt-12 border-t border-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setPage(page - 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                  disabled={page === 1}
                  className="rounded-xl px-6"
                >
                  Prev
                </Button>

                <div className="flex items-center gap-2">
                  {[...Array(data.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPage(i + 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                      className={`w-12 h-12 rounded-xl font-black text-xs transition-all ${
                        page === i + 1
                          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setPage(page + 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                  disabled={page === data.pages}
                  className="rounded-xl px-6"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-background rounded-[3rem] border-2 border-dashed border-gray-100"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-premium">
              <Search className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No products found</h3>
            <p className="text-gray-500 font-medium mb-12 max-w-sm mx-auto">
              We couldn't find anything matching your current filters. Try relaxing your search or clear all filters.
            </p>
            <Button onClick={() => setSearchParams(new URLSearchParams())} className="font-black px-12 py-5 rounded-2xl shadow-2xl">
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shop;
