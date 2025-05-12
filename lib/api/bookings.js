// API functionality for bookings

// Base API URL - adjust if needed based on your backend setup
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';
const BOOKINGS_API = `${API_URL}/bookings`;

// Get all bookings for the current user
export async function getUserBookings() {
  try {
    const response = await fetch('/api/bookings/my-bookings', {
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
        throw new Error('Please log in to access your bookings');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}

// Get details of a specific booking
export async function getBookingById(id) {
  try {
    const response = await fetch(`${BOOKINGS_API}/${id}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to access booking details');
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

// Create checkout session for a tour
export async function createBookingCheckout(tourId, participants = 1) {
  try {
    const response = await fetch(`/api/bookings/checkout-session/${tourId}?participants=${participants}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to book a tour');
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create checkout session`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Cancel a booking (if the backend supports this)
export async function cancelBooking(bookingId) {
  try {
    const response = await fetch(`${BOOKINGS_API}/${bookingId}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to cancel a booking');
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to cancel booking`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error canceling booking with ID ${bookingId}:`, error);
    throw error;
  }
}
