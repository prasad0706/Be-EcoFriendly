import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Share2, Sparkles, Heart, Trophy, Globe, Zap, ArrowRight, ChevronRight, Share } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50/50 pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Community Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-16 gap-8 text-center lg:text-left">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-primary/10 rounded-full text-primary mb-6 shadow-sm border border-primary/5"
            >
              <Zap className="h-3.5 w-3.5" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Active Core</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] md:leading-none uppercase"
            >
              The <span className="gradient-text italic">Eco</span><br />
              Collective.
            </motion.h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6">
             <div className="flex -space-x-3 md:-space-x-5">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-white overflow-hidden shadow-premium bg-gray-50 flex-shrink-0">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="" className="w-full h-full object-cover" />
                 </div>
               ))}
               <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center font-black text-[10px] md:text-base shadow-xl relative z-10 flex-shrink-0">
                 +12K
               </div>
             </div>
             <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] leading-tight max-w-[120px] text-center sm:text-left">Members making an <span className="text-primary italic">impact.</span></p>
          </div>
        </div>

        {/* Action Tabs & Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
           
           {/* Sidebar Navigation */}
           <div className="lg:col-span-1 space-y-6">
              <div className="flex lg:flex-col p-1.5 bg-gray-100/50 rounded-2xl md:rounded-[2.5rem] gap-1 overflow-x-auto scrollbar-hide lg:sticky lg:top-32 shadow-inner border border-white/50">
                {[
                  { id: 'Feed', icon: Sparkles },
                  { id: 'Challenges', icon: Trophy },
                  { id: 'Events', icon: Globe },
                  { id: 'Leaderboard', icon: Users },
                ].map((tab) => (
                   <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 lg:flex-none py-3.5 md:py-5 px-5 md:px-8 rounded-xl md:rounded-3xl flex items-center justify-center lg:justify-start gap-3 md:gap-4 transition-all duration-300 font-black text-[10px] md:text-sm uppercase tracking-widest shrink-0 ${activeTab === tab.id ? 'bg-white shadow-xl shadow-primary/5 text-primary border border-primary/10 lg:scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                      <tab.icon className={`h-4 w-4 md:h-5 md:w-5 ${activeTab === tab.id ? 'text-primary' : 'opacity-40'}`} />
                      <span>{tab.id}</span>
                      {activeTab === tab.id && <ChevronRight className="h-4 w-4 ml-auto hidden lg:block" />}
                   </button>
                ))}
              </div>

              <div className="bg-gray-900 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white overflow-hidden relative group hidden lg:block">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-2xl font-black mb-3 tracking-tight italic">Initiate Action</h3>
                    <p className="text-white/50 text-xs font-bold mb-8 uppercase tracking-widest leading-relaxed">Share your journey with 12,000+ members.</p>
                    <Button className="w-full h-14 rounded-2xl bg-white text-gray-900 font-black uppercase text-xs tracking-widest shadow-glow hover:bg-accent hover:text-white transition-all border-none">Create New Post</Button>
                 </div>
              </div>
           </div>

           {/* Main Content Area */}
           <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
               {activeTab === 'Feed' && (
                 <motion.div 
                   key="feed"
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   className="space-y-6 md:space-y-10"
                 >
                    {FEEDS.map((feed, i) => (
                      <div key={i} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-premium border border-gray-100 hover:border-primary/20 transition-all duration-500 group">
                         <div className="flex items-center justify-between mb-6 md:mb-8">
                            <div className="flex items-center gap-4 md:gap-6">
                               <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gray-50 overflow-hidden border-2 border-primary/5 shadow-inner">
                                  <img src={feed.avatar} alt="" className="w-full h-full object-cover scale-110" />
                               </div>
                               <div>
                                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                     <h4 className="text-base md:text-2xl font-black text-gray-900 tracking-tight">{feed.user}</h4>
                                     <div className="flex gap-1">
                                        {feed.badges.map(b => (
                                          <span key={b} className="bg-primary/5 text-primary text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border border-primary/10">{b}</span>
                                        ))}
                                     </div>
                                  </div>
                                  <p className="text-[9px] md:text-xs font-black text-gray-400 mt-1 uppercase tracking-widest italic flex items-center gap-1.5 opacity-60">
                                    <Globe className="h-3 w-3" />
                                    {feed.time}
                                  </p>
                               </div>
                            </div>
                            <button className="p-2 md:p-3 bg-gray-50 rounded-xl text-gray-300 hover:text-primary transition-all shadow-sm border border-gray-100">
                               <Share className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                         </div>
                         <p className="text-base md:text-2xl font-medium text-gray-700 leading-relaxed md:leading-snug mb-8 md:mb-12 px-1 md:px-2 italic">"{feed.post}"</p>
                         <div className="flex items-center gap-6 md:gap-12 border-t border-gray-50 pt-6 md:pt-10">
                            <button className="flex items-center gap-3 text-gray-400 font-black uppercase text-[10px] md:text-xs tracking-widest group/btn">
                               <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center group-hover/btn:bg-red-50 group-hover/btn:text-red-500 transition-all shadow-glow-sm">
                                  <Heart className="h-4.5 w-4.5 md:h-6 md:w-6" />
                                </div>
                               <span className="group-hover/btn:text-gray-900 transition-colors">{feed.likes} Impact</span>
                            </button>
                            <button className="flex items-center gap-3 text-gray-400 font-black uppercase text-[10px] md:text-xs tracking-widest group/btn">
                               <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center group-hover/btn:bg-primary/5 group-hover/btn:text-primary transition-all shadow-glow-sm">
                                  <MessageCircle className="h-4.5 w-4.5 md:h-6 md:w-6" />
                               </div>
                               <span className="group-hover/btn:text-gray-900 transition-colors">Response</span>
                            </button>
                         </div>
                      </div>
                    ))}
                 </motion.div>
               )}

               {activeTab === 'Challenges' && (
                 <motion.div
                   key="challenges"
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                 >
                   {CHALLENGES.map((challenge, i) => (
                     <div key={i} className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-premium border border-gray-100 relative overflow-hidden group hover:border-accent/20 transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
                          <challenge.icon className="h-32 w-32 md:h-48 md:w-48 text-accent" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="flex justify-between items-start mb-6 md:mb-8">
                            <span className="bg-primary/5 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border border-primary/10">
                              {challenge.difficulty}
                            </span>
                            <span className="text-[10px] md:text-xs font-black text-red-400 uppercase tracking-widest italic flex items-center gap-1.5 animate-pulse">
                              <Zap className="h-3 w-3 fill-current" />
                              {challenge.daysLeft}d left
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase leading-none">{challenge.title}</h3>
                          <p className="text-sm md:text-lg text-gray-500 font-medium mb-10 leading-relaxed max-w-[280px]">{challenge.description}</p>
                          
                          <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                            <div>
                              <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 opacity-60">Reward Pool</p>
                              <p className="text-xl md:text-3xl font-black text-primary tracking-tighter">{challenge.points} XP</p>
                            </div>
                            <Button className="rounded-xl md:rounded-2xl px-8 h-12 md:h-16 bg-gray-900 text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl hover:bg-accent transition-all border-none">Initiate</Button>
                          </div>
                        </div>
                     </div>
                   ))}
                 </motion.div>
               )}

               {activeTab === 'Events' && (
                 <motion.div
                   key="events"
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   className="space-y-6 md:space-y-8"
                 >
                   {EVENTS.map((event, i) => (
                     <div key={i} className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-premium border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[450px] md:min-h-0 md:h-[300px] group border border-gray-100 hover:border-secondary/20 transition-all">
                        <div className="w-full md:w-[40%] h-48 md:h-auto overflow-hidden relative">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                          <div className="absolute top-4 left-4">
                             <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-secondary text-[10px] font-black uppercase tracking-widest shadow-xl border border-secondary/10">{event.type}</span>
                          </div>
                        </div>
                        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-3 mb-4 opacity-70">
                              <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                                <Globe className="h-3.5 w-3.5 text-secondary" /> 
                                <span className="truncate max-w-[150px] md:max-w-none">{event.location}</span>
                              </div>
                            </div>
                            <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 tracking-tighter leading-none italic uppercase">{event.title}</h3>
                            <p className="text-xs md:text-lg text-gray-500 font-medium leading-relaxed opacity-80">Join us for a meaningful impact session. Open to all volunteers and eco-warriors.</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-4 md:gap-5">
                               <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/5 rounded-xl md:rounded-2xl flex flex-col items-center justify-center border border-primary/10 shadow-sm">
                                  <span className="text-[8px] md:text-[10px] font-black text-primary uppercase leading-none mb-1 opacity-50">{event.date.split(' ')[0]}</span>
                                  <span className="text-lg md:text-2xl font-black text-primary leading-none tracking-tighter">{event.date.split(' ')[1].replace(',', '')}</span>
                               </div>
                               <div className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 italic">
                                 <Clock className="h-4 w-4" />
                                 {event.time}
                               </div>
                            </div>
                            <Button variant="outline" className="rounded-xl md:rounded-2xl px-6 md:px-10 h-12 md:h-14 font-black text-[10px] md:text-xs uppercase tracking-widest border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-glow-sm">RSVP</Button>
                          </div>
                        </div>
                     </div>
                   ))}
                 </motion.div>
               )}

               {activeTab === 'Leaderboard' && (
                 <motion.div
                   key="leaderboard"
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-premium border border-gray-100 overflow-hidden"
                 >
                    <div className="bg-gray-900 p-8 md:p-14 text-white relative">
                       <div className="absolute top-0 right-0 p-10 opacity-10">
                         <Trophy className="h-40 w-40 md:h-64 md:w-64 rotate-12" />
                       </div>
                       <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10">
                          <h3 className="text-3xl md:text-6xl font-black mb-4 tracking-tighter flex items-center gap-4 italic uppercase">
                             Top <span className="text-accent">Icons.</span>
                          </h3>
                          <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Monthly power rankings based on planetary impact</p>
                       </motion.div>
                    </div>
                    <div className="p-4 md:p-6 lg:p-8">
                       {LEADERBOARD.map((user, i) => (
                         <div 
                           key={i} 
                           className={`flex items-center justify-between p-4 md:p-8 rounded-2xl md:rounded-3xl hover:bg-gray-50 transition-all group ${i === 0 ? 'bg-primary/5 border border-primary/10 mb-4 scale-[1.02] shadow-xl shadow-primary/5' : 'mb-2'}`}
                         >
                            <div className="flex items-center gap-4 md:gap-8">
                               <div className={`w-8 md:w-12 flex items-center justify-center font-black text-lg md:text-3xl ${i === 0 ? 'text-yellow-500' : 'text-gray-300 group-hover:text-gray-900 transition-colors'}`}>
                                 #{user.rank}
                               </div>
                               <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-3xl border-2 border-white shadow-xl overflow-hidden bg-gray-50 shrink-0 transform transition-transform group-hover:scale-105">
                                 <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                               </div>
                               <div>
                                 <h4 className="text-base md:text-2xl font-black text-gray-900 tracking-tight">{user.user}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    <Leaf className="h-3 w-3 text-primary" />
                                    <p className="text-[8px] md:text-[10px] font-black uppercase text-primary tracking-widest opacity-60">Impact: {user.impact}</p>
                                 </div>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xl md:text-4xl font-black text-gray-900 tracking-tighter">{user.points.toLocaleString()}</p>
                               <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest opacity-60">Eco Points</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
