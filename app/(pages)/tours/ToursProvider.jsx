'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/app/providers/DataProvider';
import { fetchAllTours } from '@/lib/api/enhanced';

export default function Tours({ children }) {
  const { 
    fetchData, 
    invalidateCache, 
    loading: cacheLoading,
    errors: cacheErrors,
    cache 
  } = useData();
  
  const cacheKey = 'tours/all';
  
  // Fetch tours on component mount
  useEffect(() => {
    // Fetch all tours
    fetchData(cacheKey, fetchAllTours(), false);
    
    // Refresh tours every 15 minutes
    const intervalId = setInterval(() => {
      fetchData(cacheKey, fetchAllTours(), true);
    }, 15 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return children;
}
