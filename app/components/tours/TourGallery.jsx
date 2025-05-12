"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTheme } from "@/app/providers/theme/ThemeProvider";

export const TourGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const { theme, isDark } = useTheme();

  // If no images are provided, use placeholders
  // Clean image URLs to fix the double domain issue
  const cleanImageURL = (url) => {
    if (!url) return '/images/placeholder-1.jpg';
    
    // Fix double domain issue
    if (url.includes('https://natours-yslc.onrender.com/api/v1/img/tours/https://natours-yslc.onrender.com')) {
      return url.replace('https://natours-yslc.onrender.com/api/v1/img/tours/https://natours-yslc.onrender.com', 'https://natours-yslc.onrender.com');
    }
    
    return url;
  };
  
  const galleryImages = images?.length
    ? images.map(cleanImageURL)
    : [
        '/images/placeholder-1.jpg',
        '/images/placeholder-2.jpg',
        '/images/placeholder-3.jpg',
        '/images/placeholder-4.jpg',
        '/images/placeholder-5.jpg',
      ];
  
  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.src = '/images/tour-placeholder.jpg';
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  return (
    <>
      <div className="mb-10">
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : ''}`}>Gallery</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.slice(0, 5).map((image, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl overflow-hidden cursor-pointer 
                ${index === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square'}`}
              onClick={() => openLightbox(index)}
            >
              <Image 
                src={image}
                alt={`Tour image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
                unoptimized={image.startsWith('http')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className={`fixed inset-0 bg-black/90 z-50 flex items-center justify-center ${isDark ? 'dark-lightbox' : ''}`}>
          <button 
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
          >
            <X size={28} />
          </button>
          
          <button 
            onClick={handlePrev}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft size={40} />
          </button>
          
          <div className="relative h-[80vh] w-[80vw]">
            <Image 
              src={galleryImages[currentImageIndex]}
              alt={`Tour image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              onError={handleImageError}
              unoptimized={galleryImages[currentImageIndex].startsWith('http')}
            />
          </div>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight size={40} />
          </button>
          
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {galleryImages.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full 
                  ${currentImageIndex === index ? 'bg-white' : 'bg-gray-500'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TourGallery;