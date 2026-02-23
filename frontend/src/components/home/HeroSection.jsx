import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import Button from '../common/Button';
import { ShoppingBag, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const { data: homeData, isLoading } = useQuery({
    queryKey: ['homeData'],
    queryFn: async () => {
      const response = await api.get('/home');
      return response.data.data;
    }
  });

  const banners = homeData?.banners || [];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length, handleNext]);

  if (isLoading) {
    return (
      <div className="h-[45vh] md:h-[85vh] bg-gray-100 animate-pulse w-full mt-16 md:mt-28" />
    );
  }

  if (banners.length === 0) {
    return (
      <section className="h-[40vh] md:h-[70vh] bg-primary flex items-center justify-center text-white mt-16 md:mt-28">
        No Banners Available
      </section>
    );
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100vw' : '-100vw',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100vw' : '-100vw',
      opacity: 0
    })
  };

  return (
    <section className="relative w-full h-[50vh] md:h-[85vh] overflow-hidden bg-gray-50 group mt-14 md:mt-28">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.6, ease: "easeInOut" },
            opacity: { duration: 0.4 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={banners[currentIndex].image}
            alt={banners[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/80 md:from-black/60 via-black/20 to-transparent flex items-center">
            <div className="container mx-auto px-6 md:px-12 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="max-w-4xl"
              >
                <div className="flex justify-center md:justify-start mb-4 md:mb-6">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[8px] md:text-xs font-black uppercase tracking-[0.3em] rounded border border-white/20 flex items-center gap-1.5 shadow-xl">
                    <Zap className="h-2.5 w-2.5 md:h-3 md:w-3 text-accent fill-accent animate-pulse" />
                    {banners[currentIndex].subtitle?.split(' ')[0] || 'HOT'} RELEASE
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight md:leading-none mb-4 md:mb-6 tracking-tighter uppercase drop-shadow-xl italic">
                  {banners[currentIndex].title}
                </h1>
                <p className="hidden sm:block text-sm md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-10 font-bold max-w-2xl px-2 md:px-0 mx-auto md:mx-0 leading-relaxed italic opacity-80">
                   {banners[currentIndex].subtitle}
                </p>
                <div className="flex flex-row gap-3 md:gap-6 px-4 md:px-0 items-center justify-center md:justify-start">
                  <Link to={banners[currentIndex].link || '/shop'} className="flex-1 sm:flex-none">
                    <Button variant="white" className="w-full sm:px-10 py-3 md:py-5 text-[10px] md:text-lg font-black flex items-center gap-2 group border-none justify-center shadow-xl rounded-lg md:rounded-2xl transition-all h-10 md:h-auto uppercase tracking-widest">
                      Buy Now
                      <ShoppingBag className="h-3.5 w-3.5 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/shop" className="flex-1 sm:flex-none">
                    <Button variant="none" className="w-full sm:px-10 py-3 md:py-5 text-[10px] md:text-lg font-black border border-white/30 text-white hover:bg-white hover:text-black transition-all justify-center backdrop-blur-md bg-white/5 rounded-lg md:rounded-2xl h-10 md:h-auto uppercase tracking-widest">
                      Explore
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNext}
        className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Pagination Dots - boAt Style */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx ? 'w-6 md:w-10 bg-white h-1 md:h-1.5' : 'w-1 md:w-1.5 h-1 md:h-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
