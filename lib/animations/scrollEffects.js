"use client";

// Helper function to create scroll-triggered animations using Intersection Observer
export const createScrollEffect = (element, effect, options = {}) => {
  if (typeof window === 'undefined' || !element) return;
  
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true
  } = options;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Apply the effect when element enters viewport
          effect(element);
          
          // Unobserve if once is true
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          // If once is false, we revert the effect
          element.classList.remove('animated');
        }
      });
    },
    { threshold, rootMargin }
  );
  
  observer.observe(element);
  
  return () => {
    if (element) observer.unobserve(element);
  };
};

// Predefined scroll effects
const scrollEffects = {
  // Fade In effect
  fadeIn: (element) => {
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  },
  
  // Slide Up effect
  slideUp: (element) => {
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  },
  
  // Slide In From Left
  slideInLeft: (element) => {
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateX(0)';
  },
  
  // Slide In From Right
  slideInRight: (element) => {
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateX(0)';
  },
  
  // Scale Up effect
  scaleUp: (element) => {
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
  }
};

// Apply scroll animations to multiple elements
export const initScrollAnimations = () => {
  if (typeof window === 'undefined') return;
  
  // Fade In elements
  document.querySelectorAll('.scroll-fade-in').forEach(element => {
    element.style.opacity = '0';
    createScrollEffect(element, scrollEffects.fadeIn);
  });
  
  // Slide Up elements
  document.querySelectorAll('.scroll-slide-up').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    createScrollEffect(element, scrollEffects.slideUp);
  });
  
  // Slide In Left elements
  document.querySelectorAll('.scroll-slide-left').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateX(-50px)';
    createScrollEffect(element, scrollEffects.slideInLeft);
  });
  
  // Slide In Right elements
  document.querySelectorAll('.scroll-slide-right').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateX(50px)';
    createScrollEffect(element, scrollEffects.slideInRight);
  });
  
  // Scale Up elements
  document.querySelectorAll('.scroll-scale-up').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9)';
    createScrollEffect(element, scrollEffects.scaleUp);
  });
};

export default initScrollAnimations;
