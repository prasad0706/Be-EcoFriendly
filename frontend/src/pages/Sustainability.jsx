import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Zap, Globe, Droplets, Wind, Award, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Sustainability = () => {
  const principles = [
    {
      icon: <Wind className="h-6 w-6 text-blue-400" />,
      title: "Carbon Negative",
      desc: "We don't just reach net-zero; we remove more carbon than we emit.",
      stat: "125%",
      label: "Offset Ratio"
    },
    {
      icon: <Droplets className="h-6 w-6 text-blue-600" />,
      title: "Water Neutral",
      desc: "Our manufacturing processes use 90% less water than industry standards.",
      stat: "2.4M",
      label: "Liters Saved/Year"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
      title: "Ethical Sourcing",
      desc: "100% of our materials are verified for fair-trade and ethical labor.",
      stat: "100%",
      label: "Verified Supply"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Renewable Energy",
      desc: "Our distribution hubs are powered by 100% solar and wind energy.",
      stat: "0g",
      label: "Coal Dependency"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-20 font-sans">
      {/* Hero Section */}
      <section className="px-4 md:px-8 mb-20 md:mb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-primary/5 px-4 py-2 rounded-full mb-8 border border-primary/10"
          >
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2em]">Platinum Standard 2026</span>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter uppercase italic mb-8"
              >
                Beyond <br /> 
                <span className="text-primary underline decoration-primary/10">Shopping.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-2xl text-gray-500 font-bold uppercase tracking-widest leading-relaxed max-w-xl opacity-80 mb-12"
              >
                At Be-Eco, sustainability isn't a feature—it's the core architecture of everything we build.
              </motion.p>
              <div className="flex flex-wrap gap-4">
                 <Button className="h-16 px-10 rounded-2xl shadow-xl shadow-primary/10 font-black uppercase tracking-widest text-xs border-none">
                   Explore Impact Report
                 </Button>
                 <Link to="/shop">
                    <button className="h-16 px-10 rounded-2xl border-2 border-gray-100 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                      Shop Consciously
                    </button>
                 </Link>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative aspect-square md:aspect-auto md:h-[600px] rounded-[3rem] overflow-hidden shadow-premium group"
            >
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" 
                alt="Nature impact"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                 <div className="flex gap-8">
                    <div>
                       <p className="text-4xl md:text-6xl font-black text-white leading-none">85%</p>
                       <p className="text-[10px] md:text-xs font-black text-white/60 uppercase tracking-widest mt-2">Circularity Index</p>
                    </div>
                    <div className="w-px h-full bg-white/20" />
                    <div>
                       <p className="text-4xl md:text-6xl font-black text-white leading-none">100%</p>
                       <p className="text-[10px] md:text-xs font-black text-white/60 uppercase tracking-widest mt-2">Plastic Free</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principles Grid */}
      <section className="bg-gray-50/50 py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 md:mb-24">
             <h2 className="text-3xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">Our Green <span className="text-primary italic">OS.</span></h2>
             <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Built for the long term</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {principles.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-primary/5 transition-colors border border-gray-50 group-hover:border-primary/10">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-xs text-gray-400 font-bold leading-relaxed mb-8">{item.desc}</p>
                <div className="mt-auto border-t border-gray-50 pt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-primary">{item.stat}</span>
                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Visualizer Section */}
      <section className="py-24 md:py-40 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-16 md:gap-32">
            <div className="flex-1">
               <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.4em] mb-6 block">Supply Integrity</span>
               <h2 className="text-4xl md:text-7xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-10">We own the <br /> <span className="text-secondary-blue underline decoration-primary/10">Source.</span></h2>
               <div className="space-y-6">
                  {[
                    "Zero-Waste Packaging by Default",
                    "Regenerative Agriculture Projects",
                    "Fair Trade Certified Manufacturing",
                    "Closed-Loop Product Lifecycle"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                       <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <ShieldCheck className="h-3 w-3 text-primary group-hover:text-white" />
                       </div>
                       <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-900 transition-colors">{text}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 relative">
                <div className="absolute inset-0 bg-primary/5 rounded-[4rem] -rotate-3 scale-105" />
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop" 
                  className="relative z-10 w-full rounded-[3.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
                />
            </div>
         </div>
      </section>

      {/* Trust Badges */}
      <section className="pb-24 border-t border-gray-100 pt-24 bg-gray-50/20">
         <div className="max-w-5xl mx-auto px-4 text-center">
            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-16 px-2">Globally Recognized Excellence</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-30">
               <div className="flex items-center gap-2 font-black text-xl md:text-2xl tracking-tighter">
                  <Globe className="h-6 w-6" /> EARTH-FIRST
               </div>
               <div className="flex items-center gap-2 font-black text-xl md:text-2xl tracking-tighter">
                  <Award className="h-6 w-6" /> FORBES 30 GREEN
               </div>
               <div className="flex items-center gap-2 font-black text-xl md:text-2xl tracking-tighter">
                  <ShieldCheck className="h-6 w-6" /> B-CORP
               </div>
               <div className="flex items-center gap-2 font-black text-xl md:text-2xl tracking-tighter">
                  <Zap className="h-6 w-6" /> ISO 50001
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-8 leading-tight">Ready to join the <br /> <span className="text-primary italic underline decoration-primary/10 font-bold">Resilience Movement?</span></h2>
            <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-12 max-w-lg mx-auto italic">
              Become part of our 1.5 million strong collective making better choices daily.
            </p>
            <Link to="/register">
               <Button className="h-16 px-12 rounded-2xl shadow-2xl shadow-primary/20 font-black uppercase tracking-widest text-xs border-none active:scale-95 transition-all">
                 Join the Collective <ArrowRight className="ml-3 h-4 w-4" />
               </Button>
            </Link>
         </div>
      </section>
    </div>
  );
};

export default Sustainability;
