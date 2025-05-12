"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initPerformanceOptimizations } from '@/lib/utils/performance';

/**
 * AnimatedLayout component wraps the entire application to provide:
 * 1. Page transitions
 * 2. Performance optimizations
 * 3. Scroll restoration
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 */
export default function AnimatedLayout({ children }) {
  // Initialize performance optimizations
  useEffect(() => {
    // Initialize all performance optimizations
    const cleanup = initPerformanceOptimizations();
    
    // Scroll restoration on page navigation
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    window.scrollTo(0, 0);
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        key="main-layout"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
