"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from '@/lib/animations/motion';
import { MapPin, Calendar, Users, Camera, Star, Clock, ArrowRight, Heart, Check, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils/utils";
import { useTheme } from '@/app/providers/theme/ThemeProvider';

export function FixedChatResults({ results, loading, onAddToWishlist }) {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Auto-carousel for tour results
  useEffect(() => {
    if (!results || results.length <= 1 || isAnimating) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % results.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [results, isAnimating]);
  
  const handleAddToWishlist = async (tourId) => {
    setWishlistStatus(prev => ({ ...prev, [tourId]: 'loading' }));
    
    try {
      // Call wishlist API
      if (onAddToWishlist) {
        await onAddToWishlist(tourId);
      }
      
      // Show success state
      setWishlistStatus(prev => ({ ...prev, [tourId]: 'added' }));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setWishlistStatus(prev => ({ ...prev, [tourId]: null }));
      }, 2000);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setWishlistStatus(prev => ({ ...prev, [tourId]: 'error' }));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setWishlistStatus(prev => ({ ...prev, [tourId]: null }));
      }, 2000);
    }
  };
  
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 p-6 shadow-sm border border-emerald-100 dark:border-emerald-900/50">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400"></div>
        
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20"></div>
            <div className="relative bg-emerald-100 dark:bg-emerald-900 p-4 rounded-full">
              <Loader2 size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-2">Finding perfect matches for you</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 max-w-xs">
            Searching through our exclusive collection of tours to find your ideal adventure...
          </p>
        </div>
      </div>
    );
  }
  
  if (!results || results.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 p-6 shadow-sm border border-amber-100 dark:border-amber-900/50">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full mb-5">
            <Camera size={24} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">Custom Adventure Awaits</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 max-w-xs mb-6">
            We couldn't find exact matches for your criteria, but we can create a custom experience just for you!
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium transition-colors shadow-md">
            Create Custom Plan
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 shadow-sm border border-emerald-100 dark:border-emerald-900/50">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400"></div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100 flex items-center">
            <Star className="text-amber-500 w-4 h-4 mr-1.5" /> 
            Recommended Tours
            <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
              {results.length} found
            </span>
          </h3>
          
          {results.length > 1 && (
            <div className="flex space-x-1">
              {results.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAnimating(true);
                    setActiveIndex(i);
                    setTimeout(() => setIsAnimating(false), 500);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === activeIndex
                      ? "bg-emerald-500"
                      : "bg-emerald-200 dark:bg-emerald-800 hover:bg-emerald-300 dark:hover:bg-emerald-700"
                  )}
                  aria-label={`View tour ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            {results.map((tour, index) => (
              index === activeIndex && (
                <motion.div
                  key={tour.id || tour._id || index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2"
                >
                  <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                    {tour.imageCover ? (
                      <Image
                        src={`/img/tours/${tour.imageCover}`}
                        alt={tour.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                        <div className="text-white text-5xl">🏞️</div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    
                    <div className="absolute left-3 top-3 bg-white/90 dark:bg-black/80 px-2.5 py-1.5 rounded-lg text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                      {tour.duration} days
                    </div>
                    
                    <div className="absolute right-3 top-3 bg-amber-500 text-white px-2.5 py-1.5 rounded-lg text-sm font-bold flex items-center">
                      ${tour.price}
                      <span className="text-xs font-normal ml-1">/person</span>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-white font-bold text-lg mb-1 drop-shadow-md">{tour.name}</h4>
                      <div className="flex items-center text-xs text-white/90">
                        <MapPin className="w-3 h-3 mr-1 drop-shadow-md" />
                        <span className="drop-shadow-md truncate">
                          {tour.startLocation?.description || tour.locations?.[0]?.description || 'Exciting destination'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {tour.summary}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-full text-xs flex items-center">
                        <Users className="w-3 h-3 mr-1.5" />
                        Max {tour.maxGroupSize} people
                      </div>
                      
                      <div className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-full text-xs flex items-center">
                        <Star className="w-3 h-3 mr-1.5 text-amber-500" />
                        {tour.ratingsAverage || 4.5} ({tour.ratingsQuantity || 0} reviews)
                      </div>
                      
                      <div className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-full text-xs flex items-center capitalize">
                        {tour.difficulty || 'moderate'}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => handleAddToWishlist(tour.id || tour._id)}
                        className={cn(
                          "relative overflow-hidden px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                          wishlistStatus[tour.id || tour._id] === 'added'
                            ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-700 dark:hover:text-pink-300"
                        )}
                        disabled={wishlistStatus[tour.id || tour._id] === 'loading'}
                      >
                        {wishlistStatus[tour.id || tour._id] === 'loading' ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1.5 inline-block" />
                            Saving
                          </>
                        ) : wishlistStatus[tour.id || tour._id] === 'added' ? (
                          <>
                            <Check className="w-3 h-3 mr-1.5 inline-block" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Heart className="w-3 h-3 mr-1.5 inline-block" />
                            Save
                          </>
                        )}
                      </button>
                      
                      <Link href={`/tour/${tour.slug || tour.id || tour._id}`} className="block">
                        <button className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full text-xs font-medium transition-colors shadow-sm flex items-center">
                          View Tour
                          <ArrowRight className="w-3 h-3 ml-1.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
        
        {results.length > 1 && (
          <div className="text-center mt-4">
            <Link href="/tours" className="block">
              <button className="w-full px-4 py-2 border border-dashed border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-sm">
                View All {results.length} Tours
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default FixedChatResults;