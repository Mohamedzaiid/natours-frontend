'use client';

import { useState, useEffect, useRef } from 'react';
import { getTopTours } from '@/lib/api/tours';
import TourCard from './TourCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from '@/lib/animations/motion';
import { useInView } from '@/lib/animations/useInView';

import { useTheme } from '@/app/providers/theme/ThemeProvider';

export function FeaturedTours() {
  const { isDark } = useTheme();
  const sliderRef = useRef(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ref, isInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Force rendering regardless of InView status for better reliability
  const forceRender = true;

  useEffect(() => {
    async function loadFeaturedTours() {
      try {
        setLoading(true);
        const topTours = await getTopTours();
        console.log('Fetched tours data:', topTours);
        
        if (topTours && topTours.length > 0) {
          setTours(topTours);
          setLoading(false);
        } else {
          // Handle empty response
          console.warn('No tour data returned from API');
          setError('No tours available at the moment.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading featured tours:', error);
        setError('Failed to load featured tours. Please try again later.');
        setLoading(false);
      }
    }

    loadFeaturedTours();
  }, []);

  // Navigation functions for modern slider design
  const scrollAmount = 310; // Width of card + gap
  
  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Auto scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        // Check if we've reached the end
        const isAtEnd = sliderRef.current.scrollLeft + sliderRef.current.offsetWidth >= 
                        sliderRef.current.scrollWidth - 50;
        
        if (isAtEnd) {
          // Reset to beginning with a smooth scroll
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Continue scrolling
          nextSlide();
        }
      }
    }, 6000); // Auto scroll every 6 seconds
    
    return () => clearInterval(interval);
  }, [tours]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <motion.div 
          className="rounded-full h-10 w-10 border-b-2 border-emerald-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return <p className="text-center py-6 text-red-600">{error}</p>;
  }

  if (tours.length === 0) {
    return <p className="text-center py-6 text-gray-500">No featured tours available at the moment.</p>;
  }

  return (
    <motion.div 
      ref={ref}
      className="py-12 relative"
      initial={{ opacity: 0, y: 50 }}
      animate={forceRender || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.div 
          className='container-custom'
          initial={{ opacity: 0, y: 30 }}
          animate={forceRender || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={`section-title text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>Our Most Popular Tours</h2>
          <p className={`section-subtitle text-center mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Discover our most highly-rated adventures loved by travelers worldwide</p>
        </motion.div>
        
        {/* Navigation arrows - Desktop */}
        <div className="hidden md:flex items-center gap-3 mt-4 md:mt-0">
          <motion.button 
            onClick={prevSlide}
            className={`w-10 h-10 rounded-full border shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700'}`}
            aria-label="Previous"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button 
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center"
            aria-label="Next"
            whileHover={{ scale: 1.1, backgroundColor: "#047857" }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
      
      {/* Tours Slider */}
      <motion.div 
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto pb-6 -mx-4 px-4 snap-x scroll-smooth hide-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={forceRender || isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {tours.map((tour, index) => (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 30 }}
            animate={forceRender || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
          >
            <TourCard 
              tour={tour} 
              className="min-w-[300px] flex-shrink-0 snap-start"
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Mobile Navigation */}
      <div className="flex md:hidden justify-center gap-3 mt-6">
        <motion.button 
          onClick={prevSlide}
          className={`w-10 h-10 rounded-full border shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700'}`}
          aria-label="Previous"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        <motion.button 
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center"
          aria-label="Next"
          whileHover={{ scale: 1.1, backgroundColor: "#047857" }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
      
      {/* View All Button */}
      <div className="text-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={forceRender || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/tours"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Explore All Tours
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default FeaturedTours;