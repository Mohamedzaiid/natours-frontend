"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion";
import { useInView } from "@/lib/animations/useInView";

/**
 * Optimized lazy-loading image component with blur-up effect and animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.className - Optional additional CSS classes
 * @param {boolean} props.priority - Whether the image is a priority image
 * @param {Object} props.animation - Animation variants for the image
 * @param {boolean} props.blurUp - Whether to use the blur-up effect
 * @param {string} props.objectFit - Object-fit CSS property
 */
export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  animation = null,
  blurUp = true,
  objectFit = "cover",
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, isInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Default animation if none provided
  const defaultAnimation = {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };
  
  // Use provided animation or default
  const imageAnimation = animation || defaultAnimation;
  
  // Handle image load complete
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  // Placeholder blur color
  const shimmer = "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-[shimmer_1.5s_infinite]";
  
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={imageAnimation.initial}
      animate={isInView ? imageAnimation.animate : imageAnimation.initial}
      transition={imageAnimation.transition}
    >
      {/* Skeleton placeholder */}
      {blurUp && !isLoaded && (
        <div 
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse ${shimmer}`}
          style={{ 
            width: width ? `${width}px` : "100%",
            height: height ? `${height}px` : "100%"
          }}
        />
      )}
      
      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleImageLoad}
        className={`transition-opacity duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ objectFit }}
        {...props}
      />
    </motion.div>
  );
}
