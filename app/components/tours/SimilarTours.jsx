'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/app/providers/DataProvider';
import { fetchAllTours } from '@/lib/api/enhanced';
import TourCard from './TourCard';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export function SimilarTours({ currentTourId, difficulty }) {
  const { 
    fetchData, 
    cache,
    loading: cacheLoading
  } = useData();
  
  const cacheKey = 'tours/all';
  const allTours = cache[cacheKey];
  const loading = cacheLoading[cacheKey];
  
  const [similarTours, setSimilarTours] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch all tours if they're not already in the cache
  useEffect(() => {
    if (!allTours) {
      fetchData(cacheKey, fetchAllTours(), false);
    }
  }, []);
  
  // Filter similar tours when allTours or current tour ID changes
  useEffect(() => {
    if (!allTours) return;
    
    // Filter similar tours (same difficulty, not current tour)
    const filtered = allTours.filter(tour => 
      tour.id !== currentTourId && 
      tour.difficulty === difficulty
    );
    
    // If there are few similar tours, include some other tours
    let resultTours = [...filtered];
    if (resultTours.length < 3) {
      const otherTours = allTours.filter(tour => 
        tour.id !== currentTourId && 
        tour.difficulty !== difficulty
      );
      resultTours = [...resultTours, ...otherTours].slice(0, 4);
    }
    
    setSimilarTours(resultTours.slice(0, 8)); // Limit to 8 max
  }, [allTours, currentTourId, difficulty]);
  
  // Calculate visible tours based on screen size and current slide
  const toursPerSlide = 3; // Show 3 tours per slide
  const totalSlides = Math.ceil(similarTours.length / toursPerSlide);
  const visibleTours = similarTours.slice(
    currentSlide * toursPerSlide, 
    (currentSlide + 1) * toursPerSlide
  );
  
  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  // Refresh function
  const handleRefresh = () => {
    fetchData(cacheKey, fetchAllTours(), true); // Force refresh
  };

  if (loading || !allTours) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (similarTours.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 mb-4">No similar tours found.</p>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
        >
          <RefreshCw size={16} />
          Refresh Tours
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap -mx-4">
        {visibleTours.map((tour) => (
          <div key={tour.id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
            <TourCard tour={tour} />
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      {similarTours.length > toursPerSlide && (
        <div className="flex justify-center gap-2 mt-6">
          <button 
            onClick={prevSlide}
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5 items-center">
            {[...Array(totalSlides)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === currentSlide ? 'w-6 bg-emerald-600' : 'w-2.5 bg-gray-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default SimilarTours;