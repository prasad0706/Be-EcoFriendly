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

const CHALLENGES = [
  {
    title: "Plastic-Free Week",
    description: "Eliminate all single-use plastics from your daily routine for 7 days.",
    points: 500,
    difficulty: "Intermediate",
    participants: 1240,
    daysLeft: 5,
    icon: Zap
  },
  {
    title: "Zero Waste Kitchen",
    description: "Start composting and reduce your food waste to near zero.",
    points: 850,
    difficulty: "Expert",
    participants: 850,
    daysLeft: 12,
    icon: Globe
  },
  {
    title: "Sustainable Commuter",
    description: "Use public transport, bike, or walk for all your travels this week.",
    points: 300,
    difficulty: "Easy",
    participants: 3100,
    daysLeft: 2,
    icon: Share2
  }
];

const EVENTS = [
  {
    title: "Coastal Cleanup Drive",
    date: "Feb 20, 2026",
    time: "09:00 AM",
    location: "Brighton Beach",
    type: "In-Person",
    image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Sustainable Living Workshop",
    date: "Feb 24, 2026",
    time: "06:30 PM",
    location: "Online / Zoom",
    type: "Virtual",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Plant-Based Cooking Class",
    date: "Mar 02, 2026",
    time: "04:00 PM",
    location: "Eco Kitchen, London",
    type: "In-Person",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
  }
];

const LEADERBOARD = [
  { rank: 1, user: "Alex Green", points: 15240, impact: "240kg CO2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
  { rank: 2, user: "Sarah Eco", points: 12850, impact: "195kg CO2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { rank: 3, user: "Mike Wood", points: 11200, impact: "170kg CO2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
  { rank: 4, user: "Luna Nature", points: 9840, impact: "155kg CO2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna" },
  { rank: 5, user: "Terra Bold", points: 8560, impact: "130kg CO2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Terra" }
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
                      {tab === 'Leaderboard' && <Users className="h-5 w-5" />}
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

           {/* Main Content Area */}
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

               {activeTab === 'Challenges' && (
                 <motion.div
                   key="challenges"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="grid grid-cols-1 md:grid-cols-2 gap-8"
                 >
                   {CHALLENGES.map((challenge, i) => (
                     <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                          <challenge.icon className="h-24 w-24 text-primary" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/10">
                              {challenge.difficulty}
                            </span>
                            <span className="text-xs font-bold text-gray-400 font-mono italic">{challenge.daysLeft}d left</span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 mb-4">{challenge.title}</h3>
                          <p className="text-gray-500 font-medium mb-8 leading-relaxed">{challenge.description}</p>
                          <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                            <div>
                              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Reward</p>
                              <p className="text-xl font-black text-primary">{challenge.points} Points</p>
                            </div>
                            <Button className="rounded-xl px-6 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest">Join</Button>
                          </div>
                        </div>
                     </div>
                   ))}
                 </motion.div>
               )}

               {activeTab === 'Events' && (
                 <motion.div
                   key="events"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-8"
                 >
                   {EVENTS.map((event, i) => (
                     <div key={i} className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden flex flex-col md:flex-row h-full md:h-64 group">
                        <div className="w-full md:w-80 h-48 md:h-full overflow-hidden">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-lg">{event.type}</span>
                              <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                                <Globe className="h-3 w-3" /> {event.location}
                              </span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 truncate">{event.title}</h3>
                            <p className="text-gray-500 font-medium text-sm">Join us for a meaningful impact session. Open to all volunteers.</p>
                          </div>
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-100">
                                  <span className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Feb</span>
                                  <span className="text-lg font-black text-gray-900 leading-none">20</span>
                               </div>
                               <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                 {event.time}
                               </div>
                            </div>
                            <Button variant="outline" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest border-2">Register</Button>
                          </div>
                        </div>
                     </div>
                   ))}
                 </motion.div>
               )}

               {activeTab === 'Leaderboard' && (
                 <motion.div
                   key="leaderboard"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden"
                 >
                    <div className="bg-gray-900 p-10 text-white">
                       <h3 className="text-3xl font-black mb-2 flex items-center gap-4">
                         <Trophy className="h-8 w-8 text-yellow-500" /> Top Contributors
                       </h3>
                       <p className="text-white/60 font-medium">Monthly rankings based on eco-impact and community engagement.</p>
                    </div>
                    <div className="p-4">
                       {LEADERBOARD.map((user, i) => (
                         <div 
                           key={i} 
                           className={`flex items-center justify-between p-6 rounded-2xl hover:bg-gray-50 transition-colors ${i === 0 ? 'bg-primary/5 border border-primary/10' : ''}`}
                         >
                            <div className="flex items-center gap-6">
                               <div className={`w-10 h-10 flex items-center justify-center font-black text-xl ${i === 0 ? 'text-yellow-500' : 'text-gray-300'}`}>
                                 #{user.rank}
                               </div>
                               <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-gray-100">
                                 <img src={user.avatar} alt="" />
                               </div>
                               <div>
                                 <h4 className="text-lg font-black text-gray-900">{user.user}</h4>
                                 <p className="text-[10px] font-black uppercase text-primary tracking-widest">Impact: {user.impact}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-2xl font-black text-gray-900">{user.points.toLocaleString()}</p>
                               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Eco Points</p>
                            </div>
                         </div>
                       ))}
                    </div>
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
