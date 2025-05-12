"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/app/hooks/useWishlist";
import { useAuthPrompt } from "@/app/providers/AuthPromptProvider";
import { motion, AnimatePresence } from "framer-motion";

// Wishlist button for tour cards and tour detail pages
const WishlistButton = ({ tour, size = "default", className = "" }) => {
  const { toggleWishlist, isInWishlist, isAuthenticated } = useWishlist();
  const { toggleAuthPrompt } = useAuthPrompt();
  const isWishlisted = isAuthenticated && isInWishlist(tour.id);
  
  // Size variants
  const sizeClasses = {
    sm: "p-1.5 rounded-full",
    default: "p-2 rounded-full",
    lg: "p-3 rounded-full"
  };
  
  // Icon sizes
  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 24
  };
  
  const handleClick = (e) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation(); // Prevent event bubbling
    
    // If user is not authenticated, show auth prompt
    if (!isAuthenticated) {
      toggleAuthPrompt(true);
      return;
    }
    
    // Otherwise proceed with toggling wishlist
    toggleWishlist(tour);
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      title={isAuthenticated ? (isWishlisted ? "Remove from wishlist" : "Add to wishlist") : "Log in to save favorites"}
      className={`${sizeClasses[size]} ${className} ${
        isWishlisted 
          ? "bg-red-50 text-red-500" 
          : "bg-white/80 text-gray-500 hover:text-red-500 hover:bg-red-50"
      } backdrop-blur-sm transition-colors duration-200 shadow-sm relative overflow-hidden ${!isAuthenticated ? "opacity-80" : ""}`}
    >
        <AnimatePresence mode="wait">
          <motion.div
            key={isWishlisted ? "filled" : "outline"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Heart 
              size={iconSizes[size]} 
              fill={isWishlisted ? "currentColor" : "none"} 
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Success animation - appears when added to wishlist */}
        {isWishlisted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-red-100 rounded-full z-0"
          />
        )}
      </button>
  );
};

export default WishlistButton;
