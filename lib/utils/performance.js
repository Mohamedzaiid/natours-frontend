"use client";

/**
 * Performance utilities for optimizing the user experience
 * Implements performance best practices like debouncing, throttling, and lazy loading
 */

/**
 * Debounces a function call to avoid excessive executions
 * Useful for search inputs, window resize events, etc.
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @param {boolean} immediate - Whether to trigger the function immediately
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttles a function to limit the number of executions
 * Useful for scroll events, mousemove, etc.
 *
 * @param {Function} func - The function to throttle
 * @param {number} limit - Minimum time between executions in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit = 100) {
  let lastFunc;
  let lastRan;
  
  return function executedFunction(...args) {
    const context = this;
    
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Lazily loads images when they enter the viewport
 * Uses Intersection Observer API for better performance
 *
 * @param {string} selector - CSS selector for images to lazy load
 * @param {Object} options - IntersectionObserver options
 */
export function lazyLoadImages(selector = 'img[data-src]', options = {}) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  
  const defaultOptions = {
    rootMargin: '200px 0px',
    threshold: 0.01
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const loadImage = (img) => {
    if (!img.dataset.src) return;
    
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute('data-srcset');
    }
    
    img.classList.add('loaded');
    img.classList.remove('lazy');
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImage(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, mergedOptions);
  
  const images = document.querySelectorAll(selector);
  images.forEach(img => observer.observe(img));
  
  return () => {
    if (observer) {
      observer.disconnect();
    }
  };
}

/**
 * Prefetches links that are visible in the viewport or on hover
 * Improves perceived performance for navigation
 * 
 * @param {string} selector - CSS selector for links to prefetch
 */
export function prefetchVisibleLinks(selector = 'a[data-prefetch]') {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  
  const prefetch = (url) => {
    if (!url || url.startsWith('#') || url.includes('mailto:') || url.includes('tel:')) return;
    
    // Check if already prefetched
    if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return;
    
    // Create prefetch link
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    
    document.head.appendChild(link);
  };
  
  // Prefetch on intersection
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target;
        prefetch(link.href);
        observer.unobserve(link);
      }
    });
  }, { rootMargin: '200px 0px' });
  
  // Prefetch on hover
  const onHover = (e) => {
    prefetch(e.target.href);
    e.target.removeEventListener('mouseenter', onHover);
  };
  
  // Get all links matching the selector
  const links = document.querySelectorAll(selector);
  
  links.forEach(link => {
    observer.observe(link);
    link.addEventListener('mouseenter', onHover);
  });
  
  return () => {
    if (observer) {
      observer.disconnect();
    }
    
    links.forEach(link => {
      link.removeEventListener('mouseenter', onHover);
    });
  };
}

/**
 * Optimizes image loading with blur placeholders
 * Reduces layout shifts and provides better UX during loading
 * 
 * @param {Node} container - Container element to optimize images within
 */
export function optimizeImageLoading(container = document) {
  if (typeof window === 'undefined') return;
  
  const images = container.querySelectorAll('img:not([loading="lazy"])');
  
  images.forEach(img => {
    // Add lazy loading attribute
    img.setAttribute('loading', 'lazy');
    
    // Add blur up effect if not already present
    if (!img.classList.contains('blur-up') && !img.classList.contains('loaded')) {
      img.classList.add('blur-up');
      
      // Create placeholder if not already present
      if (!img.previousElementSibling || !img.previousElementSibling.classList.contains('placeholder')) {
        const placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        placeholder.style.paddingBottom = `${(img.height / img.width) * 100}%`;
        img.parentNode.insertBefore(placeholder, img);
      }
      
      // Handle image load
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        
        // Remove placeholder after transition
        const placeholder = img.previousElementSibling;
        if (placeholder && placeholder.classList.contains('placeholder')) {
          setTimeout(() => {
            placeholder.remove();
          }, 300);
        }
      });
    }
  });
}

/**
 * Preloads key images for faster display
 * Critical for above-fold images and visual elements
 * 
 * @param {Array} urls - Array of image URLs to preload
 */
export function preloadCriticalImages(urls = []) {
  if (typeof window === 'undefined') return;
  
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

/**
 * Optimizes animation performance with will-change
 * Applies will-change property when animation is about to start
 * Removes it when animation is done to save GPU memory
 * 
 * @param {string} selector - Elements to optimize
 * @param {string} property - CSS property that will change
 * @param {string} trigger - Event that triggers the animation
 * @param {number} cleanup - Time in ms after which to remove will-change
 */
export function optimizeAnimations(selector, property = 'transform', trigger = 'mouseenter', cleanup = 1000) {
  if (typeof window === 'undefined') return;
  
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(el => {
    let timer;
    
    // Apply will-change before animation
    el.addEventListener(trigger, () => {
      el.style.willChange = property;
      clearTimeout(timer);
    });
    
    // Remove will-change after animation completes
    el.addEventListener('mouseleave', () => {
      timer = setTimeout(() => {
        el.style.willChange = 'auto';
      }, cleanup);
    });
  });
  
  return () => {
    elements.forEach(el => {
      el.style.willChange = 'auto';
      el.removeEventListener(trigger);
      el.removeEventListener('mouseleave');
    });
  };
}

/**
 * Initializes all performance optimizations
 * Call this function once at the app level
 */
export function initPerformanceOptimizations() {
  if (typeof window === 'undefined') return;
  
  // Wait for page to be fully loaded
  if (document.readyState === 'complete') {
    runOptimizations();
  } else {
    window.addEventListener('load', runOptimizations);
  }
  
  function runOptimizations() {
    // Lazy load all images with data-src attribute
    lazyLoadImages();
    
    // Prefetch visible links with data-prefetch attribute
    prefetchVisibleLinks();
    
    // Preload critical above-fold images
    preloadCriticalImages([
      '/hero-bg.jpg',
      '/hero-bg-2.jpg'
    ]);
    
    // Optimize animations for buttons and cards
    optimizeAnimations('.btn, .card', 'transform');
    
    // Add event listeners with throttling/debouncing
    window.addEventListener('scroll', throttle(() => {
      // Check for elements entering viewport
    }, 100));
    
    window.addEventListener('resize', debounce(() => {
      // Handle responsive adjustments
    }, 200));
  }
}
