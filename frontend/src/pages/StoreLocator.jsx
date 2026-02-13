import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/common/Button';

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
      <section className="bg-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-10"
          >
            Find a <span className="text-primary underline decoration-primary/20">Store.</span>
          </motion.h1>
          <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto mb-16 px-4">Experience our sustainable products in person. Visit any of our eco-certified flagship stores and hubs.</p>
          
          <div className="w-full max-w-2xl bg-white p-2 rounded-[2.5rem] shadow-premium border border-gray-100 flex items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 font-bold" />
              <input 
                type="text" 
                placeholder="City, state, or zip code..." 
                className="w-full pl-16 pr-6 py-5 rounded-3xl border-none focus:ring-0 text-gray-700 font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-[60px] px-10 rounded-[2rem]">Search</Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 h-[800px]">
           {/* Store List */}
           <div className="lg:w-[450px] flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar h-full">
              <div className="flex items-center justify-between px-2 mb-2">
                 <p className="text-sm font-black uppercase tracking-widest text-gray-400">{STORES.length} Stores Found</p>
                 <button className="flex items-center space-x-2 text-primary font-black text-xs uppercase tracking-widest">
                    <Filter className="h-4 w-4" /> <span>Filters</span>
                 </button>
              </div>
              {STORES.map((store) => (
                <motion.div
                  key={store.id}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white border-2 border-transparent hover:border-primary/20 rounded-[2.5rem] shadow-premium hover:shadow-2xl transition-all cursor-pointer group"
                >
                   <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">{store.name}</h3>
                      <span className="bg-soft-green text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{store.distance}</span>
                   </div>
                   <div className="space-y-4 text-gray-500 font-medium">
                      <div className="flex items-center gap-4">
                         <MapPin className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                         <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <Phone className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                         <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <Clock className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                         <span>{store.hours}</span>
                      </div>
                   </div>
                   <div className="mt-8 flex gap-3">
                      <Button className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest" variant="primary">Get Directions</Button>
                      <Button className="w-12 h-12 rounded-xl flex items-center justify-center p-0" variant="outline">
                         <Navigation className="h-5 w-5" />
                      </Button>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Map Placeholder */}
           <div className="flex-1 rounded-[4rem] bg-gray-100 relative overflow-hidden group shadow-inner">
               <div className="absolute inset-0 bg-mesh opacity-10 group-hover:scale-110 transition-transform duration-[10s]" />
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="p-8 bg-white/20 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl mb-6">
                       <MapPin className="h-16 w-16 text-primary" />
                   </div>
                   <h3 className="text-3xl font-black text-gray-900">Interactive Map</h3>
                   <p className="text-gray-500 font-medium mt-2">API Connection Pending...</p>
               </div>
               
               {/* Store Markers Mock */}
               <div className="absolute top-1/4 left-1/3 p-2 bg-primary text-white rounded-full shadow-xl animate-bounce">
                  <MapPin className="h-6 w-6" />
               </div>
               <div className="absolute top-1/2 left-2/3 p-2 bg-primary text-white rounded-full shadow-xl animate-bounce delay-100">
                  <MapPin className="h-6 w-6" />
               </div>
               <div className="absolute top-2/3 left-1/2 p-2 bg-primary text-white rounded-full shadow-xl animate-bounce delay-200">
                  <MapPin className="h-6 w-6" />
               </div>
           </div>
        </div>
      </section>

      {/* Footer Callout */}
      <section className="py-32 px-4 shadow-inner bg-soft-green/50">
        <div className="max-w-3xl mx-auto text-center">
           <h2 className="text-4xl font-black mb-8">Opening a Store Near You?</h2>
           <p className="text-gray-500 font-medium text-lg leading-relaxed mb-12 px-6">We're expanding rapidly across major cities. Be the first to know when we open a store in your neighbourhood.</p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input type="email" placeholder="Your email address" className="h-16 px-8 rounded-2xl bg-white border-none shadow-premium w-full sm:max-w-md font-bold text-gray-700" />
              <Button className="h-16 px-10 rounded-2xl">Notify Me</Button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default StoreLocator;
