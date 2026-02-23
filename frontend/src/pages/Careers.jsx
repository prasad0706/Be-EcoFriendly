import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight, Star, Users, Map, Sparkles, Globe } from 'lucide-react';
import Button from '../components/common/Button';
import { JOBS } from '../data/jobs';

const Careers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 md:mb-10 shadow-sm border border-accent/5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Join the Movement
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 md:mb-10 tracking-tighter leading-[1.1] md:leading-[1.0] uppercase"
          >
            Build the <span className="gradient-text italic">Future</span><br />
            of Sustainable Retail.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-xl lg:text-2xl text-gray-400 font-bold max-w-3xl mx-auto leading-relaxed mb-10 md:mb-14 px-4"
          >
            Join a passionate team of innovators, designers, and thinkers working to make conscious consumption the global standard.
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4 md:px-0">
            <Button 
              size="lg" 
              className="h-14 md:h-18 px-10 md:px-14 rounded-xl md:rounded-2xl shadow-xl shadow-primary/20 w-full sm:w-auto font-black uppercase tracking-widest text-xs md:text-sm"
              onClick={() => navigate('/open-roles')}
            >
              View Open Roles
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 md:h-18 px-10 md:px-14 rounded-xl md:rounded-2xl border-2 border-gray-100 text-gray-600 hover:text-primary hover:border-primary/20 font-black uppercase tracking-widest text-xs md:text-sm w-full sm:w-auto"
              onClick={() => navigate('/culture')}
            >
              Our Culture
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {[
            { label: 'Remote Access', icon: Globe, value: '50+ Global Hubs', color: 'text-blue-500' },
            { label: 'Shared Vision', icon: Users, value: '100% Impact Driven', color: 'text-primary' },
            { label: 'Growth Rating', icon: Star, value: '4.9/5 Rating', color: 'text-accent' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-gray-50/50 border border-gray-100 flex items-center space-x-6 md:space-x-8 group hover:bg-white hover:shadow-premium transition-all duration-500"
            >
              <div className="p-4 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-50 flex-shrink-0">
                <stat.icon className={`h-8 w-8 md:h-10 md:w-10 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">{stat.label}</p>
                <h3 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter truncate">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Job Listings Preview */}
        <section id="roles" className="py-12 md:py-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-16 gap-6 text-center sm:text-left">
            <div>
               <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Open <span className="text-primary">Opportunities.</span></h2>
               <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Find your place in our growing ecosystem</p>
            </div>
            <div className="h-[2px] flex-1 bg-gray-50 mx-10 hidden lg:block" />
            <Button 
                variant="outline" 
                onClick={() => navigate('/open-roles')}
                className="rounded-xl border-gray-100 font-black text-xs uppercase tracking-widest px-8 md:px-10 h-12 md:h-14 hover:border-primary/20 hover:text-primary"
            >
                See All Roles
            </Button>
          </div>

          <div className="space-y-4 md:space-y-6">
            {JOBS.slice(0, 4).map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/job/${job.id}`)}
                className="group p-6 md:p-10 bg-white border border-gray-100 rounded-[2rem] md:rounded-[3rem] hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 cursor-pointer relative overflow-hidden"
              >
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary/5 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/10">{job.dept}</span>
                    <span className="text-gray-200 hidden sm:inline">•</span>
                    <div className="flex items-center text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest opacity-60">
                      <Clock className="h-3.5 w-3.5 mr-2" />
                      {job.type}
                    </div>
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight leading-none italic">{job.title}</h3>
                  <div className="flex items-center mt-4 text-gray-500 font-bold text-xs md:text-base opacity-70">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    {job.location}
                  </div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between md:justify-end border-t border-gray-50 md:border-none pt-4 md:pt-0">
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-sm">
                     <ArrowRight className="h-5 w-5 md:h-7 md:w-7 text-gray-300 group-hover:text-white transition-all group-hover:translate-x-1" />
                   </div>
                </div>
                
                {/* Decorative Pattern on Card */}
                <div className="absolute -right-8 -top-8 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                   <Briefcase className="w-32 h-32 md:w-48 md:h-48" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 md:mt-24 text-center p-8 md:p-20 bg-soft-green/50 rounded-[2.5rem] md:rounded-[4.5rem] border-2 border-dashed border-primary/10 relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors" />
            <h3 className="text-2xl md:text-5xl font-black mb-6 md:mb-8 tracking-tighter uppercase italic">Innovation <span className="text-primary italic">Manifesto.</span></h3>
            <p className="text-sm md:text-xl text-gray-500 font-bold mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed px-4">We're always looking for talented individuals who are passionate about our mission. If you don't see a fit, send us an open application!</p>
            <Button variant="outline" className="border-2 border-primary text-primary h-14 md:h-18 px-10 md:px-14 rounded-xl md:rounded-2xl hover:bg-primary hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[10px] md:text-sm w-full sm:w-auto shadow-xl shadow-primary/5">General Application</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Careers;
