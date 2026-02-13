import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Heart, Star, Package, ArrowLeft, ChevronRight, Zap, Leaf, ShoppingBag, Plus, Minus, Share2 } from 'lucide-react';
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
    <div className="min-h-screen bg-white pt-28 pb-20 font-sans">
      {/* Premium Sticky Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
          >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6">
              <div className="hidden md:flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                  <img src={product.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm truncate max-w-[200px]">{product.name}</h4>
                  <p className="text-primary font-bold text-sm">{formatCurrency(product.price)}</p>
                </div>
              </div>
              
              <div className="flex-1 md:flex-none flex items-center gap-4">
                <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600"><Minus className="h-3 w-3" /></button>
                  <span className="w-8 text-center font-black text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-gray-600"><Plus className="h-3 w-3" /></button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 md:flex-none px-12 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-900 truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEFT: Image Gallery (Stick in desktop) */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-32 self-start">
            <motion.div
              layoutId={`product-${product._id}`}
              className="aspect-[4/5] md:aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-premium group relative"
            >
              <ProductImage
                src={product.images?.[selectedImage]?.url || product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
              />
              
              {discount > 0 && (
                <div className="absolute top-8 left-8 bg-accent text-white font-black px-4 py-2 rounded-2xl shadow-lg animate-bounce">
                  {discount}% OFF
                </div>
              )}
            </motion.div>

            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all border-2 mb-2 ${
                      selectedImage === index ? 'border-primary shadow-xl scale-105' : 'border-transparent opacity-60 hover:opacity-100 group'
                    }`}
                  >
                    <ProductImage src={image.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-mint text-primary text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {product.category}
                </span>
                <div className="flex gap-2">
                   <button className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:text-primary transition-all"><Share2 className="h-5 w-5" /></button>
                   <button 
                    onClick={() => addToWishlist(product._id)}
                    className={`p-2.5 rounded-full border transition-all ${
                      isInWishlist(product._id) ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-50 text-gray-400 border-transparent hover:text-red-500'
                    }`}
                   >
                     <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                   </button>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">{product.name}</h1>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-yellow-400/10 px-3 py-1 rounded-full gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-black text-sm text-yellow-700">{product.ratings?.average || 0}</span>
                  <span className="text-xs font-bold text-yellow-600/60 font-sans ml-1">({product.ratings?.count || 0})</span>
                </div>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-[10px] ${
                    product.ecoScore >= 80 ? 'border-accent text-accent bg-accent/5' : 
                    product.ecoScore >= 50 ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 
                    'border-orange-500 text-orange-600 bg-orange-50'
                  }`}>
                    {product.ecoScore}
                  </div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Eco-Score</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4 py-4">
                <span className="text-5xl font-black text-primary tracking-tighter">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-2xl font-bold text-gray-300 line-through decoration-red-400/40 decoration-2">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Active Offers Section */}
            <ActiveOffers productId={product._id} />

            {/* Buy Section */}
            <div ref={addToCartRef} className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Quantity</p>
                   <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-1">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-gray-900 font-bold hover:bg-white rounded-xl transition-all"><Minus className="h-4 w-4" /></button>
                      <span className="w-12 text-center text-lg font-black">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-12 h-12 flex items-center justify-center text-gray-900 font-bold hover:bg-white rounded-xl transition-all"><Plus className="h-4 w-4" /></button>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Availability</p>
                   {product.stock > 0 ? (
                      <span className="text-sm font-black text-green-500 bg-green-50 px-4 py-2 rounded-xl border border-green-100 inline-block">IN STOCK</span>
                   ) : (
                      <span className="text-sm font-black text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100 inline-block">OUT OF STOCK</span>
                   )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-6 text-xl font-black rounded-2xl shadow-premium hover:shadow-glow transition-all uppercase tracking-widest"
                >
                  <ShoppingCart className="h-6 w-6 mr-3" />
                  Add To Cart
                </Button>
              </div>
            </div>

            {/* Delivery Check Section */}
            <DeliveryCheck />

            {/* Payment & Reward Offers Accordion */}
            <PaymentOffers />
            
            {/* Eco Impact Visual Feature */}
            <div className="bg-soft-green/30 rounded-[2.5rem] p-8 border border-accent/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                  <Leaf className="w-20 h-20 text-accent" />
               </div>
               <div className="relative z-10 flex items-center gap-8">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                     <svg className="w-full h-full -rotate-90">
                        <circle 
                           cx="48" cy="48" r="44" 
                           fill="transparent" 
                           stroke="currentColor" 
                           strokeWidth="8" 
                           className="text-white shadow-inner"
                        />
                        <motion.circle 
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: product.ecoScore / 100 }}
                           transition={{ duration: 2, ease: "easeOut" }}
                           cx="48" cy="48" r="44" 
                           fill="transparent" 
                           stroke="currentColor" 
                           strokeWidth="8" 
                           strokeDasharray="276"
                           strokeLinecap="round"
                           className="text-accent"
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-gray-900">{product.ecoScore}</span>
                        <span className="text-[8px] font-black text-gray-400 uppercase">Score</span>
                     </div>
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-gray-900 mb-2">Sustainability Verified.</h3>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4 max-w-[200px]">
                        This product is verified for its environmental impact and sustainable manufacturing.
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {['Plastic Free', 'Carbon Neutral', 'Ethical'].map(tag => (
                           <span key={tag} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white rounded-full text-accent border border-accent/20">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Carbon Footprint & LCA Breakdown */}
               <div className="mt-8 pt-8 border-t border-accent/10 space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Carbon Footprint</p>
                        <div className="flex items-baseline gap-1">
                           <p className="text-2xl font-black text-gray-900">{product.carbonFootprint || '1.2'}</p>
                           <p className="text-xs font-bold text-gray-400">kg CO2e</p>
                        </div>
                     </div>
                     <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">LCA Verification</p>
                        <p className="text-sm font-black text-accent flex items-center gap-1">
                           <Zap className="w-4 h-4 fill-current" /> Verified
                        </p>
                     </div>
                  </div>

                  <div>
                     <div className="flex justify-between items-end mb-3">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Life Cycle Assessment (LCA)</p>
                        <span className="text-[10px] font-black text-accent uppercase tracking-widest">Impact Breakdown</span>
                     </div>
                     <div className="h-4 w-full bg-white/50 rounded-full overflow-hidden flex shadow-inner">
                        <div className="h-full bg-primary" style={{ width: `${product.lca?.rawMaterials || 20}%` }} title="Raw Materials" />
                        <div className="h-full bg-accent" style={{ width: `${product.lca?.manufacturing || 25}%` }} title="Manufacturing" />
                        <div className="h-full bg-teal-400" style={{ width: `${product.lca?.transportation || 30}%` }} title="Transportation" />
                        <div className="h-full bg-yellow-400" style={{ width: `${product.lca?.usage || 5}%` }} title="Usage" />
                        <div className="h-full bg-gray-400" style={{ width: `${product.lca?.disposal || 20}%` }} title="Disposal" />
                     </div>
                     <div className="grid grid-cols-5 mt-4">
                        {[
                           { label: 'Materials', color: 'bg-primary' },
                           { label: 'Mfg', color: 'bg-accent' },
                           { label: 'Transport', color: 'bg-teal-400' },
                           { label: 'Usage', color: 'bg-yellow-400' },
                           { label: 'End Life', color: 'bg-gray-400' }
                        ].map(item => (
                           <div key={item.label} className="text-center">
                              <div className={`w-2 h-2 rounded-full ${item.color} mx-auto mb-1`} />
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{item.label}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Description Short */}
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
               <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-3">Product Summary</h3>
               <p className="text-sm text-gray-600 font-medium leading-[1.6] leading-relaxed line-clamp-3">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Info Strip: Warranty / replacement */}
        <InfoStrip />

        {/* Specifications Accordion */}
        <div className="max-w-5xl mx-auto py-12">
           <h2 className="text-3xl font-black text-gray-900 text-center mb-12 italic tracking-tighter">Detailed <span className="text-primary italic">Specifications</span></h2>
           <SpecsAccordion specifications={product.specifications} ecoScore={product.ecoScore} />
        </div>

        {/* Description Detailed */}
        <div className="py-20 max-w-4xl mx-auto text-center">
           <div className="w-16 h-1 w-24 bg-primary/20 mx-auto mb-10 rounded-full" />
           <h3 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">The <span className="text-accent italic">Eco-Friendly</span> Choice</h3>
           <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
             {product.description}
           </p>
        </div>

        {/* Related Products Slider */}
        <div className="pt-12">
            <ProductSlider 
              title="Related Products" 
              queryParams={{ category: product.category, exclude: product._id }} 
              link={`/shop?category=${product.category}`}
            />
        </div>

        {/* Reviews Section */}
        <div className="pt-12">
          <Reviews product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
