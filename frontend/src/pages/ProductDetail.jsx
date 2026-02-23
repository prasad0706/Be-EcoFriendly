import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Heart, Star, Package, ArrowLeft, ChevronRight, Zap, Leaf, ShoppingBag, Plus, Minus, Share2, Cloud, Droplets, TreePine as Trees } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../utils/api';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import ProductImage from '../components/product/ProductImage';
import { formatCurrency } from '../utils/currency';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Reviews from '../components/product/Reviews';

// New Components
import DeliveryCheck from '../components/product/DeliveryCheck';
import ActiveOffers from '../components/product/ActiveOffers';
import PaymentOffers from '../components/product/PaymentOffers';
import SpecsAccordion from '../components/product/SpecsAccordion';
import InfoStrip from '../components/product/InfoStrip';
import ProductSlider from '../components/home/ProductSlider';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addToCartRef = useRef(null);

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

  // Sticky bar visibility logic
  useEffect(() => {
    const handleScroll = () => {
      if (addToCartRef.current) {
        const rect = addToCartRef.current.getBoundingClientRect();
        setShowStickyBar(rect.top < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error('Please login to add items to cart');
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  if (isLoading) return <Loading />;

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-8 font-medium">The product you are looking for might have been removed or is temporarily unavailable.</p>
          <Link to="/shop">
            <Button className="rounded-2xl px-10">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 md:pb-20 font-sans overflow-x-hidden">
      {/* Premium Sticky Add to Cart Bar - boAt Style Compact */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50 py-2.5 md:py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
          >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 md:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden border border-gray-50 shrink-0">
                  <img src={product.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:block">
                  <h4 className="font-black text-gray-900 text-[10px] md:text-sm truncate max-w-[120px] md:max-w-[200px] uppercase tracking-tight">{product.name}</h4>
                  <p className="text-primary font-black text-[10px] md:text-sm">{formatCurrency(product.price)}</p>
                </div>
              </div>
              
              <div className="flex-1 sm:flex-none flex items-center gap-2 md:gap-4 justify-end">
                <div className="flex items-center bg-gray-50 rounded-lg md:rounded-xl border border-gray-200 p-0.5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 md:w-10 h-7 md:h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Minus className="h-3 w-3" /></button>
                  <span className="w-5 md:w-8 text-center font-black text-[10px] md:text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-7 md:w-10 h-7 md:h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Plus className="h-3 w-3" /></button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-none px-6 md:px-12 py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-sm uppercase tracking-[0.1em] h-10 md:h-auto border-none shadow-xl shadow-primary/10"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sold Out' : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" /> Add To Cart
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-6 md:mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
          <ChevronRight className="h-2 w-2 md:h-3 md:w-3 shrink-0" />
          <Link to="/shop" className="hover:text-primary transition-colors shrink-0">Catalog</Link>
          <ChevronRight className="h-2 w-2 md:h-3 md:w-3 shrink-0" />
          <span className="text-gray-900 truncate max-w-[100px] md:max-w-[200px] shrink-0 font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-20">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 space-y-4 md:space-y-6 lg:sticky lg:top-32 self-start">
            <motion.div
              layoutId={`product-${product._id}`}
              className="aspect-square bg-gray-50/50 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-premium group relative border border-gray-100"
            >
              <ProductImage
                src={product.images?.[selectedImage]?.url || product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[1s]"
              />
              
              {discount > 0 && (
                <div className="absolute top-4 md:top-8 left-4 md:left-8 bg-red-500 text-white font-black text-[10px] md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-2xl shadow-xl z-20 uppercase tracking-widest italic animate-pulse">
                   Flash -{discount}%
                </div>
              )}
            </motion.div>

            {product.images?.length > 1 && (
              <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-14 md:w-24 h-14 md:h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all border-2 ${
                      selectedImage === index ? 'border-primary shadow-lg scale-105' : 'border-transparent opacity-40 hover:opacity-100 grayscale hover:grayscale-0'
                    }`}
                  >
                    <ProductImage src={image.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:col-span-5 space-y-6 md:space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-primary/5 text-primary text-[8px] md:text-[10px] font-black rounded md:rounded-lg uppercase tracking-widest border border-primary/10">
                  {product.category}
                </span>
                <div className="flex gap-2">
                   <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-primary transition-all shadow-sm"><Share2 className="h-4 w-4 md:h-5 md:w-5" /></button>
                   <button 
                    onClick={() => addToWishlist(product._id)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm ${
                      isInWishlist(product._id) ? 'bg-red-500 text-white' : 'bg-gray-50 text-gray-400 hover:text-red-500'
                    }`}
                   >
                     <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                   </button>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-5xl font-black text-gray-900 leading-tight md:leading-[1.1] tracking-tighter uppercase italic">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-yellow-400/5 px-2.5 py-1 rounded-lg gap-1.5 border border-yellow-400/10">
                  <Star className="h-3 w-3 md:h-3.5 md:w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-black text-[10px] md:text-sm text-yellow-700">{product.ratings?.average || 0}</span>
                  <span className="text-[9px] font-bold text-gray-300 ml-1">({product.ratings?.count || 0} Reviews)</span>
                </div>
                <div className="flex items-center gap-2 bg-accent/5 px-2.5 py-1 rounded-lg border border-accent/10">
                  <Zap className="h-3 w-3 md:h-3.5 md:w-3.5 text-accent fill-accent" />
                  <span className="text-[9px] font-black text-accent uppercase tracking-widest">Score {product.ecoScore}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4 pt-2 md:pt-4">
                <span className="text-3xl md:text-6xl font-black text-primary tracking-tighter italic">
                   {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl md:text-3xl font-bold text-gray-300 line-through decoration-red-400/20 decoration-2">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Eco Impact Highlights - Compact for boAt feel */}
              <div className="grid grid-cols-2 gap-2 md:gap-4 py-4 mt-2">
                 {[
                   { icon: Leaf, label: 'CO2 Saved', value: `${product.netSavings || 0}kg`, color: 'text-primary' },
                   { icon: Droplets, label: 'Water Saved', value: `${product.waterSaved || 0}L`, color: 'text-blue-500' },
                   { icon: Trees, label: 'Trees Offset', value: product.treesEquivalent || 0, color: 'text-accent' },
                   { icon: Cloud, label: 'Footprint', value: `${product.carbonFootprint || 0}kg`, color: 'text-gray-900' }
                 ].map((item, i) => (
                   <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center gap-3 group transition-all hover:bg-white hover:shadow-sm">
                     <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white shadow-sm flex items-center justify-center ${item.color} shrink-0`}>
                       <item.icon className="h-4 w-4 md:h-6 md:w-6" />
                     </div>
                     <div className="min-w-0">
                       <p className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] truncate">{item.label}</p>
                       <p className="text-[10px] md:text-base font-black text-gray-900 truncate tracking-tight">{item.value}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>

            <ActiveOffers productId={product._id} />

            {/* Buy Section */}
            <div ref={addToCartRef} className="space-y-6 pt-6 border-t border-gray-100">
               <div className="flex items-center gap-4">
                  <div className="flex-1">
                     <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quantity Selection</p>
                     <div className="flex items-center bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 p-1">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"><Minus className="h-4 w-4" /></button>
                        <span className="flex-1 text-center text-sm md:text-xl font-black">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"><Plus className="h-4 w-4" /></button>
                     </div>
                  </div>
                  <div className="flex-1">
                     <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Live Status</p>
                     <div className={`h-12 md:h-16 flex items-center justify-center rounded-xl md:rounded-2xl border font-black text-[10px] md:text-xs uppercase tracking-widest ${product.stock > 0 ? 'bg-green-50/50 text-green-500 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {product.stock > 0 ? 'Ready To Ship' : 'Out of Stock'}
                     </div>
                  </div>
               </div>

               <Button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-5 md:py-7 text-sm md:text-2xl font-black rounded-xl md:rounded-3xl shadow-xl shadow-primary/10 transition-all uppercase tracking-[0.2em] italic h-14 md:h-20 border-none"
              >
                {product.stock === 0 ? 'Notify Me' : (
                  <span className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 md:h-8 md:w-8" /> Add To Cart
                  </span>
                )}
              </Button>
            </div>

            <DeliveryCheck />
            <PaymentOffers />
            
            {/* Eco Impact Visual Feature */}
            <div className="bg-gray-50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-gray-100 relative overflow-hidden group shadow-inner">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                  <Leaf className="w-32 h-32 md:w-48 md:h-48 text-primary" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shrink-0">
                     <svg className="w-full h-full -rotate-90">
                        <circle cx="48" md:cx="64" cy="48" md:cy="64" r="44" md:r="60" fill="transparent" stroke="white" strokeWidth="8" />
                        <motion.circle 
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: product.ecoScore / 100 }}
                           transition={{ duration: 1.5 }}
                           cx="48" md:cx="64" cy="48" md:cy="64" r="44" md:r="60" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="376" strokeLinecap="round" className="text-secondary-blue"
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl md:text-4xl font-black text-gray-900">{product.ecoScore}</span>
                        <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Score</span>
                     </div>
                  </div>
                  <div className="text-center md:text-left">
                     <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter leading-none">Sustainability Verified.</h3>
                     <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-6 max-w-sm mx-auto md:mx-0">
                        Independently audited for environmental excellence.
                     </p>
                     <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {['Plastic Free', 'Carbon Neutral', 'Ethical Supply'].map(tag => (
                           <span key={tag} className="text-[7px] md:text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-white text-gray-500 rounded-full border border-gray-200">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Description Short */}
            <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
               <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Engineer's Note</h3>
               <p className="text-[11px] md:text-sm text-gray-600 font-medium leading-[1.8] italic">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Info Strip */}
        <InfoStrip />

        {/* Specifications Accordion */}
        <div className="max-w-5xl mx-auto py-10 md:py-20">
           <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter">Technical <span className="text-primary italic">Specifications.</span></h2>
              <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
           </div>
           <SpecsAccordion specifications={product.specifications} ecoScore={product.ecoScore} />
        </div>

        {/* Related Products Slider */}
        <div className="pt-8 md:pt-16">
            <ProductSlider 
              title="You May Also Like" 
              queryParams={{ category: product.category, exclude: product._id }} 
              link={`/shop?category=${product.category}`}
            />
        </div>

        {/* Reviews Section */}
        <div className="pt-10 md:pt-20">
          <Reviews product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
