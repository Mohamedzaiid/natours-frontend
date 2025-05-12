'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

// Define initial state
const initialState = {
  cache: {},
  timestamps: {},
  loading: {},
  errors: {}
};

// Cache expiration in milliseconds - 5 minutes by default
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;
const CACHE_DURATIONS = {
  // Resource specific cache durations
  'tours': 15 * 60 * 1000, // 15 minutes
  'dashboard': 5 * 60 * 1000, // 5 minutes
  'users': 10 * 60 * 1000, // 10 minutes
  'bookings': 5 * 60 * 1000 // 5 minutes
};

// Action types
const ACTIONS = {
  SET_CACHE_DATA: 'SET_CACHE_DATA',
  INVALIDATE_CACHE: 'INVALIDATE_CACHE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
function dataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CACHE_DATA:
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.key]: action.data
        },
        timestamps: {
          ...state.timestamps,
          [action.key]: Date.now()
        },
        loading: {
          ...state.loading,
          [action.key]: false
        },
        errors: {
          ...state.errors,
          [action.key]: null
        }
      };
    
    case ACTIONS.INVALIDATE_CACHE:
      // If no key is provided, invalidate all cache
      if (!action.key) {
        return {
          ...state,
          cache: {},
          timestamps: {}
        };
      }
      
      // Clone the cache and timestamps objects
      const newCache = { ...state.cache };
      const newTimestamps = { ...state.timestamps };
      
      // Delete the specific key
      delete newCache[action.key];
      delete newTimestamps[action.key];
      
      // If prefix is provided, invalidate all keys starting with the prefix
      if (action.prefix) {
        Object.keys(newCache).forEach(cacheKey => {
          if (cacheKey.startsWith(action.prefix)) {
            delete newCache[cacheKey];
            delete newTimestamps[cacheKey];
          }
        });
      }
      
      return {
        ...state,
        cache: newCache,
        timestamps: newTimestamps
      };
    
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.key]: action.loading
        }
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.key]: false
        },
        errors: {
          ...state.errors,
          [action.key]: action.error
        }
      };
    
    case ACTIONS.CLEAR_ERROR:
      const newErrors = { ...state.errors };
      delete newErrors[action.key];
      
      return {
        ...state,
        errors: newErrors
      };
    
    default:
      return state;
  }
}

// Create the context
const DataContext = createContext();

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  
  // Get cache duration for a specific resource
  const getCacheDuration = useCallback((key) => {
    // Extract the resource type from the cache key (e.g., 'tours/123' -> 'tours')
    const resourceType = key.split('/')[0];
    
    // Return the specific cache duration or the default
    return CACHE_DURATIONS[resourceType] || DEFAULT_CACHE_DURATION;
  }, []);
  
  // Check if data is stale (cache has expired)
  const isStale = useCallback((key) => {
    const timestamp = state.timestamps[key];
    if (!timestamp) return true;
    
    const cacheDuration = getCacheDuration(key);
    return Date.now() - timestamp > cacheDuration;
  }, [state.timestamps, getCacheDuration]);
  
  // Set cached data
  const setCacheData = useCallback((key, data) => {
    dispatch({
      type: ACTIONS.SET_CACHE_DATA,
      key,
      data
    });
  }, []);
  
  // Get data from cache or fetch it if needed
  const fetchData = useCallback(async (key, fetchFunction, force = false) => {
    // If data exists in cache and is not stale and not forced refresh
    if (state.cache[key] && !isStale(key) && !force) {
      return state.cache[key];
    }
    
    // Set loading state
    dispatch({
      type: ACTIONS.SET_LOADING,
      key,
      loading: true
    });
    
    try {
      // Fetch fresh data
      const data = await fetchFunction();
      
      // Cache the data
      setCacheData(key, data);
      
      return data;
    } catch (error) {
      // Set error state
      dispatch({
        type: ACTIONS.SET_ERROR,
        key,
        error: error.message || 'An error occurred while fetching data'
      });
      
      throw error;
    }
  }, [state.cache, isStale, setCacheData]);
  
  // Invalidate cache for a specific key or prefix
  const invalidateCache = useCallback((key, prefix) => {
    dispatch({
      type: ACTIONS.INVALIDATE_CACHE,
      key,
      prefix
    });
  }, []);
  
  // Clear error for a specific key
  const clearError = useCallback((key) => {
    dispatch({
      type: ACTIONS.CLEAR_ERROR,
      key
    });
  }, []);
  
  // Expose cache statistics for debugging/monitoring
  const cacheStats = useCallback(() => {
    const now = Date.now();
    const stats = {
      totalItems: Object.keys(state.cache).length,
      activeItems: 0,
      staleItems: 0,
      itemsList: []
    };
    
    // Calculate stats for each cache item
    Object.keys(state.cache).forEach(key => {
      const timestamp = state.timestamps[key];
      const cacheDuration = getCacheDuration(key);
      const age = now - timestamp;
      const isItemStale = age > cacheDuration;
      
      if (isItemStale) {
        stats.staleItems++;
      } else {
        stats.activeItems++;
      }
      
      stats.itemsList.push({
        key,
        age: Math.round(age / 1000), // age in seconds
        isStale: isItemStale,
        expiresIn: Math.round((cacheDuration - age) / 1000) // time to expiration in seconds
      });
    });
    
    return stats;
  }, [state.cache, state.timestamps, getCacheDuration]);
  
  // Context value
  const value = {
    cache: state.cache,
    loading: state.loading,
    errors: state.errors,
    fetchData,
    invalidateCache,
    clearError,
    cacheStats
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
