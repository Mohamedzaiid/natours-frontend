/**
 * Animation variants for Framer Motion
 * These presets can be used throughout the application for consistent animations
 */

// Fade in animation (subtle and professional)
export const fadeIn = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Slide up animation
export const slideUp = {
  initial: { 
    y: 30, 
    opacity: 0 
  },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    y: 30, 
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Slide in from left
export const slideInLeft = {
  initial: { 
    x: -50, 
    opacity: 0 
  },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    x: -50, 
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Slide in from right
export const slideInRight = {
  initial: { 
    x: 50, 
    opacity: 0 
  },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    x: 50, 
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Scale up animation (good for cards or images)
export const scaleUp = {
  initial: { 
    scale: 0.95, 
    opacity: 0 
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Staggered children animation
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Animation for cards hover
export const cardHover = {
  rest: { scale: 1, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
  hover: { 
    scale: 1.03, 
    y: -5,
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Button hover animation
export const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  tap: { 
    scale: 0.95,
    transition: { 
      duration: 0.1,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Parallax scrolling effect
export const parallax = (speed = 0.5) => ({
  initial: {},
  animate: {
    y: [0, -30 * speed],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 1,
        ease: "linear"
      }
    }
  }
});

// Image carousel animation
export const carousel = {
  enter: direction => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: direction => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

// Scroll triggered opacity
export const fadeInScroll = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Page transitions
export const pageTransition = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
      when: "afterChildren"
    }
  }
};
