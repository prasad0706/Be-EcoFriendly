import { ShieldCheck, RefreshCcw, Truck, FileText } from 'lucide-react';

const InfoStrip = () => {
  const items = [
    {
      icon: ShieldCheck,
      title: '12 Months Warranty',
      desc: 'Domestic Warranty'
    },
    {
      icon: RefreshCcw,
      title: '7 Day Replacement',
      desc: 'No questions asked'
    },
    {
      icon: Truck,
      title: 'Free Express Delivery',
      desc: 'On all orders above ₹1000'
    },
    {
      icon: FileText,
      title: 'GST Billing',
      desc: 'Available for business'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-12 border-y border-gray-100 bg-background/30 rounded-3xl my-12 px-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <item.icon className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 leading-tight uppercase tracking-tight">{item.title}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoStrip;
