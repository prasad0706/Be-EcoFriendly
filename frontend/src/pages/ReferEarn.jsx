import { motion } from 'framer-motion';
import { Share2, Gift, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';

const ReferEarn = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-mesh overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-8"
            >
              <Gift className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">Referral Program</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter"
            >
              Spread Love,<br />
              <span className="gradient-text">Earn Green.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-xl font-medium mb-10 max-w-xl"
            >
              Invite your friends to join the eco-friendly movement. They get a discount, and you earn rewards for every successful referral.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="h-16 px-10 rounded-2xl text-base shadow-xl shadow-primary/20">
                Get Your Referral Link
              </Button>
            </motion.div>
          </div>

          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-10"
            >
              <div className="bg-white p-8 rounded-[3rem] shadow-premium border border-gray-100 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black">Quick Share</h3>
                  <Share2 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm font-medium text-center">
                    be-eco.com/ref/USER123
                  </div>
                  <Button variant="outline" className="w-full h-14 rounded-xl font-bold">Copy Link</Button>
                </div>
                <div className="bg-soft-green p-6 rounded-2xl">
                  <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Total Earnings</p>
                  <p className="text-3xl font-black text-gray-900">$120.00</p>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-6">How it Works</h2>
            <p className="text-gray-500 font-medium">Simple steps to earn your rewards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Share2, title: "Share Your Link", desc: "Send your unique referral link to friends via WhatsApp, Email, or Social Media." },
              { icon: Rocket, title: "They Shop", desc: "Your friends get 15% OFF their first order using your referral link or code." },
              { icon: Gift, title: "You Earn", desc: "Once their order ships, you receive $10 in your wallet for future purchases." }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-soft-green rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-32 bg-gray-900 text-white rounded-[4rem] mx-4 mb-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-black mb-10 leading-tight">The Eco-Referral <span className="text-accent underline decoration-4 underline-offset-8">Manifesto.</span></h2>
              <div className="space-y-6">
                {[
                  "No limits on successful referrals.",
                  " 친구 get 15% off their first order.",
                  "Credit is applied automatically.",
                  "Valid for orders over $50."
                ].map((rule, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                    <span className="text-lg font-medium opacity-80">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3.5rem] relative group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <h3 className="text-3xl font-black mb-6 relative z-10">Start Earning Today</h3>
               <p className="text-white/60 font-medium mb-10 relative z-10 leading-relaxed">Join 10,000+ eco-warriors who are already sharing and earning rewards while making a difference.</p>
               <Button className="w-full h-16 rounded-2xl bg-white text-gray-900 hover:bg-white/90 relative z-10">Join Program</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReferEarn;
