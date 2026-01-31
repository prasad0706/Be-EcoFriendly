import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ShoppingBag, Truck, Shield, Users, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-green" />,
      title: 'Eco-Friendly Products',
      description: 'Carefully curated sustainable alternatives for everyday needs'
    },
    {
      icon: <Truck className="h-8 w-8 text-green" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your doorstep'
    },
    {
      icon: <Shield className="h-8 w-8 text-green" />,
      title: 'Quality Guaranteed',
      description: 'All products are tested for quality and sustainability'
    },
    {
      icon: <Users className="h-8 w-8 text-green" />,
      title: 'Community Impact',
      description: 'Supporting local and ethical businesses worldwide'
    }
  ];

  const stats = [
    // Note: These are social proof placeholders. In a full production app, 
    // these would be fetched from a dynamic stats API.
    { value: '10K+', label: 'Happy Customers' },
    { value: '500+', label: 'Eco Products' },
    { value: '50+', label: 'Partner Brands' },
    { value: '100%', label: 'Carbon Neutral' }
  ];

  return (
    <div className="min-h-screen bg-mesh">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-green-eco/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-primary-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 mb-6 shadow-sm">
                <Leaf className="h-4 w-4 text-green-eco" />
                <span className="text-sm font-medium text-gray-700">Join the Eco-Revolution</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                Live Sustainably,
                <span className="block gradient-text">Shop Consciously</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
                Discover curated eco-friendly alternatives that don't compromise on quality. Join over 10,000 conscious consumers making a real impact today.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/shop">
                  <Button size="lg" className="btn-secondary group">
                    <span>Shop All Products</span>
                    <ShoppingBag className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" className="btn-outline">
                    Our Mission
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">4.9/5</span> from 2,000+ reviews
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative z-10 glass-card p-4 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"
                  alt="Sustainable Lifestyle"
                  className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]"
                />

                {/* Floating Elements */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -top-10 -left-10 glass p-5 rounded-2xl shadow-xl hidden md:block"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-eco/20 p-2 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-eco" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Monthly Impact</p>
                      <p className="text-lg font-bold text-gray-900">+24% Organic</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -bottom-10 -right-10 glass p-5 rounded-2xl shadow-xl hidden md:block"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-blue/20 p-2 rounded-lg">
                      <Truck className="h-6 w-6 text-primary-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Free Shipping</p>
                      <p className="text-lg font-bold text-gray-900">Over ₹999</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gray-200 rounded-full -z-10 opacity-50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-10 md:p-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <p className="text-4xl md:text-5xl font-black gradient-text mb-2">{stat.value}</p>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              The Be-Eco Way
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We bridge the gap between luxury and sustainability, making it easy to live better without compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="bg-gradient-to-br from-green-eco/20 to-teal/10 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Premium Feel */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-eco rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-blue rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Real Stories from Real People
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                className="glass-dark p-10 rounded-3xl border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xl text-gray-300 mb-8 italic leading-relaxed">
                  "Switching to Be-Eco has completely transformed my daily routine. The quality is far beyond what I expected from sustainable products."
                </p>
                <div className="flex items-center">
                  <img src={`https://i.pravatar.cc/150?u=user${item}`} className="w-14 h-14 rounded-2xl border-2 border-green-eco/30 group-hover:scale-110 transition-transform" />
                  <div className="ml-4">
                    <p className="font-bold text-lg text-white">Alex Rivera</p>
                    <p className="text-green-eco font-medium">Sustainable Explorer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Impactful */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-green-eco to-primary-blue p-12 md:p-24 text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-3xl mx-auto text-white"
            >
              <h2 className="text-4xl md:text-6xl font-black mb-8">
                Ready to Join the Revolution?
              </h2>
              <p className="text-xl text-white/90 mb-12 leading-relaxed">
                Be part of a global movement towards a greener future. Your first step starts with a conscious choice.
              </p>
              <Link to="/shop">
                <Button size="xl" className="bg-white text-gray-900 border-none px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl">
                  Start Shopping Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;