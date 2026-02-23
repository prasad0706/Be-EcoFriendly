import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { JOBS } from '../data/jobs';
import Button from '../components/common/Button';
import { useEffect, useState } from 'react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating "fetch from backend"
    const timer = setTimeout(() => {
      const foundJob = JOBS.find(j => j.id === parseInt(id));
      setJob(foundJob);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-40 text-center px-4">
        <h2 className="text-2xl md:text-3xl font-black mb-4">Job Not Found</h2>
        <Button onClick={() => navigate('/careers')}>Back to Careers</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 md:mb-12 font-bold group text-sm md:text-base"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg">{job.dept}</span>
            <span className="text-gray-200 hidden sm:block">•</span>
            <div className="flex items-center text-[10px] md:text-xs font-bold text-gray-400">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {job.type}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
            {job.title}
          </h1>

          <div className="flex items-center text-gray-500 font-medium mb-10 md:mb-12 text-base md:text-lg">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-3 text-gray-400 shrink-0" />
            {job.location}
          </div>

          <div className="prose prose-sm md:prose-lg max-w-none">
            <h2 className="text-xl md:text-2xl font-black mb-4 text-gray-900">Description</h2>
            <p className="text-gray-600 mb-8 md:mb-10 leading-relaxed font-medium text-sm md:text-base">
              {job.description}
            </p>

            <h2 className="text-xl md:text-2xl font-black mb-4 text-gray-900">Requirements</h2>
            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex gap-3 text-gray-600 font-medium leading-relaxed text-sm md:text-base">
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>

            <h2 className="text-xl md:text-2xl font-black mb-4 text-gray-900">Benefits</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-12 md:mb-16">
              {job.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 p-4 bg-soft-green/30 rounded-xl md:rounded-2xl border border-primary/5 text-gray-700 font-bold text-xs md:text-base">
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-primary shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 md:p-12 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 text-center">
            <h3 className="text-2xl md:text-3xl font-black mb-4">Apply for this position</h3>
            <p className="text-gray-500 mb-8 font-medium text-sm md:text-base">Ready to join our team? Click the button below to start your application.</p>
            <Button size="lg" className="rounded-xl md:rounded-2xl px-8 md:px-12 h-14 md:h-16 shadow-xl shadow-primary/10 w-full sm:w-auto font-black uppercase tracking-widest text-xs md:text-sm">Apply Now</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetail;
