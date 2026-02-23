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
    <div className="pt-24 md:pt-32 pb-12 md:pb-24 min-h-screen bg-mesh overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-tight"
          >
            Get In <span className="text-primary italic">Touch.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-gray-500 font-medium leading-relaxed px-4"
          >
            Have questions about our sustainable products or mission? Our team is here to help you on your eco-friendly journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Contact Cards */}
          <div className="space-y-4 md:space-y-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-premium border border-gray-100 hover:border-primary/20 transition-all text-center md:text-left"
              >
                <div className={`inline-flex p-3 md:p-4 rounded-xl md:rounded-2xl bg-gray-50 mb-4 ${item.color} shadow-sm border border-gray-50`}>
                  <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{item.label}</h3>
                <p className="text-base md:text-xl font-black text-gray-900 break-words">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-premium border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <Input
                  label="Name"
                  placeholder="John Doe"
                  required
                  className="rounded-xl md:rounded-2xl font-bold py-3.5 md:py-4 bg-gray-50/50 border-gray-100 placeholder:text-gray-300"
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="rounded-xl md:rounded-2xl font-bold py-3.5 md:py-4 bg-gray-50/50 border-gray-100 placeholder:text-gray-300"
                />
              </div>
              <Input
                label="Subject"
                placeholder="How can we help?"
                required
                className="rounded-xl md:rounded-2xl font-bold py-3.5 md:py-4 bg-gray-50/50 border-gray-100 placeholder:text-gray-300"
              />
              <div className="space-y-2 md:space-y-3">
                <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  className="w-full px-5 md:px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[160px] font-bold text-gray-700 placeholder:text-gray-300 placeholder:font-bold"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full py-4.5 md:py-5 text-base md:text-lg font-black uppercase tracking-widest rounded-xl md:rounded-2xl shadow-xl shadow-primary/20 h-14 md:h-auto"
                loading={loading}
              >
                {!loading && <Send className="h-4 w-4 md:h-5 md:w-5 mr-3" />}
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
