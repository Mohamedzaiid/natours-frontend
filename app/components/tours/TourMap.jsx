"use client";

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTheme } from "@/app/providers/theme/ThemeProvider";

// Dynamically import leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

// Import L directly for custom icon implementation
const L = dynamic(
  () => import('leaflet').then((mod) => mod),
  { ssr: false }
);

export const TourMap = ({ locations = [], startLocation }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [leaflet, setLeaflet] = useState(null);
  const [mapError, setMapError] = useState(false);
  const { theme, isDark } = useTheme();
  
  // Process locations for the map
  const allLocations = startLocation ? [startLocation, ...locations].filter(loc => loc && loc.coordinates) : 
                                      locations.filter(loc => loc && loc.coordinates);
  
  // Calculate the center of the map based on all locations
  let center = [51.505, -0.09]; // Default to London
  
  if (allLocations.length > 0) {
    // Use the first location as the center
    center = [allLocations[0].coordinates[1], allLocations[0].coordinates[0]];
  }
  
  // Create a path for the tour
  const pathPositions = allLocations.map(loc => [loc.coordinates[1], loc.coordinates[0]]);
    
  useEffect(() => {
    setIsMounted(true);
    
    // Load Leaflet CSS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    
    // Load Leaflet JS dynamically
    import('leaflet').then((L) => {
      setLeaflet(L.default);
      setMapReady(true);
    }).catch(err => {
      console.error("Failed to load Leaflet:", err);
      setMapError(true);
    });
    
    return () => {
      // Cleanup
      if (link.parentNode) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Fallback to simpler map component when Leaflet is not available
  if (!isMounted || !mapReady || mapError || allLocations.length === 0) {
    return (
      <div className="mb-10">
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : ''}`}>Tour Map</h2>
        
        <div className={`h-[500px] w-full rounded-xl overflow-hidden shadow-md relative bg-gray-100 ${isDark ? 'dark-tour-map' : ''}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-center p-6 bg-white rounded-xl shadow-md ${isDark ? 'dark-tour-card' : ''}`}>
              <MapPin size={48} className="mx-auto mb-3 text-emerald-500" />
              <p className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : ''}`}>Tour Locations</p>
              <p className={`max-w-sm text-gray-600 ${isDark ? 'text-gray-400' : ''}`}>
                {mapError ? "Unable to load the interactive map. Please check your connection." :
                 !mapReady ? "Loading map..." :
                 allLocations.length === 0 ? "No location data available for this tour." :
                 "Explore beautiful locations on this tour."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {startLocation && (
            <div className={`bg-white shadow-md rounded-xl p-4 border-l-4 border-emerald-500 ${isDark ? 'dark-tour-card' : ''}`}>
              <h3 className={`font-bold text-gray-800 mb-2 ${isDark ? 'text-white' : ''}`}>Starting Point</h3>
              <div className="flex items-start gap-2">
                <MapPin size={20} className="text-emerald-500 mt-0.5" />
                <div>
                  <p className={`font-medium ${isDark ? 'text-gray-200' : ''}`}>{startLocation.description}</p>
                  <p className={`text-sm text-gray-500 ${isDark ? 'text-gray-400' : ''}`}>
                    {startLocation.address || 'Address details will be provided upon booking'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {locations?.map((location, index) => (
            <div key={index} className={`bg-white shadow-md rounded-xl p-4 border-l-4 border-blue-500 ${isDark ? 'dark-tour-card' : ''}`}>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Stop {index + 1}</h3>
              <div className="flex items-start gap-2">
                <MapPin size={20} className="text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">{location.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {location.address || 'Full day exploration at this location'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Create a Map component that only renders when Leaflet is loaded
  const LeafletMap = () => {
    return (
      <MapContainer 
        center={center} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {allLocations.map((location, index) => {
          const position = [location.coordinates[1], location.coordinates[0]];
          const isStartPoint = location === startLocation;
          
          return (
            <Marker 
              key={index}
              position={position}
            >
              <Popup>
                <div className="font-medium">{location.description || `Stop ${index}`}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{location.day || 'Tour location'}</div>
              </Popup>
            </Marker>
          );
        })}
        
        {pathPositions.length > 1 && (
          <Polyline 
            positions={pathPositions}
            color="#10b981"
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>
    );
  };

  return (
    <div className="mb-10">
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : ''}`}>Tour Map</h2>
      
      <div className={`h-[500px] w-full rounded-xl overflow-hidden shadow-md relative ${isDark ? 'dark-tour-map' : ''}`}>
        <LeafletMap />
      </div>
      
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {startLocation && (
          <div className={`bg-white shadow-md rounded-xl p-4 border-l-4 border-emerald-500 ${isDark ? 'dark-tour-card' : ''}`}>
            <h3 className={`font-bold text-gray-800 mb-2 ${isDark ? 'text-white' : ''}`}>Starting Point</h3>
            <div className="flex items-start gap-2">
              <MapPin size={20} className="text-emerald-500 mt-0.5" />
              <div>
                <p className={`font-medium ${isDark ? 'text-gray-200' : ''}`}>{startLocation.description}</p>
                <p className={`text-sm text-gray-500 ${isDark ? 'text-gray-400' : ''}`}>
                  {startLocation.address || 'Address details will be provided upon booking'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {locations?.map((location, index) => (
          <div key={index} className={`bg-white shadow-md rounded-xl p-4 border-l-4 border-blue-500 ${isDark ? 'dark-tour-card' : ''}`}>
            <h3 className={`font-bold text-gray-800 mb-2 ${isDark ? 'text-white' : ''}`}>Stop {index + 1}</h3>
            <div className="flex items-start gap-2">
              <MapPin size={20} className="text-blue-500 mt-0.5" />
              <div>
                <p className={`font-medium ${isDark ? 'text-gray-200' : ''}`}>{location.description}</p>
                <p className={`text-sm text-gray-500 ${isDark ? 'text-gray-400' : ''}`}>
                  {location.address || 'Full day exploration at this location'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourMap;