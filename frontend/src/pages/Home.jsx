import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import ProductSlider from '../components/home/ProductSlider';
import DealsSection from '../components/home/DealsSection';
import NewsletterSection from '../components/home/NewsletterSection';
import { Sparkles, Truck, ShieldCheck, Package, Headphones, Leaf } from 'lucide-react';

const badges = [
  {
    icon: <Sparkles className="h-6 w-6 text-accent" />,
    title: "100% Verified",
    desc: "Sustainable standards"
  },
  {
    icon: <Truck className="h-6 w-6 text-primary" />,
    title: "Eco-Shipping",
    desc: "Carbon-neutral delivery"
  },
  {
    icon: <Package className="h-6 w-6 text-orange-500" />,
    title: "Plastic-Free",
    desc: "100% zero-waste boxes"
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
    title: "Secure Pay",
    desc: "SSL protected payment"
  },
  {
    icon: <Headphones className="h-6 w-6 text-primary" />,
    title: "Eco Experts",
    desc: "24/7 dedicated support"
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Dynamic Hero Section */}
      <HeroSection />

      {/* Sustainable Picks Slider */}
      <ProductSlider 
        title="🌱 Sustainable Picks" 
        queryParams={{ minEcoScore: 80 }} 
        link="/shop?minEcoScore=80"
      />

      {/* Dynamic Categories */}
      <CategorySection />

      {/* New Arrivals Slider */}
      <ProductSlider 
        title="🆕 New Arrivals" 
        queryParams={{ sort: 'newest' }} 
        link="/shop?sort=newest"
      />

      {/* Big Deals Section */}
      <DealsSection />

      {/* Trending Slider */}
      <ProductSlider 
        title="🔥 Trending Now" 
        queryParams={{ sort: 'rating' }} 
        link="/shop?sort=rating"
      />

      {/* Best Sellers Slider */}
      <ProductSlider 
        title="⭐ Best Sellers" 
        queryParams={{ featured: 'true' }} 
        link="/shop?featured=true"
      />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Trust Badges */}
      <section className="py-20 border-t border-gray-50 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
            {badges.map((badge, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-premium flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300 border border-gray-50">
                  {badge.icon}
                </div>
                <h4 className="font-black text-gray-900 mb-1">{badge.title}</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners/Certifications Trust Section */}
      <section className="py-16 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-gray-400">
               <ShieldCheck className="h-8 w-8" /> B-CORP
             </div>
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-gray-400">
               <Leaf className="h-8 w-8" /> ORGANIC
             </div>
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-gray-400">
               <Sparkles className="h-8 w-8" /> FAIR TRADE
             </div>
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-gray-400">
               <Package className="h-6 w-6" /> RECYCLED
             </div>
             <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-gray-400 text-sm">
               CO2 NEUTRAL
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
