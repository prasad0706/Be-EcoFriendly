import { motion } from 'framer-motion';
import { FileText, Download, BarChart3, PieChart, Activity } from 'lucide-react';
import Button from '../components/common/Button';

const ImpactReport = () => {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 mb-10 tracking-tighter"
          >
            2025 <span className="text-primary italic">Impact</span> Report.
          </motion.h1>
          <div className="flex justify-center mb-16">
             <Button size="lg" className="h-16 px-12 rounded-2xl flex items-center gap-3">
               <Download className="h-6 w-6" /> Download Full PDF
             </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {[
             { label: 'Carbon Offset', value: '1,200 Tons', icon: Activity, color: 'text-blue-500' },
             { label: 'Renewable Energy', value: '100%', icon: PieChart, color: 'text-primary' },
             { label: 'Waste Diverted', value: '500k kg', icon: BarChart3, color: 'text-accent' }
           ].map((stat, i) => (
             <div key={i} className="p-12 bg-gray-50 rounded-[3rem] border border-gray-100 text-center">
                <stat.icon className={`h-12 w-12 mx-auto mb-6 ${stat.color}`} />
                <h3 className="text-4xl font-black mb-2">{stat.value}</h3>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">{stat.label}</p>
             </div>
           ))}
        </div>

        <section className="mt-32 p-16 bg-soft-green rounded-[4rem] border border-primary/10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                 <h2 className="text-4xl font-black mb-8 leading-tight">Quantifying our commitment to the earth.</h2>
                 <p className="text-gray-600 font-medium text-lg leading-relaxed mb-10">Our annual impact report provides a transparent look at our successes, our challenges, and our roadmap for the future.</p>
                 <Button variant="outline" className="border-primary text-primary rounded-xl h-14 px-10">View Methodology</Button>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl">
                 <div className="space-y-6">
                    {[
                      { l: 'Plastic Waste', v: 75, c: 'bg-blue-500' },
                      { l: 'Tree Planting', v: 90, c: 'bg-primary' },
                      { l: 'Ethical Sourcing', v: 100, c: 'bg-accent' }
                    ].map((bar, i) => (
                      <div key={i}>
                         <div className="flex justify-between font-black text-xs uppercase tracking-widest mb-3">
                            <span>{bar.l}</span>
                            <span>{bar.v}%</span>
                         </div>
                         <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${bar.v}%` }}
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
