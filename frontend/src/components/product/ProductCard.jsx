import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye, Leaf } from 'lucide-react';
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
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= (product.ratings?.average || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-gray-50">
          <ProductImage
            src={product.images?.[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-md">
                {discount}% OFF
              </span>
            )}
            {product.featured && (
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-md">
                Featured
              </span>
            )}
            {product.ecoScore > 80 && (
              <span className="px-3 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1">
                <Leaf className="h-3 w-3" /> {product.ecoScore} Eco
              </span>
            )}
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 backdrop-blur-[2px]">
            <button
              onClick={async (e) => {
                e.preventDefault();
                if (!isAuthenticated) return toast.error('Login required');
                await addToWishlist(product._id);
              }}
              className={`p-3 rounded-xl shadow-lg transition-all ${isInWishlist(product._id) ? 'bg-red-500 text-white' : 'bg-white text-gray-900 hover:bg-red-50'}`}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
            </button>

            <div className="p-3 bg-white text-gray-900 rounded-xl shadow-lg hover:bg-gray-50">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          {/* Out of Stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              {product.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="mt-1.5 flex items-center space-x-2">
              {renderStars()}
              <span className="text-[10px] font-bold text-gray-400">({product.ratings?.count || 0})</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm font-medium text-gray-300 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <button
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 hover:scale-105 transition-all shadow-md disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
