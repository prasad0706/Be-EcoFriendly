import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [removingItemId, setRemovingItemId] = useState(null);

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingItemId(productId);
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setRemovingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto"
          >
            <div className="w-20 md:w-24 h-20 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-sm">
              <Heart className="h-10 w-10 text-gray-200" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">Your wishlist is empty</h1>
            <p className="text-sm md:text-base text-gray-500 mb-8 md:mb-10 font-medium">Save your favorite eco-friendly items here to keep track of them.</p>
            <Link to="/shop">
              <Button className="px-10 py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm">Explore Products</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4 text-center md:text-left">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
            <p className="text-sm md:text-base text-gray-500 font-medium mt-1">You have {wishlist.length} saved items</p>
          </div>
          <Link to="/shop" className="hidden md:block">
            <Button variant="outline" size="sm" className="rounded-xl px-6 h-12 border-2 border-primary/20 text-primary font-black uppercase tracking-widest text-xs">
              Add More Items
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-10 shadow-premium border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence>
              {wishlist.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative group"
                >
                  <ProductCard product={product} />

                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    disabled={removingItemId === product._id}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-md border border-gray-100 text-gray-400 hover:text-red-500 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                  >
                    {removingItemId === product._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Link to="/shop" className="md:hidden mt-8 block">
            <Button variant="outline" className="w-full h-14 rounded-xl border-2 border-primary/20 text-primary font-black uppercase tracking-widest text-xs">
              Add More Items
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
