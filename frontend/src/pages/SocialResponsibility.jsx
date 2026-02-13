import { motion } from 'framer-motion';
import { Heart, Globe, Droplets, Leaf, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';

const INITIATIVES = [
  {
    title: "Project Green Ocean",
    desc: "Recovering plastic waste from coastal areas and transforming it into reusable materials for our packaging.",
    stat: "1.2M kg",
    label: "Plastic Recovered",
    icon: Droplets,
    color: "bg-blue-500"
  },
  {
    title: "The Reforestation Pact",
    desc: "For every purchase, we plant a native tree species in deforested areas across the Amazon and Southeast Asia.",
    stat: "500k+",
    label: "Trees Planted",
    icon: Leaf,
    color: "bg-green-eco"
  },
  {
    title: "Global Eco Literacy",
    desc: "Educating over 100,000 students annually on the importance of sustainability and circular economy practices.",
    stat: "100k",
    label: "Students Reached",
    icon: Globe,
    color: "bg-teal"
  }
];

const SocialResponsibility = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Visual Block Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
           <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white mb-8 border border-white/20 shadow-xl"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-widest">Impact Report 2025</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl font-black text-white tracking-tighter mb-10 leading-[0.9]"
          >
            Social<br />
            Responsibility.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-2xl font-medium max-w-xl leading-relaxed mb-12"
          >
            We believe that profit should never come at the expense of our planet or people. Our mission is to leave the world better than we found it.
          </motion.p>
          <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-gray-900 border-none">Our Mission Statement</Button>
        </div>
      </section>

      {/* Stats Cluster */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {INITIATIVES.map((item, i) => (
             <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-12 bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center hover:bg-white hover:shadow-2xl hover:border-transparent transition-all duration-500"
             >
                <div className={`w-20 h-20 ${item.color} rounded-[1.5rem] flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-gray-200`}>
                   <item.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-6">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-10">{item.desc}</p>
                <div className="mt-auto">
                   <p className="text-4xl font-black text-gray-900 mb-1 tracking-tight">{item.stat}</p>
                   <p className="text-xs font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                </div>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Story */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row gap-20 items-center">
           <div className="flex-1 rounded-[4rem] overflow-hidden shadow-premium aspect-[4/5] lg:aspect-auto h-[600px] w-full">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-[3s]"
              />
           </div>
           <div className="flex-1">
              <span className="text-primary font-black uppercase text-xs tracking-widest block mb-6">Case Study: 2024</span>
              <h2 className="text-5xl font-black mb-10 text-gray-900 tracking-tight leading-tight">Empowering Communities, One Sale at a Time.</h2>
              <div className="space-y-8 mb-12">
                 {[
                   { title: "Ethical Sourcing", desc: "100% of our supply chain partners adhere to Fair Trade certifications." },
                   { title: "Carbon Neutrality", desc: "We offset double our operational carbon footprint through certified credits." },
                   { title: "Local Production", desc: "45% of our best-sellers are manufactured within 500 miles of our distribution hubs." }
                 ].map((point, i) => (
                   <div key={i} className="flex gap-6">
                      <div className="bg-white w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-sm">
                         <Heart className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                         <h4 className="font-black text-xl mb-1">{point.title}</h4>
                         <p className="text-gray-500  font-medium leading-relaxed">{point.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <Button size="lg" className="h-16 px-10 rounded-2xl">Read Full Impact Report</Button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default SocialResponsibility;
