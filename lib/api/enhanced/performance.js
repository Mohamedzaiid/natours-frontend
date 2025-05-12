// API performance monitoring utilities
import { getDefaultReporter, withReporting } from './performance';

// Default report collection for API performance monitoring
const reporter = getDefaultReporter();

/**
 * Creates an enhanced API call function with performance monitoring 
 * and error handling.
 * 
 * @param {string} name - Name of the API call for monitoring
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Additional options
 * @returns {Function} - Enhanced API function
 */
export function createEnhancedApiCall(name, apiCall, options = {}) {
  return withReporting(name, apiCall, { reporter, ...options });
}

/**
 * Creates an enhanced mutation function with cache invalidation
 * 
 * @param {string} name - Name of the API mutation
 * @param {Function} mutationFn - The mutation function
 * @param {Object} options - Config options
 * @returns {Function} - Enhanced mutation function that handles cache invalidation
 */
export function createCachingMutation(name, mutationFn, options = {}) {
  const { 
    onSuccess, 
    cachePrefix,
    reportPerformance = true
  } = options;
  
  // Create the enhanced function
  const enhancedFn = async (args, invalidateCache) => {
    const startTime = performance.now();
    let error = null;
    
    try {
      // Execute the mutation
      const result = await mutationFn(args);
      
      // Handle cache invalidation if needed
      if (invalidateCache && cachePrefix) {
        invalidateCache(null, cachePrefix);
      }
      
      // Call onSuccess handler if provided
      if (onSuccess) {
        onSuccess(result, args, invalidateCache);
      }
      
      return result;
    } catch (e) {
      error = e;
      throw e;
    } finally {
      // Report performance if enabled
      if (reportPerformance) {
        const duration = performance.now() - startTime;
        reporter.recordApiCall({
          name,
          duration,
          success: !error,
          error: error?.message
        });
      }
    }
  };
  
  return enhancedFn;
}

/**
 * Basic performance reporter implementation
 * Used for monitoring API call performance
 */
const performanceLogThreshold = 500; // milliseconds

export function getDefaultReporter() {
  return {
    apiCalls: {},
    recordApiCall(data) {
      const { name, duration, success, error } = data;
      
      // Store performance data
      if (!this.apiCalls[name]) {
        this.apiCalls[name] = {
          count: 0,
          totalDuration: 0,
          errors: 0,
          averageDuration: 0
        };
      }
      
      // Update stats
      this.apiCalls[name].count++;
      this.apiCalls[name].totalDuration += duration;
      this.apiCalls[name].averageDuration = 
        this.apiCalls[name].totalDuration / this.apiCalls[name].count;
      
      if (!success) {
        this.apiCalls[name].errors++;
      }
      
      // Log slow API calls
      if (duration > performanceLogThreshold) {
        console.warn(`Slow API call: ${name} took ${duration.toFixed(2)}ms`);
      }
    },
    getStats() {
      return this.apiCalls;
    },
    resetStats() {
      this.apiCalls = {};
    }
  };
}

/**
 * Higher-order function that adds performance reporting to API calls
 */
export function withReporting(name, fn, options = {}) {
  const { reporter } = options;
  
  return async (...args) => {
    const startTime = performance.now();
    let error = null;
    
    try {
      return await fn(...args);
    } catch (e) {
      error = e;
      throw e;
    } finally {
      if (reporter) {
        const duration = performance.now() - startTime;
        reporter.recordApiCall({
          name,
          duration,
          success: !error,
          error: error?.message
        });
      }
    }
  };
}
