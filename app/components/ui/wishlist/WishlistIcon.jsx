"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/app/hooks/useWishlist";
import { useAuthPrompt } from "@/app/providers/AuthPromptProvider";
import { useTheme } from "@/app/providers/theme/ThemeProvider";

const BASE_URL = 'https://natours-yslc.onrender.com';

const WishlistIcon = ({ isAuthPage = false, isScrolled = false }) => {
  const { 
    wishlistCount, 
    wishlistItems, 
    removeFromWishlist, 
    isWishlistOpen, 
    setIsWishlistOpen,
    isAuthenticated
  } = useWishlist();
  const { toggleAuthPrompt } = useAuthPrompt();
  const { isDark } = useTheme();
  const dropdownRef = useRef(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsWishlistOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsWishlistOpen]);
  
  // Get dynamic styling for icon based on scroll state, auth page, theme and auth status
  const getIconColor = () => {
    // Base styles based on page and theme
    let baseStyle = isDark
      ? "text-white hover:bg-gray-700"
      : isScrolled || isAuthPage
        ? "text-slate-700 hover:bg-gray-100"
        : "text-white hover:bg-white/10";
        
    // Add opacity for non-authenticated users to provide visual feedback
    if (!isAuthenticated) {
      baseStyle += " opacity-80";
    }
    
    return baseStyle;
  };
  
  // Handle click on wishlist icon
  const handleWishlistClick = () => {
    // Only logged in users can view wishlist
    if (!isAuthenticated) {
      toggleAuthPrompt(true);
      return;
    }
    
    setIsWishlistOpen(!isWishlistOpen);
  };
  
  // Handle item removal
  const handleRemoveItem = (itemId) => {
    if (!isAuthenticated) {
      toggleAuthPrompt(true);
      return;
    }
    
    removeFromWishlist(itemId);
  };
  
  return (
    <div className="relative wishlist-container" ref={dropdownRef}>
      
      {/* Wishlist Icon Button */}
      <button
        aria-label={isAuthenticated ? "View your wishlist" : "Log in to use wishlist"}
        className={`p-2 rounded-full relative ${getIconColor()}`}
        onClick={handleWishlistClick}
        title={isAuthenticated ? "View your wishlist" : "Log in to save favorites"}
      >
        <Heart size={20} />
        
        {/* Badge showing wishlist count - only shown for authenticated users */}
        {isAuthenticated && wishlistCount > 0 && (
          <span 
            className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
              isDark 
                ? "bg-emerald-500 text-white" 
                : isScrolled || isAuthPage
                  ? "bg-emerald-600 text-white" 
                  : "bg-white text-emerald-600"
            }`}
          >
            {wishlistCount}
          </span>
        )}
      </button>
      
      {/* Wishlist Dropdown - only shown for authenticated users */}
      {isAuthenticated && isWishlistOpen && (
        <div 
          className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg overflow-hidden z-50 ${
            isAuthPage 
              ? "bg-black/80 border border-white/20" 
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Dropdown Header */}
          <div className={`p-4 ${isAuthPage ? "border-b border-white/20" : "border-b border-gray-100"}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-medium ${isAuthPage ? "text-white" : "text-gray-900"}`}>
                My Wishlist
              </h3>
              <span className={`text-sm ${isAuthPage ? "text-white/70" : "text-gray-500"}`}>
                {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          
          {/* Dropdown Content */}
          <div className="max-h-96 overflow-y-auto">
            {wishlistCount === 0 ? (
              <div className={`p-4 text-center ${isAuthPage ? "text-white/70" : "text-gray-500"}`}>
                <p className="mb-2">Your wishlist is empty</p>
                <a 
                  href="/tours" 
                  className={`inline-block text-sm ${isAuthPage ? "text-white underline" : "text-emerald-600"}`}
                >
                  Discover tours
                </a>
              </div>
            ) : (
              <div>
                {wishlistItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 ${isAuthPage ? "border-b border-white/20" : "border-b border-gray-100"} flex items-center gap-3`}
                  >
                    {/* Tour Thumbnail */}
                    <a 
                      href={`/tours/${item.id || item.slug}`}
                      className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden relative cursor-pointer"
                      style={{ 
                        backgroundImage: item.imageCover.startsWith('http') ? `url(${item.imageCover})`: item.imageCover? `url(${BASE_URL}/img/tours/${item.imageCover})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    ></a>
                    
                    {/* Tour Name and Price */}
                    <div className="flex-grow">
                      <a 
                        href={`/tours/${item.id || item.slug}`}
                        className={`font-medium line-clamp-1 ${isAuthPage ? "text-white" : "text-gray-800"} hover:text-emerald-600 transition-colors block`}
                      >
                        {item.name}
                      </a>
                      
                      <div className={`text-sm ${isAuthPage ? "text-white/70" : "text-gray-500"}`}>
                        {item.price && (
                          <span>${item.price.toLocaleString()} per person</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className={`p-2 rounded-full ${
                        isAuthPage 
                          ? "text-white/70 hover:text-white hover:bg-white/10" 
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      } transition-colors duration-200`}
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Dropdown Footer */}
          {wishlistCount > 0 && (
            <div className={`p-4 ${isAuthPage ? "border-t border-white/20" : "border-t border-gray-100"}`}>
              <a 
                href="/account?tab=wishlist"
                className={`block w-full text-center py-2 px-4 rounded-md ${
                  isAuthPage 
                    ? "bg-white text-emerald-600 hover:bg-white/90" 
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                } transition duration-200`}
              >
                View All Wishlist
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistIcon;
