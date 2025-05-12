// Get all guides (users with role 'guide' or 'lead-guide')
export async function getAllGuides() {
  try {
    const response = await fetch('/api/admin/guides', {
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
    console.error('Error fetching guides:', error);
    throw error;
  }
}

// Admin API service module
// This file provides functions to interact with admin-specific API endpoints

// User Management API Functions
export async function createUser(userData) {
  try {
    const response = await fetch('/api/admin/users/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const response = await fetch('/api/admin/users', {
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
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const response = await fetch(`/api/admin/users/${id}`, {
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
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
}

export async function updateUser(id, userData) {
  try {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
}

// Tour Management API Functions
export async function getAllTours() {
  try {
    const response = await fetch('/api/admin/tours', {
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
    console.error('Error fetching tours:', error);
    throw error;
  }
}

export async function getTourById(id) {
  try {
    const response = await fetch(`/api/admin/tours/${id}`, {
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
    console.error(`Error fetching tour with ID ${id}:`, error);
    throw error;
  }
}

export async function createTour(tourData) {
  try {
    // Create a FormData object to handle file uploads
    const formData = new FormData();
    
    // Add the tour data fields to FormData
    Object.keys(tourData).forEach(key => {
      // Skip file objects for now
      if (key !== 'imageCover' && key !== 'images') {
        // Handle arrays and objects
        if (typeof tourData[key] === 'object' && !(tourData[key] instanceof File)) {
          formData.append(key, JSON.stringify(tourData[key]));
        } else {
          formData.append(key, tourData[key]);
        }
      }
    });
    
    // Add the image files
    if (tourData.imageCover instanceof File) {
      formData.append('imageCover', tourData.imageCover);
    }
    
    if (tourData.images && tourData.images.length > 0) {
      // Filter only File objects
      tourData.images.forEach((image, i) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }
    
    const response = await fetch(`/api/admin/tours`, {
      method: 'POST',
      credentials: 'include',
      // Don't set Content-Type header, it will be set automatically with boundary
      body: formData,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error('Error creating tour:', error);
    throw error;
  }
}

export async function updateTour(id, tourData) {
  try {
    // Create a FormData object to handle file uploads
    const formData = new FormData();
    
    // Add the tour data fields to FormData
    Object.keys(tourData).forEach(key => {
      // Skip file objects for now
      if (key !== 'imageCover' && key !== 'images') {
        // Handle arrays and objects
        if (typeof tourData[key] === 'object' && !(tourData[key] instanceof File)) {
          formData.append(key, JSON.stringify(tourData[key]));
        } else {
          formData.append(key, tourData[key]);
        }
      }
    });
    
    // Add the image files
    if (tourData.imageCover instanceof File) {
      formData.append('imageCover', tourData.imageCover);
    }
    
    if (tourData.images && tourData.images.length > 0) {
      // Filter only File objects
      tourData.images.forEach((image, i) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }
    
    const response = await fetch(`/api/admin/tours/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      // Don't set Content-Type header, it will be set automatically with boundary
      body: formData,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error(`Error updating tour with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteTour(id) {
  try {
    const response = await fetch(`/api/admin/tours/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting tour with ID ${id}:`, error);
    throw error;
  }
}

// Tour Image Upload
export async function uploadTourImages(id, formData) {
  try {
    const response = await fetch(`/api/admin/tours/${id}/images`, {
      method: 'PATCH',
      credentials: 'include',
      body: formData, // Do not set Content-Type header, it will be set automatically with boundary
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error(`Error uploading images for tour with ID ${id}:`, error);
    throw error;
  }
}

// Booking Management API Functions
export async function getAllBookings() {
  try {
    const response = await fetch('/api/admin/bookings', {
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
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

export async function getBookingById(id) {
  try {
    const response = await fetch(`/api/admin/bookings/${id}`, {
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
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
}

export async function createBooking(bookingData) {
  try {
    const response = await fetch('/api/admin/bookings', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function updateBooking(id, bookingData) {
  try {
    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error(`Error updating booking with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteBooking(id) {
  try {
    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting booking with ID ${id}:`, error);
    throw error;
  }
}

// Review Management API Functions
export async function getAllReviews() {
  try {
    const response = await fetch('/api/admin/reviews', {
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
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

export async function getReviewById(id) {
  try {
    const response = await fetch(`/api/admin/reviews/${id}`, {
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
    console.error(`Error fetching review with ID ${id}:`, error);
    throw error;
  }
}

export async function updateReview(id, reviewData) {
  try {
    const response = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error(`Error updating review with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteReview(id) {
  try {
    const response = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in as admin to perform this action');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error);
    throw error;
  }
}

// Dashboard Statistics API Functions
export async function getDashboardStats() {
  try {
    const response = await fetch('/api/admin/stats', {
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
    console.error('Error fetching dashboard statistics:', error);
    throw error;
  }
}
