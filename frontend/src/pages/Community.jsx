import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Share2, Sparkles, Heart, Trophy, Globe, Zap } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/common/Button';

const FEEDS = [
  {
    user: "Emma Sustainable",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    post: "Just completed my first week plastic-free! The Be-Eco bamboo kit made it so easy. #EcoWarrior",
    likes: 124,
    time: "2h ago",
    badges: ["Seedling"]
  },
  {
    user: "ZeroWasted",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zero",
    post: "Who's joining the Shoreline Cleanup this Saturday? Let's make an impact! 🌊",
    likes: 85,
    time: "4h ago",
    badges: ["Guardian"]
  },
  {
    user: "EcoExplorer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eco",
    post: "Found the most amazing sustainable cafe in Bristol. Check out my latest blog post for details.",
    likes: 210,
    time: "6h ago",
    badges: ["Explorer"]
  }
];

const Community = () => {
  const [activeTab, setActiveTab] = useState('Feed');

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Community Header */}
        <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary mb-6"
            >
              <Zap className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">Active Community</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none"
            >
              The <span className="text-secondary">Eco</span><br />
              Collective.
            </motion.h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex -space-x-4">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-100">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="" />
                 </div>
               ))}
               <div className="w-14 h-14 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center font-black text-sm shadow-xl relative z-10">
                 +12k
               </div>
             </div>
             <p className="text-gray-500 font-bold ml-4">Members already joined.</p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           
           {/* Sidebar */}
           <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-white p-4 rounded-[2.5rem] shadow-premium border border-gray-100 flex flex-col gap-2">
                 {['Feed', 'Challenges', 'Events', 'Leaderboard'].map((tab) => (
                   <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full py-4 px-6 rounded-2xl flex items-center gap-4 transition-all duration-300 font-bold ${activeTab === tab ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-gray-500 hover:bg-soft-green/50 hover:text-primary'}`}
                   >
                      {tab === 'Feed' && <Sparkles className="h-5 w-5" />}
                      {tab === 'Challenges' && <Trophy className="h-5 w-5" />}
                      {tab === 'Events' && <Globe className="h-5 w-5" />}
                      {tab === 'Leaderboard' && <Zap className="h-5 w-5" />}
                      {tab}
                   </button>
                 ))}
              </div>

              <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white overflow-hidden relative group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <h3 className="text-2xl font-black mb-4 relative z-10">Create Post</h3>
                 <p className="text-white/60 text-sm font-medium mb-8 relative z-10">Share your sustainable journey with 12,000+ members.</p>
                 <Button className="w-full h-14 rounded-2xl bg-white text-gray-900 font-black uppercase text-xs tracking-widest relative z-10">New Post</Button>
              </div>
           </div>

           {/* Main Feed Content */}
           <div className="lg:col-span-3 space-y-10">
             <AnimatePresence mode="wait">
               {activeTab === 'Feed' && (
                 <motion.div 
                   key="feed"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-8"
                 >
                    {FEEDS.map((feed, i) => (
                      <div key={i} className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-5">
                               <div className="w-16 h-16 rounded-2xl bg-soft-green overflow-hidden border-2 border-primary/10 shadow-inner">
                                  <img src={feed.avatar} alt="" className="w-full h-full object-cover scale-110" />
                               </div>
                               <div>
                                  <div className="flex items-center gap-3">
                                     <h4 className="text-xl font-black text-gray-900">{feed.user}</h4>
                                     <div className="flex gap-1.5">
                                        {feed.badges.map(b => (
                                          <span key={b} className="bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-primary/10">{b}</span>
                                        ))}
                                     </div>
                                  </div>
                                  <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{feed.time}</p>
                               </div>
                            </div>
                            <button className="text-gray-300 hover:text-gray-900 transition-colors">
                               <Share2 className="h-5 w-5" />
                            </button>
                         </div>
                         <p className="text-xl font-medium text-gray-700 leading-relaxed mb-10 px-2">{feed.post}</p>
                         <div className="flex items-center gap-10 border-t border-gray-50 pt-8 mt-2">
                            <button className="flex items-center gap-3 text-gray-400 font-black uppercase text-xs tracking-widest group">
                               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-500 transition-all shadow-inner">
                                  <Heart className="h-5 w-5" />
                               </div>
                               <span>{feed.likes} Likes</span>
                            </button>
                            <button className="flex items-center gap-3 text-gray-400 font-black uppercase text-xs tracking-widest group">
                               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-inner">
                                  <MessageCircle className="h-5 w-5" />
                               </div>
                               <span>Comment</span>
                            </button>
                         </div>
                      </div>
                    ))}
                 </motion.div>
               )}
               {/* Add other tab contents as needed */}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
