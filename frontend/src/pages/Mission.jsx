import { motion } from 'framer-motion';
import { Target, Leaf, Shield, Globe } from 'lucide-react';

const Mission = () => {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 mb-10 tracking-tighter"
          >
            Our <span className="text-primary italic">Mission.</span>
          </motion.h1>
          <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Changing the world, one conscious purchase at a time.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20 items-center">
           <div>
              <h2 className="text-4xl font-black mb-8">Leaving the planet better than we found it.</h2>
              <div className="space-y-10">
                 {[
                   { title: 'Zero Waste', desc: 'Eliminating single-use plastics from our entire supply chain by 2026.', icon: Leaf },
                   { title: 'Ethical Production', desc: 'Ensuring every worker behind our products is treated with dignity.', icon: Shield },
                   { title: 'Global Impact', desc: 'Investing 5% of all profits into reforestation projects.', icon: Globe }
                 ].map((point, i) => (
                   <div key={i} className="flex gap-6">
                      <div className="w-14 h-14 bg-soft-green rounded-2xl flex items-center justify-center shrink-0">
                         <point.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black mb-2">{point.title}</h3>
                         <p className="text-gray-500 font-medium leading-relaxed">{point.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="rounded-[4rem] overflow-hidden shadow-premium aspect-square">
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
