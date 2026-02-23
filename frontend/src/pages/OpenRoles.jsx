import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JOBS } from '../data/jobs';

const OpenRoles = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 mb-8 md:mb-16 tracking-tighter leading-tight text-center md:text-left">
          All <span className="text-primary italic">Open</span> Roles
        </h1>

        <div className="space-y-4 md:space-y-6">
          {JOBS.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/job/${job.id}`)}
              className="group p-6 md:p-8 bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg">{job.dept}</span>
                  <span className="text-gray-200 hidden sm:block">•</span>
                  <div className="flex items-center text-[10px] md:text-xs font-bold text-gray-400">
                    <Clock className="h-3 md:h-3.5 w-3 md:w-3.5 mr-1.5" />
                    {job.type}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
                <div className="flex items-center mt-3 text-sm md:text-base text-gray-500 font-medium">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                  {job.location}
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end">
                 <span className="text-primary font-black text-xs uppercase tracking-widest md:hidden">View Details</span>
                 <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                   <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-white transition-all group-hover:translate-x-1" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenRoles;
