"use client";

import { useEffect, useState } from 'react';

export const Map = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // Check if window object is available (client-side)
    if (typeof window !== 'undefined') {
      setMapLoaded(true);
    }
  }, []);

  if (!mapLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-500">Loading map...</div>
      </div>
    );
  }

  // For a real implementation, you would integrate with a map service like Google Maps, Mapbox, etc.
  // For now, we'll display a static map image as a placeholder
  
  return (
    <div className="relative w-full h-full bg-gray-200">
      {/* Fallback image for the map */}
      <img 
        src="/img/map-placeholder.jpg" 
        alt="Office Location Map" 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/1200x600?text=Map+of+Office+Location';
        }}
      />
      
      {/* Map pin */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
          <div className="h-4 w-4 bg-white rounded-full"></div>
        </div>
        <div className="w-4 h-4 bg-green-600 rotate-45 -mt-2 ml-1"></div>
      </div>
    </div>
  );
};