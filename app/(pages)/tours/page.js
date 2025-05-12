'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/app/providers/DataProvider';
import { fetchAllTours } from '@/lib/api/enhanced';
import TourCard from '../../components/tours/TourCard';
import TourFilter from '../../components/tours/TourFilter';
import { PageHeader } from '../../components/layout/PageHeader';
import { MapPin, Filter, ArrowUpDown, Search, X, RefreshCw } from 'lucide-react';

export default function ToursPage() {
  // Use data context for caching
  const { 
    fetchData, 
    loading: cacheLoading,
    errors: cacheErrors,
    cache 
  } = useData();
  
  const cacheKey = 'tours/all';
  const tours = cache[cacheKey];
  const loading = cacheLoading[cacheKey];
  const error = cacheErrors[cacheKey];
  
  const [filteredTours, setFilteredTours] = useState([]);
  const [filter, setFilter] = useState({
    difficulty: '',
    duration: '',
    maxGroupSize: '',
    priceRange: [0, 5000],
  });

  // Fetch tours on component mount
  useEffect(() => {
    fetchTours();
    
    // Refresh tours data every 15 minutes
    const intervalId = setInterval(() => {
      fetchTours(true);
    }, 15 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to fetch tours with caching
  const fetchTours = async (force = false) => {
    try {
      await fetchData(cacheKey, fetchAllTours(), force);
    } catch (err) {
      console.error('Error fetching tours:', err);
    }
  };

  // Apply filters when tours or filter change
  useEffect(() => {
    if (!tours) return;
    
    // Apply filters
    const filtered = tours.filter(tour => {
      // Filter by difficulty
      if (filter.difficulty && tour.difficulty !== filter.difficulty) {
        return false;
      }
      
      // Filter by duration
      if (filter.duration) {
        const [min, max] = filter.duration.split('-').map(Number);
        if (tour.duration < min || tour.duration > max) {
          return false;
        }
      }
      
      // Filter by group size
      if (filter.maxGroupSize && tour.maxGroupSize > Number(filter.maxGroupSize)) {
        return false;
      }
      
      // Filter by price range
      if (tour.price < filter.priceRange[0] || tour.price > filter.priceRange[1]) {
        return false;
      }
      
      return true;
    });
    
    setFilteredTours(filtered);
  }, [filter, tours]);

  const handleFilterChange = (newFilter) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };
  
  // Handle refresh click
  const handleRefresh = () => {
    fetchTours(true); // Force refresh
  };

  return (
    <>
      <PageHeader 
        title="Explore Our Tours" 
        subtitle="Find your perfect adventure from our curated selection of breathtaking destinations"
        backgroundImage="/hero-bg.jpg"
      />
      
      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <TourFilter 
              filter={filter} 
              onFilterChange={handleFilterChange} 
            />
          </div>
          
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary))]"></div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    {tours && filteredTours ? filteredTours.length : 0} tours found
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleRefresh}
                      className="text-gray-600 hover:text-emerald-600 transition-colors"
                      title="Refresh tours"
                    >
                      <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Sort by:</span>
                      <select className="border rounded p-2 text-sm">
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating</option>
                        <option value="duration">Duration</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    <p className="font-semibold">Error loading tours</p>
                    <p>{error}</p>
                    <button 
                      onClick={handleRefresh}
                      className="mt-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours && filteredTours && filteredTours.map(tour => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
                
                {tours && filteredTours && filteredTours.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No tours found</h3>
                    <p className="text-gray-600">Try adjusting your filters to find more tours</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
