import { motion } from 'framer-motion';
import { Heart, Sun, Smile, Users } from 'lucide-react';

const Culture = () => {
  return (
    <div className="min-h-screen bg-white pt-20 md:pt-28 pb-10 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-12 md:py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 mb-6 md:mb-10 tracking-tighter leading-tight"
          >
            Our <span className="text-primary italic">Culture.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed px-4">
            We're a team of dreamers and doers who believe that work should be challenging, rewarding, and purpose-driven.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mt-12 md:mt-20">
          {[
            { title: 'Passionate', desc: 'We love what we do and why we do it.', icon: Heart, color: 'text-red-500' },
            { title: 'Transparent', desc: 'We value honesty and open communication.', icon: Sun, color: 'text-yellow-500' },
            { title: 'Inclusive', desc: 'We embrace diversity and belonging.', icon: Users, color: 'text-primary' },
            { title: 'Fun', desc: 'We take our work seriously, not ourselves.', icon: Smile, color: 'text-orange-500' }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 md:p-10 bg-gray-50 rounded-[2rem] md:rounded-[3rem] border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm mb-6">
                <item.icon className={`h-8 w-8 md:h-10 md:w-10 ${item.color}`} />
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-4">{item.title}</h3>
              <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Culture;
