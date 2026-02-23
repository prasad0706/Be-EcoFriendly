import { motion } from 'framer-motion';
import { Leaf, Recycle, Globe, Users, Shield, Target } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Products', value: '2k+', icon: Leaf },
    { label: 'Users', value: '15k+', icon: Users },
    { label: 'CO2 Saved', value: '50t', icon: Target },
    { label: 'Regions', value: '12', icon: Globe },
  ];

  return (
    <div className="pt-20 md:pt-28 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-mesh relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block py-1 md:py-1.5 px-3 md:px-4 rounded-full bg-mint text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 border border-primary/10">
              Our Vision
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              Empowering a Sustainable <span className="text-primary">Lifestyle.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-600 font-medium leading-relaxed px-4 md:px-0">
              Be-EcoFriendly is more than just an e-commerce platform. We are a community-driven movement dedicated to making eco-conscious living accessible, stylish, and impactful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-2xl mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 tracking-tight">Our Mission</h2>
              <div className="space-y-6">
                {[
                  { icon: Recycle, title: "Sustainable Sourcing", desc: "Every product in our collection is strictly vetted for environmental impact, ethical production, and material quality." },
                  { icon: Globe, title: "Community Impact", desc: "We partner with local artisans and eco-focused startups to foster a regenerative economy." },
                  { icon: Shield, title: "Transparency", desc: "We provide detailed ecological footprints for our items, ensuring you know the story behind every purchase." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2.5 bg-primary/10 rounded-xl">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-[2.5rem] p-10 md:p-12 aspect-square flex items-center justify-center relative overflow-hidden shadow-inner border border-gray-100"
            >
              <Leaf className="h-48 md:h-64 w-48 md:w-64 text-primary opacity-10 absolute -bottom-10 -right-10 rotate-12" />
              <div className="relative z-10 text-center">
                <div className="text-5xl md:text-6xl font-black text-primary mb-2 md:mb-4 italic tracking-tighter">EST. 2024</div>
                <div className="text-lg md:text-xl font-black text-gray-800 uppercase tracking-[0.3em]">Be-EcoFriendly</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
