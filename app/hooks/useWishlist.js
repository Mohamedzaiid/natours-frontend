"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useAuthPrompt } from '@/app/providers/AuthPromptProvider';
import { fetchWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist, clearWishlist as apiClearWishlist } from '@/lib/api/wishlist';

// Create context
const WishlistContext = createContext();

// Provider component
export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toggleAuthPrompt } = useAuthPrompt();
  
  // Load wishlist from server when authentication state changes
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated && user) {
        try {
          console.log('Fetching wishlist from server...');
          const response = await fetchWishlist();
          
          if (response && response.status === 'success') {
            console.log('Server wishlist fetched successfully:', response.data.wishlist);
            
            // Transform the wishlist items from the server response if needed
            const serverWishlist = response.data.wishlist.map(item => ({
              id: item._id,
              name: item.name,
              price: item.price,
              imageCover: item.imageCover,
              slug: item.slug,
              duration: item.duration,
              ratingsAverage: item.ratingsAverage
            }));
            
            setWishlistItems(serverWishlist);
          }
        } catch (error) {
          console.error('Error fetching wishlist from server:', error);
          setWishlistItems([]);
        }
      } else {
        // Clear wishlist if not authenticated
        setWishlistItems([]);
      }
    };
    
    loadWishlist();
  }, [isAuthenticated, user]);
  
  // Handle closing the wishlist dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isWishlistOpen && !event.target.closest('.wishlist-container')) {
        setIsWishlistOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isWishlistOpen]);
  
  // Add item to wishlist - only for authenticated users
  const addToWishlist = useCallback(async (item) => {
    // If not authenticated, show auth prompt
    if (!isAuthenticated || !user) {
      toggleAuthPrompt(true);
      return false;
    }
    
    // Check if item already exists in wishlist
    if (wishlistItems.some((wishlistItem) => wishlistItem.id === item.id)) {
      return true; // Item already in wishlist
    }
    
    try {
      // Add to server wishlist
      await apiAddToWishlist(item.id);
      
      // Add to local state with animation flag
      setWishlistItems(prev => [...prev, { ...item, isNew: true }]);
      
      // Remove animation flag after animation completes
      setTimeout(() => {
        setWishlistItems(prev =>
          prev.map(wishlistItem => ({
            ...wishlistItem,
            isNew: false,
          }))
        );
      }, 500);
      
      return true; // Successfully added
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      return false; // Failed to add
    }
  }, [isAuthenticated, user, wishlistItems, toggleAuthPrompt]);
  
  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (itemId) => {
    // If not authenticated, show auth prompt
    if (!isAuthenticated || !user) {
      toggleAuthPrompt(true);
      return false;
    }
    
    try {
      // Mark the item for removal animation
      const markedItems = wishlistItems.map(item =>
        item.id === itemId ? { ...item, isRemoving: true } : item
      );
      
      // Update state with marked items for animation
      setWishlistItems(markedItems);
      
      // Remove from server
      await apiRemoveFromWishlist(itemId);
      
      // After animation completes, remove from state
      setTimeout(() => {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      }, 300);
      
      return true; // Successfully removed
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      return false; // Failed to remove
    }
  }, [isAuthenticated, user, wishlistItems, toggleAuthPrompt]);
  
  // Check if an item is in the wishlist
  const isInWishlist = useCallback((itemId) => {
    return wishlistItems.some(item => item.id === itemId);
  }, [wishlistItems]);
  
  // Toggle wishlist status for an item
  const toggleWishlist = useCallback((item) => {
    if (isInWishlist(item.id)) {
      return removeFromWishlist(item.id);
    } else {
      return addToWishlist(item);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);
  
  // Clear entire wishlist
  const clearWishlist = useCallback(async () => {
    // If not authenticated, show auth prompt
    if (!isAuthenticated || !user) {
      toggleAuthPrompt(true);
      return false;
    }
    
    try {
      // Clear on server
      await apiClearWishlist();
      
      // Clear local state
      setWishlistItems([]);
      return true; // Successfully cleared
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return false; // Failed to clear
    }
  }, [isAuthenticated, user, toggleAuthPrompt]);
  
  // Context value
  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    isAuthenticated
  };
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook to use the wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
