// Enhanced Admin API with caching
import * as AdminAPI from '../admin';

// Dashboard stats with caching
export const fetchDashboardStats = () => () => AdminAPI.getDashboardStats();

// Users management with caching
export const fetchAllUsers = () => () => AdminAPI.getAllUsers();

export const fetchUserById = (id) => () => AdminAPI.getUserById(id);

// Tours management with caching
export const fetchAllToursAdmin = () => () => AdminAPI.getAllTours();

export const fetchTourByIdAdmin = (id) => () => AdminAPI.getTourById(id);

// Bookings management with caching
export const fetchAllBookings = () => () => AdminAPI.getAllBookings();

export const fetchBookingById = (id) => () => AdminAPI.getBookingById(id);

// Consolidated API endpoints (from our new backend endpoints)
export const fetchDashboardData = () => async () => {
  // This is a custom fetch function for our new consolidated API endpoint
  try {
    const response = await fetch('/api/admin/consolidated/dashboard-data', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to access this data');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to access this data');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const fetchUserWithBookingsAndReviews = (userId) => async () => {
  try {
    const response = await fetch(`/api/admin/consolidated/users/${userId}/details`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to access this data');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to access this data');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId} details:`, error);
    throw error;
  }
};

export const fetchTourWithReviewsAndBookings = (tourId) => async () => {
  try {
    const response = await fetch(`/api/admin/consolidated/tours/${tourId}/details`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to access this data');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to access this data');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching tour with ID ${tourId} details:`, error);
    throw error;
  }
};

export const fetchActiveToursWithGuides = () => async () => {
  try {
    const response = await fetch('/api/admin/consolidated/active-tours-with-guides', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to access this data');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to access this data');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error('Error fetching active tours with guides:', error);
    throw error;
  }
};

// Mutation functions (create, update, delete) that also handle cache invalidation
// These are exported directly as functions, not as function factories
export const createUser = async (userData, invalidateCache) => {
  const result = await AdminAPI.createUser(userData);
  // Invalidate related cache
  invalidateCache(null, 'users');
  invalidateCache('dashboard');
  return result;
};

export const updateUser = async (id, userData, invalidateCache) => {
  const result = await AdminAPI.updateUser(id, userData);
  // Invalidate related cache
  invalidateCache(`users/${id}`);
  invalidateCache(null, 'users');
  return result;
};

export const deleteUser = async (id, invalidateCache) => {
  const result = await AdminAPI.deleteUser(id);
  // Invalidate related cache
  invalidateCache(`users/${id}`);
  invalidateCache(null, 'users');
  invalidateCache('dashboard');
  return result;
};

export const createTour = async (tourData, invalidateCache) => {
  const result = await AdminAPI.createTour(tourData);
  // Invalidate related cache
  invalidateCache(null, 'tours');
  invalidateCache('dashboard');
  return result;
};

export const updateTour = async (id, tourData, invalidateCache) => {
  const result = await AdminAPI.updateTour(id, tourData);
  // Invalidate related cache
  invalidateCache(`tours/${id}`);
  invalidateCache(null, 'tours');
  return result;
};

export const deleteTour = async (id, invalidateCache) => {
  const result = await AdminAPI.deleteTour(id);
  // Invalidate related cache
  invalidateCache(`tours/${id}`);
  invalidateCache(null, 'tours');
  invalidateCache('dashboard');
  return result;
};

export const createBooking = async (bookingData, invalidateCache) => {
  const result = await AdminAPI.createBooking(bookingData);
  // Invalidate related cache
  invalidateCache(null, 'bookings');
  invalidateCache('dashboard');
  invalidateCache(`tours/${bookingData.tour}`);
  invalidateCache(`users/${bookingData.user}`);
  return result;
};

export const updateBooking = async (id, bookingData, invalidateCache) => {
  const result = await AdminAPI.updateBooking(id, bookingData);
  // Invalidate related cache
  invalidateCache(`bookings/${id}`);
  invalidateCache(null, 'bookings');
  invalidateCache('dashboard');
  if (bookingData.tour) invalidateCache(`tours/${bookingData.tour}`);
  if (bookingData.user) invalidateCache(`users/${bookingData.user}`);
  return result;
};

export const deleteBooking = async (id, bookingData, invalidateCache) => {
  const result = await AdminAPI.deleteBooking(id);
  // Invalidate related cache
  invalidateCache(`bookings/${id}`);
  invalidateCache(null, 'bookings');
  invalidateCache('dashboard');
  if (bookingData && bookingData.tour) invalidateCache(`tours/${bookingData.tour}`);
  if (bookingData && bookingData.user) invalidateCache(`users/${bookingData.user}`);
  return result;
};

export const updateReview = async (id, reviewData, invalidateCache) => {
  const result = await AdminAPI.updateReview(id, reviewData);
  // Invalidate related cache
  invalidateCache(`reviews/${id}`);
  invalidateCache(null, 'reviews');
  if (reviewData.tour) invalidateCache(`tours/${reviewData.tour}`);
  if (reviewData.user) invalidateCache(`users/${reviewData.user}`);
  return result;
};

export const deleteReview = async (id, reviewData, invalidateCache) => {
  const result = await AdminAPI.deleteReview(id);
  // Invalidate related cache
  invalidateCache(`reviews/${id}`);
  invalidateCache(null, 'reviews');
  invalidateCache('dashboard');
  if (reviewData && reviewData.tour) invalidateCache(`tours/${reviewData.tour}`);
  if (reviewData && reviewData.user) invalidateCache(`users/${reviewData.user}`);
  return result;
};
