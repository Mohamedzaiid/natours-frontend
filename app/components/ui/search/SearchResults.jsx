"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

const SearchResults = ({ 
  suggestions, 
  loading, 
  error, 
  selectedIndex, 
  setSelectedIndex,
  onSelect,
  isAuthPage = false,
  isDark = false
}) => {
  // Get dynamic styling
  const getDropdownStyles = () => {
    if (isDark) {
      return "bg-gray-800 border border-gray-700";
    }
    
    return isAuthPage
      ? "bg-black/80 border border-white/20"
      : "bg-white border border-gray-200";
  };
  
  const getSelectedStyles = (isSelected) => {
    if (isSelected) {
      if (isDark) {
        return "bg-gray-700 text-white";
      }
      return isAuthPage
        ? "bg-white/20 text-white"
        : "bg-emerald-50 text-emerald-800";
    }
    
    // Not selected
    if (isDark) {
      return "text-gray-200 hover:bg-gray-700";
    }
    return isAuthPage
      ? "text-white hover:bg-white/10"
      : "text-gray-800 hover:bg-gray-100";
  };
  
  const getTextColor = () => {
    if (isDark) {
      return "text-gray-400";
    }
    return isAuthPage ? "text-white/70" : "text-gray-500";
  };

  // Handle loading state
  if (loading) {
    return (
      <div className={`absolute z-50 top-full mt-1 w-full rounded-md shadow-lg ${getDropdownStyles()} py-2 max-h-96 overflow-y-auto`}>
        <div className="px-4 py-2 text-sm">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse mb-3">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded mr-3"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={`absolute z-50 top-full mt-1 w-full rounded-md shadow-lg ${getDropdownStyles()} py-2`}>
        <div className="px-4 py-2 text-sm text-red-500">
          Error loading results. Please try again.
        </div>
      </div>
    );
  }

  // Handle no results
  if (suggestions.length === 0) {
    return (
      <div className={`absolute z-50 top-full mt-1 w-full rounded-md shadow-lg ${getDropdownStyles()} py-2`}>
        <div className={`px-4 py-3 text-sm ${getTextColor()}`}>
          No tours found. Try a different search term.
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute z-50 top-full mt-1 w-full rounded-md shadow-lg ${getDropdownStyles()} py-2 max-h-96 overflow-y-auto`}>
      <div role="listbox">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.id || index}
            role="option"
            aria-selected={selectedIndex === index}
            className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${getSelectedStyles(selectedIndex === index)}`}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => onSelect(suggestion)}
          >
            <div className="flex items-center">
              {suggestion.imageCover && (
                <div className="h-10 w-10 flex-shrink-0 mr-3 relative rounded overflow-hidden">
                  <Image
                    src={suggestion.imageCover}
                    alt={suggestion.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <div className="font-medium">{suggestion.name}</div>
                {suggestion.startLocation && (
                  <div className={`flex items-center text-xs mt-1 ${getTextColor()}`}>
                    <MapPin size={12} className="mr-1" />
                    {suggestion.startLocation.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
