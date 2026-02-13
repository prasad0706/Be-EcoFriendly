import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import Button from '../common/Button';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
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
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [banners.length, handleNext]);

  if (isLoading) {
    return (
      <div className="h-[70vh] md:h-[85vh] bg-gray-100 animate-pulse w-full pt-24" />
    );
  }

  if (banners.length === 0) {
    return (
      <section className="h-[70vh] bg-primary flex items-center justify-center text-white pt-24">
        No Banners Available
      </section>
    );
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-black group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={banners[currentIndex].image}
            alt={banners[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center">
            <div className="container mx-auto px-6 md:px-12 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-3xl"
              >
                <span className="inline-block px-5 py-2 bg-accent text-white text-xs font-black uppercase tracking-[0.2em] rounded-full mb-6">
                  {banners[currentIndex].subtitle?.split(' ')[0] || 'NEW'} COLLECTION
                </span>
                <h1 className="text-5xl md:text-8xl font-black text-white leading-[1] mb-8 tracking-tighter uppercase">
                  {banners[currentIndex].title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-12 font-medium max-w-2xl">
                  {banners[currentIndex].subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link to={banners[currentIndex].link || '/shop'}>
                    <Button variant="white" className="px-12 py-5 text-xl font-black flex items-center gap-3 group border-none min-w-[200px] justify-center shadow-2xl">
                      {banners[currentIndex].ctaText || 'SHOP NOW'}
                      <ShoppingBag className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button variant="none" className="px-12 py-5 text-xl font-black border-2 border-white text-white hover:bg-white hover:text-black transition-all min-w-[200px] justify-center backdrop-blur-md bg-white/10">
                      EXPLORE MORE
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
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-accent transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-accent transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`transition-all duration-500 rounded-full h-1.5 ${
              currentIndex === idx ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
