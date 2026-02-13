import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X, 
  Leaf, 
  Search, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { useDebounce } from '../../utils/hooks';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const searchRef = useRef(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const { wishlist } = useWishlist();

  const { data: homeData } = useQuery({
    queryKey: ['homeData'],
    queryFn: async () => {
      const response = await api.get('/home');
      return response.data.data;
    }
  });

  const categories = homeData?.categories || [];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (debouncedSearch.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);

  const fetchSuggestions = async () => {
    try {
      const response = await api.get('/products', { 
        params: { search: debouncedSearch, limit: 5 } 
      });
      setSuggestions(response.data.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 transition-all duration-500 font-sans py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div className={`flex justify-between items-center p-1.5 rounded-full border transition-all duration-500 ${
          scrolled 
            ? 'bg-white/40 backdrop-blur-xl border-white/30 shadow-premium' 
            : 'bg-white/90 backdrop-blur-md border-white/20 shadow-lg'
        }`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group pl-2">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }}>
              <Leaf className={`h-8 w-8 ${scrolled ? 'text-primary' : 'text-primary'}`} />
            </motion.div>
            <span className={`text-2xl font-black tracking-tighter ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              Be-Eco<span className="text-accent">Friendly</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="relative group px-4">
              <button className="flex items-center gap-1 font-bold text-gray-700 hover:text-accent py-2 transition-colors">
                Categories <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-premium border border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-4 z-50">
                {categories.map((cat, i) => (
                  <Link 
                    key={i} 
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="block px-6 py-2.5 hover:bg-soft-green text-gray-600 hover:text-primary font-semibold transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link to="/shop" className="px-4 py-2 font-bold text-gray-700 hover:text-accent transition-colors">Shop</Link>
            <Link to="/shop?sort=newest" className="px-4 py-2 font-bold text-gray-700 hover:text-accent transition-colors">New Arrivals</Link>
            <Link to="/shop?featured=true" className="px-4 py-2 font-bold text-gray-700 hover:text-accent transition-colors">Best Sellers</Link>
            <Link to="/deals" className="px-4 py-2 font-bold text-accent hover:text-primary transition-colors">Deals</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 pr-1">
            {/* Search Bar */}
            <div className="relative hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Search eco gifts..."
                  className="pl-12 pr-6 py-2.5 bg-background rounded-full border border-transparent focus:border-accent focus:bg-white w-48 lg:w-64 transition-all duration-300 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                
                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-premium border border-gray-50 overflow-hidden py-2"
                    >
                      {suggestions.map((p) => (
                        <Link 
                          key={p._id}
                          to={`/product/${p._id}`}
                          className="flex items-center gap-4 px-4 py-2 hover:bg-background transition-colors"
                          onClick={() => setSuggestions([])}
                        >
                          <img src={p.images?.[0]?.url} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-accent font-bold">${p.price}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            <div className="h-4 w-px bg-gray-200 mx-2 hidden md:block" />

            <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-accent rounded-full transition-colors group">
              <Heart className="h-6 w-6 group-hover:fill-accent transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-accent rounded-full transition-colors group">
              <ShoppingBag className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <div className="relative group px-1">
              <button 
                onClick={() => !isAuthenticated && navigate('/login')}
                className="p-2 text-gray-600 hover:text-accent rounded-full transition-colors flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-soft-green flex items-center justify-center overflow-hidden border border-accent/20">
                  {isAuthenticated ? (
                    <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.name} alt="" />
                  ) : (
                    <User className="h-5 w-5 text-accent" />
                  )}
                </div>
              </button>
              
              {isAuthenticated && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-premium border border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-3 z-50">
                  <div className="px-5 py-2 mb-2 border-b border-gray-50">
                    <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-5 py-2.5 hover:bg-background text-gray-600 font-bold transition-colors">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-3 px-5 py-2.5 hover:bg-background text-primary font-bold transition-colors">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-red-50 text-red-500 font-bold transition-colors text-left">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>

            <button 
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-white z-[60] lg:hidden"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-12">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2">
                  <Leaf className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-black tracking-tighter text-gray-900">
                    Be-Eco<span className="text-accent">Friendly</span>
                  </span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-background rounded-full">
                  <X className="h-7 w-7 text-gray-900" />
                </button>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto">
                <div className="pb-6 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Links</h3>
                  <Link to="/shop" className="block text-2xl font-black text-gray-900 mb-4" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
                  <Link to="/deals" className="block text-2xl font-black text-accent mb-4" onClick={() => setMobileMenuOpen(false)}>Hot Deals 🔥</Link>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat, i) => (
                      <Link 
                        key={i} 
                        to={`/shop?category=${encodeURIComponent(cat)}`}
                        className="bg-background px-4 py-3 rounded-xl font-bold text-gray-700 text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-auto border-top border-gray-100">
                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                      className="py-4 rounded-2xl bg-background font-bold text-gray-900"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                      className="py-4 rounded-2xl bg-primary text-white font-bold"
                    >
                      Join Us
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={logout}
                    className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" /> Sign Out
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
