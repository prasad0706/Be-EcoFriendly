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
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Exclusive Offers</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Big Deals on <span className="text-primary italic">Better Choices</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto font-medium"
          >
            Save big while saving the planet. Explore our limited-time eco-friendly offers and special discounts.
          </motion.p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {deals.length > 0 ? (
            deals.map((deal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden shadow-2xl group"
              >
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 md:p-16 flex flex-col justify-end">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2 rounded-full shadow-lg">
                      <Tag className="h-4 w-4" />
                      <span className="text-sm font-black uppercase tracking-widest">{deal.discount}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Limited Time</span>
                    </div>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-6 italic tracking-tighter leading-none">
                    {deal.title}
                  </h3>
                  <p className="text-gray-200 font-medium mb-10 max-w-md text-lg leading-relaxed">
                    {deal.description}
                  </p>
                  
                  <Link to={deal.link || '/shop'}>
                    <Button variant="white" className="w-fit px-12 py-5 text-primary border-none hover:bg-accent hover:text-white font-black text-lg transition-all rounded-2xl flex items-center gap-3">
                      Shop This Deal
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 text-center">
                <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">No active deals right now</h3>
                <p className="text-gray-500 font-medium mt-2">Check back soon for more sustainable offers!</p>
            </div>
          )}
        </div>

        {/* Promo Section */}
        <section className="bg-primary rounded-[50px] p-12 md:p-24 relative overflow-hidden text-center text-white">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
              Get an Extra 10% Off Your First Order!
            </h2>
            <p className="text-xl text-white/80 font-medium mb-12">
              Join 10,000+ eco-conscious shoppers and get exclusive access to our biggest flash sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                    <Button className="bg-accent hover:bg-accent/90 border-none px-12 py-5 text-xl font-black rounded-2xl">
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
