import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Heart, Star, Package, Truck, Shield, ArrowLeft, ChevronRight, Zap, Leaf, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../utils/api';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import ProductImage from '../components/product/ProductImage';
import { formatCurrency } from '../utils/currency';
import { motion, AnimatePresence } from 'framer-motion';
import Reviews from '../components/product/Reviews';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const product = data?.data;

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error('Please login to add items to cart');
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= (product?.ratings?.average || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) return <Loading />;

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-sm"
            >
              <ProductImage
                src={product.images?.[selectedImage]?.url || product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all border-2 ${selectedImage === index ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <ProductImage
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-mint text-primary text-xs font-bold rounded-lg mb-4 uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-6">
                {renderStars()}
                <span className="text-sm font-semibold text-gray-400">
                  ({product.ratings?.count || 0} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl font-medium text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="bg-red-50 text-red-600 text-sm font-bold px-2 py-1 rounded-lg">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="mb-8 overflow-hidden">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Description</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-4 mb-10">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-bold text-gray-700">
                  {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Eco Score Dashboard */}
              <div className="bg-background/50 rounded-3xl p-6 border border-accent/10 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-accent" />
                    <h3 className="font-bold text-gray-900">Eco-Impact Score</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${product.ecoScore > 70 ? 'text-accent' : 'text-orange-500'}`}>
                      {product.ecoScore || 0}
                    </span>
                    <span className="text-xs font-bold text-gray-400">/ 100</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${product.ecoScore}%` }}
                    className={`h-full rounded-full ${
                      product.ecoScore > 70 ? 'bg-accent' : product.ecoScore > 40 ? 'bg-orange-400' : 'bg-red-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-gray-50">
                    <div className="flex items-center gap-2 text-accent mb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Benefits</span>
                    </div>
                    <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                      <li>• Biodegradable</li>
                      <li>• Zero Plastic</li>
                      <li>• Ethically Made</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-50">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Risks Avoided</span>
                    </div>
                    <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                      <li>• No Microplastics</li>
                      <li>• Low Carbon Footprint</li>
                      <li>• Safe Passions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-8">
              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-100 rounded-l-2xl transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  > - </button>
                  <span className="text-lg font-bold text-gray-900 w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-100 rounded-r-2xl transition-colors"
                    disabled={quantity >= product.stock}
                  > + </button>
                </div>

                <button
                  onClick={() => addToWishlist(product._id)}
                  className={`p-3 rounded-2xl border transition-all ${isInWishlist(product._id)
                    ? 'bg-red-50 border-red-100 text-red-500'
                    : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50'
                    }`}
                >
                  <Heart className={`h-6 w-6 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-5 text-lg font-bold"
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-gray-100">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-gray-900 uppercase">Eco Delivery</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-gray-900 uppercase">Secure Pay</p>
                </div>
                <div className="text-center">
                  <Recycle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-gray-900 uppercase">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reviews product={product} />
      </div>
    </div>
  );
};

// Placeholder for Recycle icon since it was used in Guarantees
const Recycle = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 11V7a5 5 0 0 1 5-5c1.4 0 2.7.6 3.5 1.5L19 7v4" />
    <path d="M21 12v4a5 5 0 0 1-5 5c-1.4 0-2.7-.6-3.5-1.5L9 17v-4" />
    <path d="M11 11H7a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4" />
    <path d="M13 13h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4" />
  </svg>
);

export default ProductDetail;
