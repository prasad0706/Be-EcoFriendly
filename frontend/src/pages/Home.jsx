import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import ProductSlider from '../components/home/ProductSlider';
import DealsSection from '../components/home/DealsSection';
import NewsletterSection from '../components/home/NewsletterSection';
import { Sparkles, Truck, ShieldCheck, Package, Headphones, Leaf } from 'lucide-react';

const badges = [
  {
    icon: <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-accent" />,
    title: "100% Verified",
    desc: "Premium Ethics"
  },
  {
    icon: <Truck className="h-5 w-5 md:h-6 md:w-6 text-primary" />,
    title: "Eco-Shipping",
    desc: "CO2 Neutral"
  },
  {
    icon: <Package className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />,
    title: "Plastic-Free",
    desc: "Zero Waste"
  },
  {
    icon: <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-green-600" />,
    title: "Secure Pay",
    desc: "SSL Protected"
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Sustainable Picks */}
      <ProductSlider 
        title="Impact Picks" 
        queryParams={{ minEcoScore: 80 }} 
        link="/shop?minEcoScore=80"
      />

      {/* Categories */}
      <CategorySection />

      {/* New Arrivals */}
      <ProductSlider 
        title="Just Dropped" 
        queryParams={{ sort: 'newest' }} 
        link="/shop?sort=newest"
      />

      {/* Deals Section */}
      <DealsSection />

      {/* Trending */}
      <ProductSlider 
        title="Trending" 
        queryParams={{ sort: 'rating' }} 
        link="/shop?sort=rating"
      />

      {/* Best Sellers */}
      <ProductSlider 
        title="Top Rated" 
        queryParams={{ featured: 'true' }} 
        link="/shop?featured=true"
      />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Trust Badges - Compact boAt Style */}
      <section className="py-10 md:py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {badges.map((badge, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 transition-transform hover:scale-105">
                  {badge.icon}
                </div>
                <h4 className="font-black text-xs md:text-sm text-gray-900 mb-1 uppercase tracking-tight">{badge.title}</h4>
                <p className="text-[9px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners - Subtle Trust */}
      <section className="py-12 bg-white flex justify-center items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex flex-wrap justify-center gap-8 md:gap-20 px-4">
             <div className="flex items-center gap-1 font-black text-sm md:text-xl tracking-widest italic text-gray-400">
               <ShieldCheck className="h-4 w-4 md:h-6 md:w-6" /> CERTIFIED
             </div>
             <div className="flex items-center gap-1 font-black text-sm md:text-xl tracking-widest italic text-gray-400">
               <Leaf className="h-4 w-4 md:h-6 md:w-6" /> ORGANIC
             </div>
             <div className="flex items-center gap-1 font-black text-sm md:text-xl tracking-widest italic text-gray-400">
               <Sparkles className="h-4 w-4 md:h-6 md:w-6" /> FAIR-TRADE
             </div>
             <div className="flex items-center gap-1 font-black text-sm md:text-xl tracking-widest italic text-gray-400">
               <Package className="h-4 w-4 md:h-6 md:w-6" /> RECYCLED
             </div>
          </div>
      </section>
    </div>
  );
};

export default Home;
