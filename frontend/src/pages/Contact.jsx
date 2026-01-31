import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Your message has been sent!');
      e.target.reset();
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@be-eco.com', color: 'text-primary' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', color: 'text-green-500' },
    { icon: MapPin, label: 'Office', value: '123 Green St, Eco City', color: 'text-teal' },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Get In <span className="text-primary">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 font-medium"
          >
            Have questions about our sustainable products or mission? Our team is here to help you on your eco-friendly journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Cards */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gray-50 mb-4 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</h3>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-10 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  label="Name"
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <Input
                label="Subject"
                placeholder="How can we help?"
                required
              />
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 ml-1">Message</label>
                <textarea
                  className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[150px] font-medium"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full py-4 text-lg font-bold"
                loading={loading}
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
