"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, Suspense } from "react";
import { getAllTours } from "@/lib/api/tours";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Calendar, Clock, Users, 
  ChevronDown, Filter, X, SlidersHorizontal,
  Star
} from "lucide-react";
import WishlistButton from "@/app/components/ui/wishlist/WishlistButton";

// Client component that safely uses useSearchParams
function SearchParamsHandler({ setSearchQuery }) {
  // Import useSearchParams at the component level
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  useEffect(() => {
    setSearchQuery(query);
  }, [searchParams, setSearchQuery, query]);
  
  return null; // This component just handles fetching the query, no UI
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and sorting state
  const [filters, setFilters] = useState({
    duration: { min: 0, max: 30 },
    price: { min: 0, max: 5000 },
    difficulty: [], // ['easy', 'medium', 'difficult']
    rating: 0, // Minimum rating
  });
  
  const [sortOption, setSortOption] = useState("popularity"); // popularity, price-low, price-high, duration, rating
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Load tours on mount
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const allTours = await getAllTours();
        setTours(allTours);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError("Failed to load tours. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchTours();
  }, []);
  
  // Apply filters and search whenever filters, sort, or tours change
  useEffect(() => {
    if (tours.length === 0) return;
    
    // First, filter by search query
    let result = tours;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = tours.filter(tour => {
        return (
          tour.name?.toLowerCase().includes(lowerQuery) ||
          tour.summary?.toLowerCase().includes(lowerQuery) ||
          tour.description?.toLowerCase().includes(lowerQuery) ||
          tour.startLocation?.description?.toLowerCase().includes(lowerQuery) ||
          tour.locations?.some(loc => loc.description?.toLowerCase().includes(lowerQuery))
        );
      });
    }
    
    // Apply other filters
    result = result.filter(tour => {
      // Duration filter
      const meetsMinDuration = !filters.duration.min || (tour.duration >= filters.duration.min);
      const meetsMaxDuration = !filters.duration.max || (tour.duration <= filters.duration.max);
      
      // Price filter
      const meetsMinPrice = !filters.price.min || (tour.price >= filters.price.min);
      const meetsMaxPrice = !filters.price.max || (tour.price <= filters.price.max);
      
      // Difficulty filter
      const meetsDifficulty = filters.difficulty.length === 0 || 
        filters.difficulty.includes(tour.difficulty);
      
      // Rating filter
      const meetsRating = !filters.rating || (tour.ratingsAverage >= filters.rating);
      
      return meetsMinDuration && meetsMaxDuration && 
             meetsMinPrice && meetsMaxPrice && 
             meetsDifficulty && meetsRating;
    });
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "duration":
          return (a.duration || 0) - (b.duration || 0);
        case "rating":
          return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
        case "popularity":
        default:
          // Assuming a higher ratings quantity means more popular
          return (b.ratingsQuantity || 0) - (a.ratingsQuantity || 0);
      }
    });
    
    setFilteredTours(result);
  }, [tours, searchQuery, filters, sortOption]);
  
  // Update a single filter
  const updateFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      duration: { min: 0, max: 30 },
      price: { min: 0, max: 5000 },
      difficulty: [],
      rating: 0,
    });
    setSortOption("popularity");
  };
  
  // Toggle a difficulty option
  const toggleDifficulty = (difficulty) => {
    setFilters(prev => {
      const newDifficulties = prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...prev.difficulty, difficulty];
      
      return {
        ...prev,
        difficulty: newDifficulties
      };
    });
  };
  
  return (
    <>
      {/* Wrap the SearchParamsHandler in a Suspense boundary to fix the error */}
      <Suspense fallback={null}>
        <SearchParamsHandler setSearchQuery={setSearchQuery} />
      </Suspense>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between mb-8 items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {searchQuery ? `Search results for "${searchQuery}"` : "All Tours"}
            </h1>
            <p className="text-gray-600">
              {loading ? 'Loading tours...' : `${filteredTours.length} tours found`}
            </p>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="md:hidden flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Filter size={16} className="mr-2" />
              Filters
            </button>
            
            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration</option>
                <option value="rating">Rating</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - always visible on desktop, toggleable on mobile */}
          <div 
            className={`md:w-1/4 lg:w-1/5 bg-white rounded-xl shadow-sm p-6 ${
              filtersVisible ? 'block' : 'hidden md:block'
            } ${filtersVisible ? 'fixed inset-0 z-50 md:relative md:z-auto overflow-auto' : ''}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <SlidersHorizontal size={18} className="mr-2" />
                Filters
              </h2>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-800"
                >
                  Reset
                </button>
                
                {/* Mobile close button */}
                {filtersVisible && (
                  <button
                    onClick={() => setFiltersVisible(false)}
                    className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min: ${filters.price.min}</span>
                  <span className="text-sm text-gray-600">Max: ${filters.price.max}</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.price.min}
                  onChange={(e) => updateFilter('price', {...filters.price, min: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.price.max}
                  onChange={(e) => updateFilter('price', {...filters.price, max: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>
            
            {/* Duration Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Duration (days)</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min: {filters.duration.min}</span>
                  <span className="text-sm text-gray-600">Max: {filters.duration.max}</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={filters.duration.min}
                  onChange={(e) => updateFilter('duration', {...filters.duration, min: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={filters.duration.max}
                  onChange={(e) => updateFilter('duration', {...filters.duration, max: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>
            
            {/* Difficulty Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Difficulty</h3>
              <div className="space-y-2">
                {['easy', 'medium', 'difficult'].map((difficulty) => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(difficulty)}
                      onChange={() => toggleDifficulty(difficulty)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {difficulty}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateFilter('rating', rating === filters.rating ? 0 : rating)}
                    className={`p-1 rounded-md ${
                      filters.rating >= rating
                        ? 'text-yellow-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <Star size={20} fill={filters.rating >= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {filters.rating > 0 ? `${filters.rating}+` : 'Any'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Results grid */}
          <div className="md:w-3/4 lg:w-4/5">
            {loading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="bg-red-50 p-6 rounded-xl text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-emerald-600 font-medium hover:text-emerald-700"
                >
                  Try again
                </button>
              </div>
            ) : filteredTours.length === 0 ? (
              // No results
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No tours found</h2>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search with different keywords.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-200"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              // Results grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <Link 
                    href={`/tours/${tour.id || tour.slug}`}
                    key={tour.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-48">
                      {tour.imageCover ? (
                        <Image
                          src={tour.imageCover}
                          alt={tour.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="bg-emerald-100 h-full w-full flex items-center justify-center">
                          <MapPin size={32} className="text-emerald-500" />
                        </div>
                      )}
                      
                      {/* Difficulty badge */}
                      {tour.difficulty && (
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            tour.difficulty === 'easy' 
                              ? 'bg-green-100 text-green-800' 
                              : tour.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
                          </span>
                        </div>
                      )}
                      
                      {/* Wishlist button */}
                      <div className="absolute top-3 right-3">
                        <WishlistButton tour={tour} size="sm" />
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {tour.name}
                        </h3>
                        
                        {/* Ratings */}
                        {tour.ratingsAverage && (
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={14}
                                  className={`${
                                    star <= Math.round(tour.ratingsAverage)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-xs text-gray-600">
                              ({tour.ratingsQuantity || 0})
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Location */}
                      {tour.startLocation && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin size={14} className="mr-1 text-emerald-500" />
                          <span className="truncate">{tour.startLocation.description}</span>
                        </div>
                      )}
                      
                      {/* Tour details */}
                      <div className="grid grid-cols-2 gap-2 my-3">
                        {tour.duration && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock size={14} className="mr-1 text-emerald-500" />
                            <span>{tour.duration} days</span>
                          </div>
                        )}
                        
                        {tour.maxGroupSize && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Users size={14} className="mr-1 text-emerald-500" />
                            <span>Group of {tour.maxGroupSize}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-500">From</span>
                          <div className="font-bold text-xl text-emerald-600">
                            ${tour.price?.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
