import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Heart, Menu, X, Leaf, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              <Leaf className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold text-gray-900">
              Be-Eco<span className="text-primary font-black">Friendly</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold transition-colors duration-300 relative group ${location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="h-6 w-6 text-gray-600" />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1 pl-3 bg-gray-50 border border-gray-100 rounded-full hover:bg-white transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-700 hidden lg:block mr-1">{user?.name?.split(' ')[0]}</span>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <User className="h-4 w-4" />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 overflow-hidden"
                    >
                      <div className="px-5 py-3 border-b border-gray-50 mb-2">
                        <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-5 py-3 hover:bg-gray-50 transition-colors text-gray-600 font-semibold"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-5 py-3 hover:bg-gray-50 transition-colors text-primary font-semibold"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-gray-50 transition-colors text-red-500 font-semibold text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="border-none hover:bg-gray-100"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden mx-4 mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 text-lg font-bold transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-gray-600'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-50 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="block font-bold text-gray-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left font-bold text-red-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                      Login
                    </Button>
                    <Button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
                      Sign Up
                    </Button>
                  </div>
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
