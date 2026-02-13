import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Leaf, Check } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const FILTER_TAGS = ['Bamboo', 'Organic', 'Solar', 'Reusable', 'Biodegradable', 'Zero Waste'];
const RATING_OPTIONS = [4, 3, 2];
const ECO_SCORE_OPTIONS = [80, 60, 40];

const FilterDrawer = ({ isOpen, onClose, filters, setFilters, applyFilters }) => {
  const handleCategoryToggle = (cat) => {
    const currentCats = filters.category === 'all' ? [] : filters.category.split(',').filter(Boolean);
    const newCats = currentCats.includes(cat)
      ? currentCats.filter(c => c !== cat)
      : [...currentCats, cat];
    
    setFilters(prev => ({
      ...prev,
      category: newCats.length > 0 ? newCats.join(',') : 'all'
    }));
  };

  const handleTagToggle = (tag) => {
    const currentTags = filters.tags ? filters.tags.split(',').filter(Boolean) : [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    setFilters(prev => ({
      ...prev,
      tags: newTags.length > 0 ? newTags.join(',') : ''
    }));
  };

  const handleClear = () => {
    setFilters({
      category: 'all',
      minPrice: '',
      maxPrice: '',
      rating: '',
      ecoScore: '',
      inStock: false,
      tags: '',
      sort: 'newest'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary/5">
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Filters By
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
              >
                <X className="h-6 w-6 text-gray-900" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Category */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Category</h3>
                <div className="space-y-3">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer appearance-none w-5 h-5 rounded-md border-2 border-gray-200 checked:bg-primary checked:border-primary transition-all"
                          checked={filters.category !== 'all' && filters.category.split(',').includes(cat)}
                          onChange={() => handleCategoryToggle(cat)}
                        />
                        <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                      </div>
                      <span className="ml-3 text-sm font-semibold text-gray-600 group-hover:text-primary transition-colors italic">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Price Range */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Price Range</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />
                  </div>
                  <div className="text-gray-400 font-bold">-</div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />
                  </div>
                </div>
              </section>

              {/* Rating */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Minimum Rating</h3>
                <div className="space-y-2">
                  {RATING_OPTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setFilters(prev => ({ ...prev, rating: prev.rating === String(r) ? '' : String(r) }))}
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        filters.rating === String(r)
                          ? 'bg-primary/5 border-primary text-primary'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < r ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-bold italic">& Above</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Eco Score */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Minimum Eco Score</h3>
                <div className="grid grid-cols-3 gap-3">
                  {ECO_SCORE_OPTIONS.map((score) => (
                    <button
                      key={score}
                      onClick={() => setFilters(prev => ({ ...prev, ecoScore: prev.ecoScore === String(score) ? '' : String(score) }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                        filters.ecoScore === String(score)
                          ? 'bg-accent/10 border-accent text-accent shadow-sm'
                          : 'bg-white border-gray-100 text-gray-400 hover:border-accent/30'
                      }`}
                    >
                      <Leaf className="h-5 w-5 mb-1" />
                      <span className="text-sm font-black italic">{score}+</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Tags */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {FILTER_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                        filters.tags && filters.tags.split(',').includes(tag)
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white text-gray-500 border-gray-100 hover:border-primary/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </section>

              {/* Availability */}
              <section>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm font-bold text-gray-900 italic">In Stock Only</span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={filters.inStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </div>
                </label>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 grid grid-cols-2 gap-4 bg-white">
              <button
                onClick={handleClear}
                className="py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  applyFilters();
                  onClose();
                }}
                className="py-4 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all border-2 border-primary"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
