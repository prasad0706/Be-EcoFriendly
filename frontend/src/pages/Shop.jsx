import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, X, ChevronDown } from 'lucide-react';
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
  if (filters.rating) activeChips.push({ key: 'rating', label: `${filters.rating}★` });
  if (filters.ecoScore) activeChips.push({ key: 'ecoScore', label: `Eco: ${filters.ecoScore}+` });
  if (filters.inStock) activeChips.push({ key: 'inStock', label: 'In Stock' });

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-32 pb-12 md:pb-20">
      <FilterDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header - Compact for Mobile */}
        <div className="mb-6 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
            <div className="text-left">
              <div className="inline-flex items-center space-x-2 bg-primary/5 px-2 md:px-3 py-1 rounded-full mb-3 md:mb-4 border border-primary/10 transition-transform active:scale-95">
                <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" />
                <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest">Premium Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 mb-2 md:mb-4 tracking-tighter uppercase leading-none italic">
                Eco <span className="text-primary underline decoration-primary/10">Catalog.</span>
              </h1>
              <p className="hidden md:block text-sm md:text-lg text-gray-400 font-bold uppercase tracking-widest max-w-xl opacity-80 leading-relaxed italic">
                Performance meets sustainability in every pick.
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-4 scrollbar-hide">
               <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex flex-1 md:flex-none items-center justify-center gap-2 bg-white border border-gray-100 px-5 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest text-gray-900 transition-all shadow-sm active:scale-95 min-w-[120px]"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  Filter
                </button>
                <div className="relative flex-1 md:w-64">
                   <select
                      value={filters.sort}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, sort: e.target.value }));
                        const p = new URLSearchParams(searchParams);
                        p.set('sort', e.target.value);
                        setSearchParams(p);
                      }}
                      className="w-full px-5 py-3 md:px-8 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest text-gray-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] md:bg-[length:16px_16px] bg-[right_1rem_center] md:bg-[right_1.5rem_center] bg-no-repeat shadow-sm outline-none active:scale-95 transition-all min-w-[130px]"
                    >
                      <option value="newest">Sort</option>
                      <option value="price_asc">Price: Low</option>
                      <option value="price_desc">Price: High</option>
                      <option value="rating_desc">Ratings</option>
                    </select>
                </div>
            </div>
          </div>
        </div>

        {/* Search Row - Compact for Mobile */}
        <div className="mb-6 relative group">
          <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-300 h-4 w-4 md:h-5 md:w-5 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full pl-11 md:pl-16 pr-6 py-3 md:py-4.5 bg-gray-50/50 border border-gray-100 rounded-xl md:rounded-3xl focus:ring-4 focus:ring-primary/5 outline-none font-black text-gray-900 transition-all text-[10px] md:text-base placeholder:text-gray-300 uppercase tracking-widest h-12 md:h-auto"
          />
        </div>

        {/* Active Filter Chips - Standardized Padding */}
        <AnimatePresence>
          {activeChips.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-6 md:mb-10 overflow-x-auto scrollbar-hide py-1"
            >
              {activeChips.map((chip, i) => (
                <motion.div
                  key={`${chip.key}-${chip.value || i}`}
                  layout
                  className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-primary text-white rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-lg shadow-primary/10"
                >
                  {chip.label}
                  <button onClick={() => removeFilter(chip.key, chip.value)}>
                    <X className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" />
                  </button>
                </motion.div>
              ))}
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="text-[8px] md:text-[10px] font-black text-red-400 uppercase tracking-widest ml-2 shrink-0 italic"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid - 2 Column on Mobile */}
        {isLoading ? (
          <div className="py-24">
            <Loading size="lg" />
          </div>
        ) : data?.data?.length > 0 ? (
          <div className="space-y-10 md:space-y-16">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-x-8 gap-y-6 md:gap-y-12">
              <AnimatePresence mode="popLayout">
                {data.data.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination - boAt Style */}
            {data?.pages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-10 border-t border-gray-50 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1}
                  className="rounded-xl px-4 h-10 md:h-12 text-[10px] font-black uppercase tracking-widest border-gray-100"
                >
                  Prev
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(data.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-black text-[10px] transition-all ${
                        page === i + 1
                          ? 'bg-gray-900 text-white shadow-xl'
                          : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === data.pages}
                  className="rounded-xl px-4 h-10 md:h-12 text-[10px] font-black uppercase tracking-widest border-gray-100"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Search className="h-6 w-6 text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Void Encountered.</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-8">No results in this coordinate system.</p>
            <Button onClick={() => setSearchParams(new URLSearchParams())} className="font-black px-10 py-4 h-12 rounded-xl shadow-xl shadow-primary/10 uppercase tracking-widest text-xs border-none">
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shop;
