"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/app/hooks/useWishlist";
import { useAuthPrompt } from "@/app/providers/AuthPromptProvider";
import { Heart, ShoppingBag, Star } from "lucide-react";

const BASE_URL = 'https://natours-yslc.onrender.com';

const WishlistCard = ({ tour }) => {
  const { removeFromWishlist, isAuthenticated } = useWishlist();
  const { toggleAuthPrompt } = useAuthPrompt();
  
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toggleAuthPrompt(true);
      return;
    }
    
    removeFromWishlist(tour.id);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <div className="relative">
        <div className="h-48 w-full relative">
          <Image
            src={tour.imageCover.startsWith('http') ? tour.imageCover :`${BASE_URL}/img/tours/${tour.imageCover}` || "/img/tours/default.jpg"}
            alt={tour.name}
            fill
            className="object-cover"
          />
        </div>
        <button 
          onClick={handleRemove}
          className="absolute top-4 right-4 p-2 text-red-500"
          aria-label="Remove from wishlist"
          title="Remove from wishlist"
        >
          <Heart size={24} fill="currentColor" />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tour.name}</h3>
        <div className="flex justify-between mb-6">
          <span className="text-xl font-bold text-green-600">${tour.price || 0}</span>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-gray-700 dark:text-gray-300">{tour.ratingsAverage || 4.5}</span>
            <span className="text-gray-400 ml-1">({tour.ratingsQuantity || 0})</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link
            href={`/tours/${tour.id}`}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md text-center font-medium"
          >
            View Tour
          </Link>
          <Link 
            href={`/tours/${tour.id}#book`}
            className="w-12 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <ShoppingBag size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
