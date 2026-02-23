import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const STORES = [
  {
    id: 1,
    name: "Be-Eco Flagship Store",
    address: "123 Sustainability Way, Green District, London",
    phone: "+44 20 7946 0958",
    hours: "10:00 AM - 8:00 PM",
    distance: "1.2 miles"
  },
  {
    id: 2,
    name: "Eco-Hub Chelsea",
    address: "45 Conscious Ave, Chelsea, London",
    phone: "+44 20 8946 0123",
    hours: "9:00 AM - 7:00 PM",
    distance: "3.5 miles"
  },
  {
    id: 3,
    name: "Be-Eco Shoreditch",
    address: "78 Circular Road, Shoreditch, London",
    phone: "+44 20 9946 0456",
    hours: "11:00 AM - 9:00 PM",
    distance: "4.8 miles"
  }
];

const StoreLocator = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 pt-24 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6 md:mb-10 leading-tight"
          >
            Find a <span className="text-primary underline decoration-primary/20">Store.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 md:mb-16 px-4 leading-relaxed">Experience our sustainable products in person. Visit any of our eco-certified flagship stores and hubs.</p>
          
          <div className="w-full max-w-2xl bg-white p-2 md:p-2.5 rounded-[2rem] md:rounded-[2.5rem] shadow-premium border border-gray-100 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 font-bold" />
              <input 
                type="text" 
                placeholder="City, state, or zip code..." 
                className="w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 rounded-2xl md:rounded-3xl border-none focus:ring-0 text-gray-700 font-bold text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="h-[52px] md:h-[60px] px-8 md:px-10 rounded-xl md:rounded-[2rem] w-full sm:w-auto"
              onClick={() => {
                if (!searchTerm.trim()) return toast.error('Please enter a location');
                toast.success(`Searching for stores in "${searchTerm}"...`);
              }}
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 min-h-[600px] lg:h-[800px]">
           {/* Store List */}
           <div className="lg:w-[450px] flex flex-col gap-4 md:gap-6 overflow-y-auto pr-0 md:pr-4 custom-scrollbar lg:h-full max-h-[500px] lg:max-h-none">
              <div className="flex items-center justify-between px-2 mb-2">
                 <p className="text-xs md:text-sm font-black uppercase tracking-widest text-gray-400">{STORES.length} Stores Found</p>
                 <button className="flex items-center space-x-2 text-primary font-black text-xs uppercase tracking-widest">
                    <Filter className="h-4 w-4" /> <span>Filters</span>
                 </button>
              </div>
              {STORES.map((store) => (
                <motion.div
                  key={store.id}
                  whileHover={{ y: -5 }}
                  className="p-6 md:p-8 bg-white border-2 border-transparent hover:border-primary/20 rounded-[2rem] md:rounded-[2.5rem] shadow-premium hover:shadow-2xl transition-all cursor-pointer group"
                >
                   <div className="flex justify-between items-start mb-4 md:mb-6">
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">{store.name}</h3>
                      <span className="bg-soft-green text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shrink-0">{store.distance}</span>
                   </div>
                   <div className="space-y-3 md:space-y-4 text-gray-500 font-medium text-sm md:text-base">
                      <div className="flex items-start gap-4">
                         <MapPin className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                         <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <Phone className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                         <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <Clock className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                         <span>{store.hours}</span>
                      </div>
                   </div>
                   <div className="mt-6 md:mt-8 flex gap-3">
                      <Button className="flex-1 h-11 md:h-12 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest" variant="primary">Get Directions</Button>
                      <Button className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center p-0 shrink-0" variant="outline">
                         <Navigation className="h-5 w-5" />
                      </Button>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Map Section */}
           <div className="flex-1 rounded-[2.5rem] md:rounded-[4rem] bg-gray-100 relative overflow-hidden group shadow-inner border border-gray-100 aspect-square sm:aspect-video lg:aspect-auto h-[400px] sm:h-[500px] lg:h-full">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158857.7281066703!2d-0.24168147!3d51.5287718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen="" 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title="London Stores Map"
                 className="grayscale hover:grayscale-0 transition-all duration-1000"
               />
               
               {/* Store Markers Mock - Overlay on map for aesthetic */}
               <div className="absolute top-1/4 left-1/3 pointer-events-none p-1.5 md:p-2 bg-primary text-white rounded-full shadow-xl animate-bounce">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4" />
               </div>
               <div className="absolute top-1/2 left-2/3 pointer-events-none p-1.5 md:p-2 bg-primary text-white rounded-full shadow-xl animate-bounce delay-100">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4" />
               </div>
               <div className="absolute top-2/3 left-1/2 pointer-events-none p-1.5 md:p-2 bg-primary text-white rounded-full shadow-xl animate-bounce delay-200">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4" />
               </div>
           </div>
        </div>
      </section>

      {/* Footer Callout */}
      <section className="py-20 md:py-32 px-4 shadow-inner bg-soft-green/50">
        <div className="max-w-3xl mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-black mb-6 md:mb-8">Opening a Store Near You?</h2>
           <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed mb-10 md:mb-12 px-4 md:px-6">We're expanding rapidly across major cities. Be the first to know when we open a store in your neighbourhood.</p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <input type="email" placeholder="Your email address" className="h-14 md:h-16 px-6 md:px-8 rounded-xl md:rounded-2xl bg-white border-none shadow-premium w-full sm:max-w-md font-bold text-gray-700 text-sm md:text-base outline-none focus:ring-2 focus:ring-primary/20" />
              <Button className="h-14 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl w-full sm:w-auto">Notify Me</Button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default StoreLocator;
