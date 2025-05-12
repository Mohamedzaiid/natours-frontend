// Enhanced Reviews API functions with caching
import * as AdminAPI from '../admin';

// Fetch all reviews
export const getAllReviews = async () => {
  try {
    return await AdminAPI.getAllReviews();
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

// Fetch a review by ID
export const getReviewById = (id) => async () => {
  try {
    return await AdminAPI.getReviewById(id);
  } catch (error) {
    console.error(`Error fetching review with ID ${id}:`, error);
    throw error;
  }
};

// Update a review with cache invalidation
export const updateReview = async (id, reviewData, invalidateCache) => {
  try {
    const result = await AdminAPI.updateReview(id, reviewData);
    
    // Invalidate related cache entries
    invalidateCache(`reviews/${id}`);
    invalidateCache('reviews/all');
    
    // Invalidate associated tour and user cache entries
    if (reviewData.tour) invalidateCache(`tours/${reviewData.tour}`);
    if (reviewData.user) invalidateCache(`users/${reviewData.user}`);
    
    return result;
  } catch (error) {
    console.error(`Error updating review with ID ${id}:`, error);
    throw error;
  }
};

// Delete a review with cache invalidation
export const deleteReview = async (id, reviewData, invalidateCache) => {
  try {
    const result = await AdminAPI.deleteReview(id);
    
    // Invalidate related cache entries
    invalidateCache(`reviews/${id}`);
    invalidateCache('reviews/all');
    
    // Invalidate associated tour and user cache entries
    if (reviewData && reviewData.tour) {
      if (typeof reviewData.tour === 'object' && reviewData.tour._id) {
        invalidateCache(`tours/${reviewData.tour._id}`);
      } else if (typeof reviewData.tour === 'string') {
        invalidateCache(`tours/${reviewData.tour}`);
      }
    }
    
    if (reviewData && reviewData.user) {
      if (typeof reviewData.user === 'object' && reviewData.user._id) {
        invalidateCache(`users/${reviewData.user._id}`);
      } else if (typeof reviewData.user === 'string') {
        invalidateCache(`users/${reviewData.user}`);
      }
    }
    
    // Also invalidate dashboard stats since review counts are affected
    invalidateCache('dashboard');
    
    return result;
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error);
    throw error;
  }
};
