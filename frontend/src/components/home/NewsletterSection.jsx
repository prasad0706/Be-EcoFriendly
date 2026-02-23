import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Leaf, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Welcome to our green community!');
    setEmail('');
  };

  return (
    <section className="py-10 md:py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="bg-primary rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/10">
          {/* Decorative Elements */}
          <div className="absolute top-[-20%] left-[-10%] w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-[60px] md:blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-[60px] md:blur-[120px]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: 0 }}
              className="w-12 h-12 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-10 border border-white/20"
            >
              <Leaf className="h-6 w-6 md:h-10 md:w-10 text-accent" />
            </motion.div>

            <h2 className="text-2xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-tight drop-shadow-lg uppercase italic">
              Join the <span className="text-accent underline decoration-white/20">Eco List.</span>
            </h2>
            <p className="text-white/70 text-[10px] md:text-xl font-bold mb-8 md:mb-14 px-4 md:px-0 leading-relaxed uppercase tracking-widest">
              Exclusive deals & sustainability tips delivered weekly.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 px-2 md:px-0">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 md:px-10 py-4 rounded-xl md:rounded-[2rem] bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-xl font-black text-[10px] md:text-xl transition-all h-12 md:h-auto uppercase tracking-widest"
              />
              <button
                type="submit"
                className="px-8 md:px-12 py-4 bg-accent text-white rounded-xl md:rounded-[2rem] font-black text-[10px] md:text-lg uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-2 group h-12 md:h-auto shadow-xl shadow-accent/20"
              >
                Subscribe
                <Send className="h-3.5 w-3.5 md:h-5 md:w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
            <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
               <Sparkles className="h-3.5 w-3.5 text-white" />
               <p className="text-[8px] md:text-xs text-white font-black uppercase tracking-[0.3em]">
                 No Spam. Secure & Private Explorer.
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
