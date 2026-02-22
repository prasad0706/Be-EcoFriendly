import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight, Star, Users, Map } from 'lucide-react';
import Button from '../components/common/Button';
import { JOBS } from '../data/jobs';

const Careers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8"
          >
            We're Hiring
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-gray-900 mb-10 tracking-tighter"
          >
            Build the <span className="gradient-text">Future</span><br />
            of Sustainable Retail.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-xl font-medium max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Join a passionate team of innovators, designers, and thinkers working to make conscious consumption the global standard.
          </motion.p>
          <div className="flex justify-center gap-6">
            <Button 
              size="lg" 
              className="h-16 px-12 rounded-2xl shadow-xl shadow-primary/10"
              onClick={() => navigate('/open-roles')}
            >
              View Open Roles
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 px-12 rounded-2xl border-gray-200"
              onClick={() => navigate('/culture')}
            >
              Our Culture
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: 'Remote First', icon: Map, value: '50+ Global Hubs' },
            { label: 'Strong Community', icon: Users, value: '100% Shared Vision' },
            { label: 'Growth Rating', icon: Star, value: '4.9/5 Glassdoor' }
          ].map((stat, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex items-center space-x-8 group hover:bg-primary transition-all duration-500">
              <div className="p-4 bg-white rounded-2xl group-hover:bg-white/20 transition-colors shadow-sm">
                <stat.icon className="h-8 w-8 text-primary group-hover:text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-white/60">{stat.label}</p>
                <h3 className="text-2xl font-black text-gray-900 group-hover:text-white">{stat.value}</h3>
              </div>
            </div>
          ))}
        </section>

        {/* Job Listings */}
        <section id="roles" className="py-32">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-black tracking-tight">Open Opportunities</h2>
            <div className="h-px flex-1 bg-gray-100 mx-10 hidden sm:block" />
          </div>

          <div className="space-y-6">
            {JOBS.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/job/${job.id}`)}
                className="group p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">{job.dept}</span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center text-xs font-bold text-gray-400">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {job.type}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="flex items-center mt-3 text-gray-500 font-medium">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {job.location}
                  </div>
                </div>
                <div className="flex items-center">
                   <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                     <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-white transition-all group-hover:translate-x-1" />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center p-16 bg-soft-green rounded-[3rem] border border-primary/10">
            <h3 className="text-2xl font-black mb-4">Don't see your role?</h3>
            <p className="text-gray-600 font-medium mb-10 max-w-xl mx-auto">We're always looking for talented individuals who are passionate about our mission. Send us an open application!</p>
            <Button variant="outline" className="border-primary text-primary h-14 px-10 rounded-xl hover:bg-primary hover:text-white">General Application</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Careers;
