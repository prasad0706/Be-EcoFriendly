import { motion } from 'framer-motion';
import { Target, Leaf, Shield, Globe } from 'lucide-react';

const Mission = () => {
  return (
    <div className="min-h-screen bg-white pt-20 md:pt-28 pb-10 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-12 md:py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 mb-6 md:mb-10 tracking-tighter leading-tight"
          >
            Our <span className="text-primary italic">Mission.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed px-4">
            Changing the world, one conscious purchase at a time.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mt-12 md:mt-20 items-center">
           <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">Leaving the planet better than we found it.</h2>
              <div className="space-y-8 md:space-y-10">
                 {[
                   { title: 'Zero Waste', desc: 'Eliminating single-use plastics from our entire supply chain by 2026.', icon: Leaf },
                   { title: 'Ethical Production', desc: 'Ensuring every worker behind our products is treated with dignity.', icon: Shield },
                   { title: 'Global Impact', desc: 'Investing 5% of all profits into reforestation projects.', icon: Globe }
                 ].map((point, i) => (
                   <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-soft-green rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                         <point.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                      </div>
                      <div>
                         <h3 className="text-xl md:text-2xl font-black mb-2">{point.title}</h3>
                         <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">{point.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-premium aspect-square h-[300px] sm:h-[400px] md:h-auto mx-auto md:mx-0 w-full max-w-md md:max-w-none">
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
