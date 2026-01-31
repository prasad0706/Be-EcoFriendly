import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ShoppingBag, Truck, Shield, Users, TrendingUp, Sparkles, Award } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: 'Eco-Friendly Products',
      description: 'Carefully curated sustainable alternatives for your daily needs.'
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: 'Fast Shipping',
      description: 'Quick and eco-conscious delivery right to your doorstep.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Trusted Quality',
      description: 'Every product is verified for quality and sustainability standards.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Global Community',
      description: 'Join thousands of people making a difference for our planet.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '500+', label: 'Eco Products' },
    { value: '50+', label: 'Partner Brands' },
    { value: '100%', label: 'Sustainable' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-mesh overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-mint/50 px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Sustainable Living Made Easy</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Better for You, <br />
                <span className="text-primary italic">Better for Earth.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg font-medium">
                Discover our curated collection of eco-friendly products designed to help you live a more sustainable and conscious lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button className="px-10 py-4 text-lg font-bold group">
                    Shop Collection
                    <ShoppingBag className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="px-10 py-4 text-lg font-bold">
                    Our Story
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 bg-white p-4 rounded-3xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"
                  alt="Sustainable Products"
                  className="rounded-[2.5rem] w-full object-cover aspect-[4/3]"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-3xl shadow-xl z-20 hidden md:block">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs font-medium uppercase tracking-widest opacity-80">Eco-Friendly</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Be-EcoFriendly?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              We make it simple to switch to sustainable alternatives without compromising on quality or style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-mint/50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Make an Impact?</h2>
              <p className="text-xl opacity-90 mb-12 font-medium">
                Join our community of eco-conscious shoppers and start your journey towards a greener future today.
              </p>
              <Link to="/shop">
                <Button variant="outline" className="bg-white text-primary border-none hover:bg-gray-100 px-12 py-4 text-xl font-bold">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
