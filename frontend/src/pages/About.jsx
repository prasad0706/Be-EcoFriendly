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
    <div className="pt-28 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-mesh relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-mint text-primary text-xs font-bold uppercase tracking-widest mb-6">
              Our Vision
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Empowering a Sustainable <span className="text-primary">Lifestyle</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
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
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                    <Recycle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Sustainable Sourcing</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      Every product in our collection is strictly vetted for environmental impact, ethical production, and material quality.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Community Impact</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      We partner with local artisans and eco-focused startups to foster a regenerative economy.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Transparency</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      We provide detailed ecological footprints for our items, ensuring you know the story behind every purchase.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-100 rounded-3xl p-12 aspect-square flex items-center justify-center relative overflow-hidden shadow-inner"
            >
              <Leaf className="h-64 w-64 text-primary opacity-10 absolute -bottom-10 -right-10 rotate-12" />
              <div className="relative z-10 text-center">
                <div className="text-6xl font-bold text-primary mb-4 italic">EST. 2024</div>
                <div className="text-xl font-bold text-gray-800 uppercase tracking-[0.3em]">Be-EcoFriendly</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
