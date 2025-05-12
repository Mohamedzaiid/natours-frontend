"use client";

import { useState, useEffect, useRef } from 'react';
import { getAllTours } from '@/lib/api/tours';

// Cache for storing previous search results to minimize API calls
const searchCache = new Map();

const useSearchSuggestions = (query, debounceTime = 300) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimerRef = useRef(null);
  
  // Function to fetch and filter tour suggestions
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have cached results for this query
      if (searchCache.has(searchQuery)) {
        setSuggestions(searchCache.get(searchQuery));
        setLoading(false);
        return;
      }
      
      // Fetch all tours if not already in cache
      let allTours;
      if (searchCache.has('__all_tours__')) {
        allTours = searchCache.get('__all_tours__');
      } else {
        allTours = await getAllTours();
        searchCache.set('__all_tours__', allTours);
      }
      
      // Filter tours based on search query (case-insensitive)
      const lowerQuery = searchQuery.toLowerCase();
      const filteredTours = allTours.filter(tour => {
        // Search by name, location, or description
        return (
          tour.name?.toLowerCase().includes(lowerQuery) ||
          tour.summary?.toLowerCase().includes(lowerQuery) ||
          tour.description?.toLowerCase().includes(lowerQuery) ||
          tour.startLocation?.description?.toLowerCase().includes(lowerQuery) ||
          // Check locations if available
          tour.locations?.some(loc => loc.description?.toLowerCase().includes(lowerQuery))
        );
      }).slice(0, 5); // Limit results to 5 for better performance
      
      // Cache the results
      searchCache.set(searchQuery, filteredTours);
      setSuggestions(filteredTours);
    } catch (err) {
      console.error('Error fetching search suggestions:', err);
      setError(err.message || 'Failed to fetch suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Don't search for empty queries
    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    
    // Set loading state immediately for better UX
    setLoading(true);
    
    // Debounce the search
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, debounceTime);
    
    // Cleanup timer on component unmount or query change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceTime]);
  
  // Cache management - clear cache when component unmounts
  useEffect(() => {
    return () => {
      // Optionally clear cache on unmount if needed
      // searchCache.clear();
    };
  }, []);
  
  return { suggestions, loading, error };
};

export default useSearchSuggestions;
