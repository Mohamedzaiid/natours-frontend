"use client";

import { useState } from 'react';
import { MapPin, Calendar, Users, Heart, ArrowRight, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import { cn } from "@/lib/utils/utils";
import { motion } from '@/lib/animations/motion';

export function ChatSearchResults({ results, loading, onAddToWishlist }) {
  const { isDark } = useTheme();
  const [wishlistStatus, setWishlistStatus] = useState({});
  
  const handleAddToWishlist = async (tourId) => {
    setWishlistStatus(prev => ({ ...prev, [tourId]: 'loading' }));
    try {
      // Call API to add to wishlist
      if (onAddToWishlist) {
        await onAddToWishlist(tourId);
      }
      setWishlistStatus(prev => ({ ...prev, [tourId]: 'added' }));
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setWishlistStatus(prev => ({ ...prev, [tourId]: null }));
      }, 2000);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setWishlistStatus(prev => ({ ...prev, [tourId]: 'error' }));
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setWishlistStatus(prev => ({ ...prev, [tourId]: null }));
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-4 flex justify-center items-center">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mr-2" />
        <span>Finding the perfect tours for you...</span>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          No tours found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h3 className="text-sm font-medium mb-3 text-emerald-700 dark:text-emerald-400">
        Tours that match your preferences:
      </h3>
      <div className="space-y-3">
        {results.slice(0, 3).map((tour, index) => (
          <motion.div
            key={tour.id || index}
            className={cn(
              "rounded-lg overflow-hidden border shadow-sm",
              isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-32 sm:w-32 sm:h-full bg-gray-200">
                {tour.imageCover ? (
                  <Image
                    src={`/img/tours/${tour.imageCover}`}
                    alt={tour.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🏞️
                  </div>
                )}
              </div>
              
              <div className="p-3 flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm">{tour.name}</h4>
                  <div className="flex items-center">
                    <span className="text-amber-500 text-xs font-bold">
                      {tour.ratingsAverage || 4.5}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({tour.ratingsQuantity || 0})
                    </span>
                  </div>
                </div>
                
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 truncate">
                  {tour.summary}
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {tour.startLocation?.description || 'Exciting location'}
                  </span>
                  
                  <span className="flex items-center text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {tour.duration} days
                  </span>
                  
                  <span className="flex items-center text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    {tour.maxGroupSize} people
                  </span>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-600 font-bold">
                      ${tour.price}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      /person
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToWishlist(tour.id || tour._id)}
                      className={cn(
                        "p-1.5 rounded-full transition-colors",
                        wishlistStatus[tour.id || tour._id] === 'added'
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                          : "hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-700"
                      )}
                      disabled={wishlistStatus[tour.id || tour._id] === 'loading'}
                    >
                      {wishlistStatus[tour.id || tour._id] === 'loading' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : wishlistStatus[tour.id || tour._id] === 'added' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                    </button>
                    
                    <Link href={`/tour/${tour.slug || tour.id || tour._id}`}>
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-full flex items-center transition-colors">
                        View
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {results.length > 3 && (
          <Link href="/tours">
            <button className="mt-2 w-full text-center text-emerald-600 dark:text-emerald-400 text-sm py-2 border border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
              View all {results.length} matching tours
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default ChatSearchResults;