import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import ProductImage from './ProductImage';
import { formatCurrency } from '../../utils/currency';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error('Login required');
    await addToWishlist(product._id);
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-2 w-2 md:h-3 md:w-3 ${star <= (product.ratings?.average || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group bg-white rounded-xl md:rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm md:hover:shadow-glow transition-all duration-300 relative h-full flex flex-col"
    >
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        {/* Product Image Area */}
        <div className="relative aspect-square md:aspect-auto md:h-72 overflow-hidden bg-gray-50/50">
          <ProductImage
            src={product.images?.[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-105"
          />

          {/* Badges Overlay - Compact on mobile */}
          <div className="absolute top-2 left-2 md:top-5 md:left-5 flex flex-col gap-1 md:gap-2 z-10">
            {discount > 0 && (
              <span className="px-1.5 py-0.5 md:px-3 md:py-1.5 bg-red-500 text-white text-[7px] md:text-[10px] font-black uppercase tracking-widest rounded md:rounded-lg shadow-lg">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="px-1.5 py-0.5 md:px-3 md:py-1.5 bg-primary text-white text-[7px] md:text-[10px] font-black uppercase tracking-widest rounded md:rounded-lg shadow-lg flex items-center gap-0.5 md:gap-1">
                <Sparkles className="h-2 w-2 md:h-2.5 md:w-2.5" /> HOT
              </span>
            )}
            {product.ecoScore >= 70 && (
              <span className="px-1.5 py-0.5 md:px-3 md:py-1.5 bg-accent text-white text-[7px] md:text-[10px] font-black uppercase tracking-widest rounded md:rounded-lg shadow-lg flex items-center gap-0.5 md:gap-1">
                <Leaf className="h-2 w-2 md:h-2.5 md:w-2.5" /> {product.ecoScore}
              </span>
            )}
          </div>

          {/* Desktop Only Hover Actions */}
          <div className="absolute top-3 right-3 md:top-5 md:right-5 flex flex-col gap-2 z-10 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex">
             <button
                onClick={handleWishlist}
                className={`p-3 rounded-xl shadow-xl backdrop-blur-md transition-all ${isInWishlist(product._id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-900 hover:bg-red-50 hover:text-red-500'}`}
             >
                <Heart className={`h-4.5 w-4.5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
             </button>
             <div className="p-3 bg-white/90 backdrop-blur-md text-gray-900 rounded-xl shadow-xl hover:bg-gray-50 flex items-center justify-center">
                <Eye className="h-4.5 w-4.5" />
             </div>
          </div>
          
          {/* Mobile persistent wishlist button - Small & Clean */}
          <button
                onClick={handleWishlist}
                className={`md:hidden absolute top-2 right-2 p-1.5 rounded-lg shadow-sm backdrop-blur-md transition-all z-20 ${isInWishlist(product._id) ? 'text-red-500' : 'text-gray-400 bg-white/80'}`}
             >
                <Heart className={`h-3.5 w-3.5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
          </button>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="bg-gray-900 text-white px-3 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest shadow-2xl">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Information - Compact on mobile */}
        <div className="p-2.5 md:p-6 lg:p-7 flex-1 flex flex-col">
          <div className="mb-2 md:mb-4">
            <span className="text-[7px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 block truncate">
              {product.category}
            </span>
            <h3 className="text-[10px] sm:text-xs md:text-lg font-black text-gray-900 line-clamp-2 md:line-clamp-1 group-hover:text-primary transition-colors tracking-tight leading-tight md:leading-snug">
              {product.name}
            </h3>
            {/* Rating Section - Compact */}
            <div className="mt-1 md:mt-2 flex items-center gap-1">
              {renderStars()}
              <span className="text-[7px] md:text-[10px] font-bold text-gray-300 uppercase tracking-tighter">({product.ratings?.count || 0})</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-2 md:pt-4 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm md:text-2xl font-black text-primary tracking-tighter leading-none">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-[8px] md:text-sm font-bold text-gray-300 line-through decoration-red-400/10">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-14 md:h-14 bg-primary text-white rounded-lg md:rounded-2xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
            >
              <ShoppingCart className="h-3.5 w-3.5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
