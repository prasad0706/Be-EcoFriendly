import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tag, Sparkles, ShoppingBag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const Deals = () => {
  const { data: homeData, isLoading } = useQuery({
    queryKey: ['homeData'],
    queryFn: async () => {
      const response = await api.get('/home');
      return response.data.data;
    }
  });

  const deals = homeData?.deals || [];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-accent/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-6 border border-accent/10"
          >
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
            <span className="text-[10px] md:text-xs font-black text-accent uppercase tracking-widest">Exclusive Offers</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter italic leading-tight"
          >
            Big Deals on <span className="text-primary italic">Better Choices.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed px-4"
          >
            Save big while saving the planet. Explore our limited-time eco-friendly offers and special discounts.
          </motion.p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-20">
          {deals.length > 0 ? (
            deals.map((deal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative h-[350px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-premium group border border-gray-100"
              >
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 md:p-12 lg:p-16 flex flex-col justify-end">
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="inline-flex items-center gap-2 bg-accent text-white px-4 md:px-5 py-1.5 md:py-2 rounded-xl shadow-glow-accent">
                      <Tag className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span className="text-[10px] md:text-sm font-black uppercase tracking-widest">{deal.discount} OFF</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 md:px-5 py-1.5 md:py-2 rounded-xl border border-white/20">
                      <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">Limited Time</span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 italic tracking-tighter leading-[1.1] drop-shadow-lg">
                    {deal.title}
                  </h3>
                  <p className="text-sm md:text-lg text-gray-200 font-medium mb-8 md:mb-10 max-w-md leading-relaxed opacity-90 line-clamp-2 sm:line-clamp-none">
                    {deal.description}
                  </p>
                  
                  <Link to={deal.link || '/shop'} className="w-full sm:w-fit">
                    <Button variant="white" className="w-full sm:w-fit px-10 py-4.5 md:px-12 md:py-5 text-primary border-none hover:bg-accent hover:text-white font-black text-xs md:text-lg transition-all rounded-xl md:rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest shadow-2xl h-14 md:h-auto">
                      Shop Deal
                      <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 md:py-32 bg-gray-50/50 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
                <Tag className="h-10 w-10 md:h-12 md:w-12 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Access Restricted: No Active Deals</h3>
                <p className="text-sm md:text-base text-gray-500 font-medium mt-2 uppercase tracking-widest opacity-50 px-4">Check back soon for more sustainable offers!</p>
            </div>
          )}
        </div>

        {/* Promo Section */}
        <section className="bg-primary rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 relative overflow-hidden text-center text-white shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10 hidden md:block">
            <Sparkles className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 leading-tight tracking-tighter italic">
              Unlock <span className="text-accent">10% Off</span> Your First Impact.
            </h2>
            <p className="text-sm md:text-xl text-white/80 font-medium mb-10 md:mb-12 px-2 leading-relaxed italic">
              Join 10,000+ eco-conscious shoppers and get exclusive access to our biggest daily deals and sustainability guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-accent hover:bg-white hover:text-primary transition-all border-none px-12 py-5 text-base md:text-xl font-black rounded-xl md:rounded-2xl shadow-glow-accent uppercase tracking-widest h-14 md:h-auto">
                        Claim My Discount
                    </Button>
                </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Deals;
