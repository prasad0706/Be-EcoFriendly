import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, Settings, Leaf } from 'lucide-react';

const SpecsAccordion = ({ specifications, ecoScore }) => {
  const [openSection, setOpenSection] = useState('features');

  const sections = [
    {
      id: 'features',
      title: 'Key Features',
      icon: Settings,
      content: specifications?.features || 'No specific features listed.'
    },
    {
      id: 'technical',
      title: 'Technical Details',
      icon: FileText,
      items: [
        { label: 'Material', value: specifications?.material || 'N/A' },
        { label: 'Dimensions', value: specifications?.dimensions || 'N/A' },
        { label: 'Weight', value: specifications?.weight || 'N/A' },
        { label: 'Warranty', value: specifications?.warranty || 'N/A' },
      ]
    },
    {
      id: 'eco',
      title: 'Our Planet Story (LCA)',
      icon: Leaf,
      content: `Measuring impact via the "Cradle to Grave" Framework. This product's eco-score of ${ecoScore}/100 accounts for Raw Material Extraction, Manufacturing energy, Distribution logistics, and End-of-Life recyclability. By choosing this sustained alternative, you are actively reducing carbon debt compared to industry standards.`
    }
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isOpen = openSection === section.id;
        const Icon = section.icon;

        return (
          <div 
            key={section.id} 
            className="border-b border-gray-100 last:border-0"
          >
            <button
              onClick={() => setOpenSection(isOpen ? null : section.id)}
              className="w-full py-6 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400 group-hover:text-primary'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-black text-gray-900 text-lg tracking-tight uppercase">{section.title}</h4>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 pl-14">
                    {section.items ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                            <span className="text-sm font-black text-gray-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 font-medium leading-relaxed max-w-2xl">
                        {section.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default SpecsAccordion;
