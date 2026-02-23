import { motion } from 'framer-motion';
import { FileText, Download, BarChart3, PieChart, Activity } from 'lucide-react';
import Button from '../components/common/Button';

const ImpactReport = () => {
  return (
    <div className="min-h-screen bg-white pt-20 md:pt-28 pb-10 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-12 md:py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 mb-8 md:mb-10 tracking-tighter leading-tight"
          >
            2025 <span className="text-primary italic">Impact</span> Report.
          </motion.h1>
          <div className="flex justify-center mb-12 md:mb-16">
             <Button size="lg" className="h-14 md:h-16 px-8 md:px-12 rounded-2xl flex items-center gap-3 w-full sm:w-auto justify-center">
               <Download className="h-5 w-5 md:h-6 md:w-6" /> Download Full PDF
             </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
           {[
             { label: 'Carbon Offset', value: '1,200 Tons', icon: Activity, color: 'text-blue-500' },
             { label: 'Renewable Energy', value: '100%', icon: PieChart, color: 'text-primary' },
             { label: 'Waste Diverted', value: '500k kg', icon: BarChart3, color: 'text-accent' }
           ].map((stat, i) => (
             <div key={i} className="p-8 md:p-12 bg-gray-50 rounded-[2rem] md:rounded-[3rem] border border-gray-100 text-center">
                <stat.icon className={`h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 md:mb-6 ${stat.color}`} />
                <h3 className="text-3xl md:text-4xl font-black mb-2">{stat.value}</h3>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[9px] md:text-[10px]">{stat.label}</p>
             </div>
           ))}
        </div>

        <section className="mt-20 md:mt-32 p-8 md:p-16 bg-soft-green rounded-[2.5rem] md:rounded-[4rem] border border-primary/10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="text-center lg:text-left">
                 <h2 className="text-3xl md:text-4xl font-black mb-6 md:mb-8 leading-tight">Quantifying our commitment to the earth.</h2>
                 <p className="text-gray-600 font-medium text-base md:text-lg leading-relaxed mb-8 md:mb-10 mx-auto lg:mx-0">Our annual impact report provides a transparent look at our successes, our challenges, and our roadmap for the future.</p>
                 <Button variant="outline" className="border-primary text-primary rounded-xl h-12 md:h-14 px-8 md:px-10 w-full sm:w-auto">View Methodology</Button>
              </div>
              <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl">
                 <div className="space-y-4 md:space-y-6">
                    {[
                      { l: 'Plastic Waste', v: 75, c: 'bg-blue-500' },
                      { l: 'Tree Planting', v: 90, c: 'bg-primary' },
                      { l: 'Ethical Sourcing', v: 100, c: 'bg-accent' }
                    ].map((bar, i) => (
                      <div key={i} className="w-full">
                         <div className="flex justify-between font-black text-[10px] md:text-xs uppercase tracking-widest mb-2 md:mb-3">
                            <span>{bar.l}</span>
                            <span>{bar.v}%</span>
                         </div>
                         <div className="h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${bar.v}%` }}
                               transition={{ duration: 1, delay: 0.5 }}
                               className={`h-full ${bar.c}`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default ImpactReport;
