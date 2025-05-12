"use client";

import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook that determines if an element is in the viewport
 * Perfect for triggering animations or lazy loading content
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - A value between 0 and 1 indicating the percentage of the element that needs to be visible
 * @param {string} options.rootMargin - Margin around the root element
 * @param {boolean} options.triggerOnce - Whether to unobserve after the element becomes visible
 * @returns {Array} [ref, isInView] - A ref to attach to the element and a boolean indicating if the element is in view
 */
export function useInView({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = false
} = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    // Skip if the element ref isn't assigned
    if (!ref.current) return;
    
    // Check if IntersectionObserver is available (it should be in most browsers)
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver not supported, defaulting to visible');
      setIsInView(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection status changes
        const isElementVisible = entry.isIntersecting;
        setIsInView(isElementVisible);
        
        // Unobserve after it becomes visible if triggerOnce is true
        if (isElementVisible && triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(ref.current);
    
    // Cleanup
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);
  
  return [ref, isInView];
}

export default useInView;
