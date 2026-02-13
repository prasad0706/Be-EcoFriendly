import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for joining our green community!');
    setEmail('');
  };

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="bg-primary rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20"
            >
              <Leaf className="h-8 w-8 text-accent" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Join the Eco-Revolution
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium mb-12">
              Get exclusive deals, sustainability tips, and new arrival alerts delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-8 py-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-md font-medium text-lg"
              />
              <button
                type="submit"
                className="px-10 py-5 bg-accent text-white rounded-2xl font-black text-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 group"
              >
                Subscribe
                <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
            <p className="mt-6 text-white/40 text-sm font-medium">
              We promise not to spam. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
