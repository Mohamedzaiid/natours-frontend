"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from '@/lib/animations/motion';

/**
 * Animated image carousel for hero sections and galleries
 * Features smooth transitions between images with fade and scale effects
 * 
 * @param {Array} images - Array of image URLs
 * @param {number} interval - Time in ms between automatic transitions
 * @param {string} overlay - CSS background for overlay (e.g., "bg-black/40")
 * @param {boolean} autoPlay - Whether to automatically cycle through images
 * @param {function} onImageChange - Optional callback when image changes
 */
export const ImageCarousel = ({ 
  images = [
    "/hero-bg.jpg",
    "/hero-bg-2.jpg", 
    "/hero-bg-3.jpg"
  ],
  interval = 5000,
  overlay = "bg-black/40",
  autoPlay = true,
  onImageChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Auto transition effect
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      nextImage();
    }, interval);
    
    // Cleanup
    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval]);

  // Image navigation functions
  const nextImage = () => {
    setDirection(1);
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    if (onImageChange) onImageChange(currentIndex);
  };
  
  const prevImage = () => {
    setDirection(-1);
    setCurrentIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
    if (onImageChange) onImageChange(currentIndex);
  };
  
  // Navigation for touch devices
  const handleTouchStart = (e) => {
    const touchDownX = e.touches[0].clientX;
    document.touchStartX = touchDownX;
  };
  
  const handleTouchMove = (e) => {
    if (!document.touchStartX) return;
    
    const touchDown = document.touchStartX;
    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;
    
    // If swiped left (next image)
    if (diff > 50) {
      nextImage();
      document.touchStartX = 0;
    }
    
    // If swiped right (previous image)
    if (diff < -50) {
      prevImage();
      document.touchStartX = 0;
    }
  };

  const variants = {
    enter: (direction) => ({
      opacity: 0,
      scale: 1.05,
      filter: 'blur(8px)',
    }),
    center: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (direction) => ({
      opacity: 0,
      scale: 1.05,
      filter: 'blur(8px)',
    }),
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 1.2, ease: 'easeInOut' },
            scale: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
            filter: { duration: 1.2, ease: 'easeInOut' }
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt="Hero Background"
            fill
            priority
            className="object-cover"
          />
          <div className={`absolute inset-0 ${overlay}`} />
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300`}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0.5,
              scale: index === currentIndex ? 1.5 : 1,
              backgroundColor: index === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'
            }}
            whileHover={{ 
              scale: 1.2, 
              opacity: 0.8,
              backgroundColor: 'rgba(255, 255, 255, 0.8)'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;