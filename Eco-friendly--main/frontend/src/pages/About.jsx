import { motion } from 'framer-motion';
import { Leaf, Recycle, Users, Award } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Leaf className="h-8 w-8 text-green" />,
      title: "Sustainability",
      description: "We're committed to promoting eco-friendly products that minimize environmental impact."
    },
    {
      icon: <Recycle className="h-8 w-8 text-green" />,
      title: "Circular Economy",
      description: "Supporting brands that embrace recycling, upcycling, and waste reduction practices."
    },
    {
      icon: <Users className="h-8 w-8 text-green" />,
      title: "Community",
      description: "Building a community of conscious consumers who care about our planet's future."
    },
    {
      icon: <Award className="h-8 w-8 text-green" />,
      title: "Quality",
      description: "Curating high-quality sustainable products that stand the test of time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-teal to-green">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Mission
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Empowering conscious consumers with sustainable choices for a greener tomorrow
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2023, Be-EcoFriendly emerged from a simple idea: making sustainable living 
                accessible to everyone. We noticed that while eco-friendly products existed, finding 
                quality options was often challenging and overwhelming.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of environmental enthusiasts and tech experts came together to create a 
                platform that curates the best sustainable products from ethical brands worldwide.
              </p>
              <p className="text-gray-600">
                Today, we're proud to support thousands of conscious consumers in their journey 
                toward a more sustainable lifestyle, one purchase at a time.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-mint rounded-xl p-8 flex items-center justify-center"
            >
              <div className="text-center">
                <Leaf className="h-24 w-24 text-green mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-800">100% Eco-Friendly</p>
                <p className="text-gray-600">Products Curated</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Our Core Values
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Meet Our Team
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-mint rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Alex Johnson</h3>
              <p className="text-green font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600">
                Environmental scientist turned entrepreneur with a passion for sustainable innovation.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-mint rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Maria Garcia</h3>
              <p className="text-green font-medium mb-2">Head of Sustainability</p>
              <p className="text-gray-600">
                Expert in circular economy and ethical sourcing with 10+ years of industry experience.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-mint rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Sam Wilson</h3>
              <p className="text-green font-medium mb-2">Tech Lead</p>
              <p className="text-gray-600">
                Full-stack developer passionate about creating technology for positive environmental impact.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;