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
  ChevronRight,
  LogOut, 
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Users,
  ArrowRight,
  MapPin,
  Newspaper,
  Gift,
  Zap,
  TrendingUp
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
      setScrolled(window.scrollY > 10);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 font-sans pointer-events-none ${scrolled ? 'py-1 md:py-3' : 'py-2 md:py-6'}`}>
      <div className="max-w-[1400px] mx-auto px-3 md:px-10 pointer-events-auto">
        <div className={`flex items-center p-1 md:p-2 rounded-[1.5rem] md:rounded-full border transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-white/40 shadow-premium' 
            : 'bg-white/95 backdrop-blur-md border-white/20 shadow-lg'
        }`}>
          
          {/* Mobile: Hamburger (Left) */}
          <div className="lg:hidden flex-1 flex items-center pl-2">
            <button 
              className="p-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Logo (Left on Desktop, Center on Mobile) */}
          <Link to="/" className={`flex items-center space-x-2 md:space-x-3 group ${scrolled ? 'lg:pl-4' : 'lg:pl-6'} lg:flex-none flex-1 justify-center lg:justify-start`}>
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }} className="shrink-0 hidden md:block">
              <Leaf className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </motion.div>
            <span className={`text-xl md:text-3xl font-black tracking-tighter whitespace-nowrap text-gray-900 uppercase`}>
              Be-<span className="text-primary italic">EcoFriendly</span>
            </span>
          </Link>

          {/* Desktop Links (Center) */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-6 xl:space-x-10">
            <div className="relative group px-1">
              <button className="flex items-center gap-1 font-black text-gray-700 hover:text-primary py-2 transition-colors text-[11px] md:text-[12px] uppercase tracking-widest">
                Explore <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl shadow-premium border border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-6 z-50 overflow-hidden">
                <div className="grid grid-cols-1 gap-1">
                   {categories.map((cat, i) => (
                    <Link 
                      key={i} 
                      to={`/shop?category=${encodeURIComponent(cat)}`}
                      className="block px-10 py-2.5 hover:bg-gray-50 text-gray-400 hover:text-primary font-black transition-colors text-[10px] md:text-[11px] uppercase tracking-[0.2em] border-l-4 border-transparent hover:border-primary shrink-0 whitespace-nowrap"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link to="/shop" className="px-1 py-2 font-black text-gray-700 hover:text-primary transition-colors text-[11px] md:text-[12px] uppercase tracking-widest leading-none">Shop All</Link>
            <Link to="/deals" className="px-1 py-2 font-black text-accent hover:text-primary transition-colors text-[11px] md:text-[12px] uppercase tracking-widest leading-none flex items-center gap-1.5">
               Daily Deals <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            </Link>
            
            <div className="relative group px-1">
              <button className="flex items-center gap-1 font-black text-gray-700 hover:text-primary py-2 transition-colors text-[11px] md:text-[12px] uppercase tracking-widest">
                More <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-[2.5rem] shadow-premium border border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-8 z-50 overflow-hidden">
                <div className="grid grid-cols-2 gap-x-2 px-4">
                  {[
                    { name: 'New Arrivals', path: '/shop?sort=newest', icon: Zap, color: 'text-orange-500' },
                    { name: 'Best Sellers', path: '/shop?topRated=true', icon: TrendingUp, color: 'text-primary' },
                    { name: 'Refer & Earn', path: '/refer-and-earn', icon: Gift, color: 'text-accent' },
                    { name: 'Impact Blogs', path: '/blogs', icon: Newspaper, color: 'text-blue-500' },
                    { name: 'Store Finder', path: '/store-locator', icon: MapPin, color: 'text-red-500' },
                    { name: 'Sustainability', path: '/sustainability', icon: Leaf, color: 'text-emerald-500' },
                    { name: 'Collective', path: '/community', icon: Users, color: 'text-indigo-500' },
                    { name: 'Our Mission', path: '/mission', icon: Sparkles, color: 'text-yellow-500' },
                    { name: 'Careers', path: '/careers', icon: ShoppingBag, color: 'text-amber-600' },
                    { name: 'About Us', path: '/about', icon: Leaf, color: 'text-primary' },
                  ].map((item, i) => (
                    <Link 
                      key={i} 
                      to={item.path}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-400 hover:text-gray-900 font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all rounded-2xl group/item"
                    >
                      <item.icon className={`h-4 w-4 ${item.color} group-hover/item:scale-110 transition-transform`} />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Icons (Desktop & Mobile) */}
          <div className="flex-1 lg:flex-none flex items-center justify-end space-x-0.5 sm:space-x-1 md:space-x-3 pr-2 md:pr-6 gap-0.5 md:gap-0">
            {/* Search Bar - Desktop */}
            <div className="relative hidden lg:block" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Find sustainable goods..."
                  className="pl-10 pr-4 py-2 bg-gray-50 rounded-full border border-transparent focus:border-primary/20 focus:bg-white w-32 xl:w-48 lg:w-40 transition-all duration-500 font-extrabold text-[11px] md:text-[12px] tracking-widest placeholder:text-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </form>
            </div>

            <Search 
               className="lg:hidden h-5 w-5 text-gray-700 cursor-pointer hover:text-primary transition-colors p-0.5" 
               onClick={() => {
                 setSearchOpen(true);
                 setMobileMenuOpen(false);
               }}
            />

            <Link to="/wishlist" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-primary rounded-full transition-colors group">
              <Heart className={`h-5 w-5 md:h-5.5 md:w-5.5 ${wishlist.length > 0 ? 'fill-accent text-accent' : ''} transition-all`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-white text-[7px] md:text-[8px] font-black h-3.5 w-3.5 md:h-4 md:w-4 flex items-center justify-center rounded-full border border-white shadow-sm animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-primary rounded-full transition-colors group">
              <ShoppingBag className="h-5 w-5 md:h-5.5 md:w-5.5 transition-transform group-hover:scale-110" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[7px] md:text-[8px] font-black h-3.5 w-3.5 md:h-4 md:w-4 flex items-center justify-center rounded-full border border-white shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <div className="relative group lg:block">
              <button 
                onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
                className="p-1 sm:p-2 text-gray-700 hover:text-primary rounded-full transition-colors shrink-0"
              >
                <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full ${isAuthenticated ? 'bg-soft-green' : 'bg-gray-100'} flex items-center justify-center overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105`}>
                  {isAuthenticated ? (
                    <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.name} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </div>
              </button>
              
              {isAuthenticated && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-premium border border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50 overflow-hidden">
                  <div className="px-6 py-2 border-b border-gray-50 mb-2">
                    <p className="text-[11px] font-black text-gray-900 truncate uppercase tracking-widest leading-tight">{user.name}</p>
                    <p className="text-[9px] font-bold text-gray-400 truncate uppercase tracking-widest">{user.role}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-6 py-2.5 hover:bg-gray-50 text-gray-700 font-bold text-[11px] uppercase tracking-widest transition-colors mb-0.5">
                    <User className="h-3.5 w-3.5 text-primary" /> Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-3 px-6 py-2.5 hover:bg-gray-50 text-gray-700 font-bold text-[11px] uppercase tracking-widest transition-colors mb-0.5">
                      <LayoutDashboard className="h-3.5 w-3.5 text-accent" /> Dashboard
                    </Link>
                  )}
                  <div className="my-1.5 border-t border-gray-50" />
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-6 py-2.5 hover:bg-red-50 text-red-500 font-bold text-[11px] uppercase tracking-widest transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Search Bar Inline */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 px-4 pt-2 lg:hidden pointer-events-auto"
          >
            <div className="bg-white rounded-2xl shadow-premium p-1.5 border border-gray-100 flex items-center">
              <form onSubmit={handleSearch} className="flex-1 flex items-center">
                 <input 
                   autoFocus
                   type="text" 
                   className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-black tracking-widest text-gray-900 placeholder:text-gray-300 px-4 h-12"
                   placeholder="Search products..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <button type="submit" className="p-3 bg-primary text-white rounded-xl shadow-lg">
                   <Search className="h-5 w-5" />
                 </button>
              </form>
              <button 
                onClick={() => setSearchOpen(false)}
                className="p-4 text-gray-400 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {suggestions.length > 0 && (
              <div className="bg-white mt-2 rounded-2xl shadow-premium border border-gray-100 overflow-hidden py-2 max-h-[60vh] overflow-y-auto">
                 {suggestions.map((p) => (
                    <Link 
                      key={p._id}
                      to={`/product/${p._id}`}
                      className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-none"
                      onClick={() => {
                        setSuggestions([]);
                        setSearchOpen(false);
                      }}
                    >
                      <img src={p.images?.[0]?.url} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                      <div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{p.name}</p>
                        <p className="text-xs text-primary font-black mt-0.5">FROM ${p.price}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      </nav>
      
      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setMobileMenuOpen(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[9999] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <Link to="/" className="flex items-center space-x-2">
                  <Leaf className="h-7 w-7 text-primary" />
                  <span className="text-xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
                    Be-<span className="text-primary italic">EcoFriendly</span>
                  </span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div>
                   <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6 px-2">Marketplace</h3>
                   <div className="space-y-1">
                      {[
                        { name: 'Latest Arrivals', path: '/shop?sort=newest', icon: Zap, color: 'text-orange-500' },
                        { name: 'Best Sellers', path: '/shop?topRated=true', icon: TrendingUp, color: 'text-primary' },
                        { name: 'All Products', path: '/shop', icon: ShoppingBag },
                        { name: 'Daily Deals', path: '/deals', icon: Sparkles, color: 'text-accent' }
                      ].map((item, i) => (
                        <Link 
                          key={i} 
                          to={item.path}
                          className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all group"
                        >
                          <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white shadow-sm transition-all ${item.color || 'text-primary'}`}>
                             <item.icon className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-sm font-black text-gray-700 uppercase tracking-widest leading-none">{item.name}</span>
                        </Link>
                      ))}
                   </div>
                </div>

                <div>
                   <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6 px-2">The Ecosystem</h3>
                   <div className="space-y-1">
                      {[
                        { name: 'Impact Collective', path: '/community', icon: Users, color: 'text-indigo-500' },
                        { name: 'Refer & Earn', path: '/refer-and-earn', icon: Gift, color: 'text-accent' },
                        { name: 'Sustainability', path: '/sustainability', icon: Leaf, color: 'text-emerald-500' }
                      ].map((item, i) => (
                        <Link 
                          key={i} 
                          to={item.path}
                          className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all group"
                        >
                          <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white shadow-sm transition-all ${item.color || 'text-primary'}`}>
                             <item.icon className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-sm font-black text-gray-700 uppercase tracking-widest leading-none">{item.name}</span>
                        </Link>
                      ))}
                   </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6 px-2">Store & Media</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Blogs', path: '/blogs', icon: Newspaper },
                      { name: 'Stores', path: '/store-locator', icon: MapPin },
                      { name: 'Mission', path: '/mission', icon: Sparkles },
                      { name: 'Careers', path: '/careers', icon: ShoppingBag }
                    ].map((item, i) => (
                      <Link 
                        key={i} 
                        to={item.path}
                        className="px-4 py-4 bg-gray-50/50 rounded-2xl text-[10px] font-black text-gray-900 uppercase tracking-widest text-center hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all flex flex-col items-center gap-2 group"
                      >
                        <item.icon className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 mt-auto border-t border-gray-50 bg-gray-50/20">
                {!isAuthenticated ? (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full py-5 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                  >
                    Authenticate <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    {isAdmin && (
                      <Link to="/admin" className="w-full py-4.5 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm">
                        <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="flex gap-2">
                      <Link to="/profile" className="flex-1 py-4.5 rounded-2xl bg-white border border-gray-100 text-gray-900 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm">
                        <User className="h-4 w-4 text-primary" /> Profile
                      </Link>
                      <button 
                        onClick={logout}
                        className="px-6 rounded-2xl bg-red-50 text-red-500 font-black flex items-center justify-center border border-red-100"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
