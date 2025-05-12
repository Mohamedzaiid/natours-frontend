'use client';

import { useState, useEffect, useCallback } from 'react';
import { useData } from '@/app/providers/DataProvider';
import * as EnhancedAPI from '@/lib/api/enhanced';

// Custom hook for dashboard statistics
export function useDashboardStats(options = {}) {
  const { autoFetch = true, refreshInterval = null } = options;
  const { fetchData, invalidateCache, loading, errors, cache } = useData();
  const cacheKey = 'dashboard';
  
  // Fetch dashboard stats
  const fetchStats = useCallback(async (force = false) => {
    try {
      return await fetchData(cacheKey, EnhancedAPI.fetchDashboardData(), force);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }, [fetchData]);
  
  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
    
    // Setup refresh interval if provided
    let intervalId;
    if (refreshInterval && refreshInterval > 0) {
      intervalId = setInterval(() => {
        fetchStats(true); // Force refresh
      }, refreshInterval);
    }
    
    // Cleanup interval on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoFetch, fetchStats, refreshInterval]);
  
  return {
    stats: cache[cacheKey],
    loading: loading[cacheKey] || false,
    error: errors[cacheKey],
    fetchStats,
    invalidateStats: () => invalidateCache(cacheKey)
  };
}

// Custom hook for tours
export function useTours(options = {}) {
  const { autoFetch = true } = options;
  const { fetchData, invalidateCache, loading, errors, cache } = useData();
  const cacheKey = 'tours/all';
  
  // Fetch all tours
  const fetchTours = useCallback(async (force = false) => {
    try {
      return await fetchData(cacheKey, EnhancedAPI.fetchAllTours(), force);
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  }, [fetchData]);
  
  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchTours();
    }
  }, [autoFetch, fetchTours]);
  
  return {
    tours: cache[cacheKey],
    loading: loading[cacheKey] || false,
    error: errors[cacheKey],
    fetchTours,
    invalidateTours: () => invalidateCache(cacheKey)
  };
}

// Custom hook for a specific tour
export function useTour(id, options = {}) {
  const { autoFetch = true } = options;
  const { fetchData, invalidateCache, loading, errors, cache } = useData();
  const cacheKey = `tours/${id}`;
  
  // Fetch tour by ID
  const fetchTour = useCallback(async (force = false) => {
    if (!id) return null;
    
    try {
      return await fetchData(cacheKey, EnhancedAPI.fetchTourById(id), force);
    } catch (error) {
      console.error(`Error fetching tour with ID ${id}:`, error);
      throw error;
    }
  }, [fetchData, id]);
  
  // Auto-fetch on mount if enabled and ID is provided
  useEffect(() => {
    if (autoFetch && id) {
      fetchTour();
    }
  }, [autoFetch, fetchTour, id]);
  
  return {
    tour: cache[cacheKey],
    loading: loading[cacheKey] || false,
    error: errors[cacheKey],
    fetchTour,
    invalidateTour: () => invalidateCache(cacheKey)
  };
}

// Custom hook for a tour with its reviews and bookings
export function useTourDetails(id, options = {}) {
  const { autoFetch = true } = options;
  const { fetchData, invalidateCache, loading, errors, cache } = useData();
  const cacheKey = `tours/${id}/details`;
  
  // Fetch tour details
  const fetchTourDetails = useCallback(async (force = false) => {
    if (!id) return null;
    
    try {
      return await fetchData(
        cacheKey, 
        EnhancedAPI.fetchTourWithReviewsAndBookings(id),
        force
      );
    } catch (error) {
      console.error(`Error fetching details for tour with ID ${id}:`, error);
      throw error;
    }
  }, [fetchData, id]);
  
  // Auto-fetch on mount if enabled and ID is provided
  useEffect(() => {
    if (autoFetch && id) {
      fetchTourDetails();
    }
  }, [autoFetch, fetchTourDetails, id]);
  
  return {
    tourDetails: cache[cacheKey],
    loading: loading[cacheKey] || false,
    error: errors[cacheKey],
    fetchTourDetails,
    invalidateTourDetails: () => invalidateCache(cacheKey)
  };
}

// Custom hook for users
export function useUsers(options = {}) {
  const { autoFetch = true } = options;
  const { fetchData, invalidateCache, loading, errors, cache } = useData();
  const cacheKey = 'users/all';
  
  // Fetch all users
  const fetchUsers = useCallback(async (force = false) => {
    try {
      return await fetchData(cacheKey, EnhancedAPI.fetchAllUsers(), force);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }, [fetchData]);
  
  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);
  
  // Create a new user
  const createUser = useCallback(async (userData) => {
    try {
      return await EnhancedAPI.createUser(userData, invalidateCache);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }, [invalidateCache]);
  
  // Update a user
  const updateUser = useCallback(async (id, userData) => {
    try {
      return await EnhancedAPI.updateUser(id, userData, invalidateCache);
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }, [invalidateCache]);
  
  // Delete a user
  const deleteUser = useCallback(async (id) => {
    try {
      return await EnhancedAPI.deleteUser(id, invalidateCache);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }, [invalidateCache]);
  
  return {
    users: cache[cacheKey],
    loading: loading[cacheKey] || false,
    error: errors[cacheKey],
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    invalidateUsers: () => invalidateCache(cacheKey)
  };
}

// More hooks for other resources can be added as needed
