import { NextResponse } from 'next/server';

// Get API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';
const BOOKINGS_API = `${API_URL}/bookings`;

// Helper function to check admin or lead-guide role
async function checkAdminOrLeadGuideRole(request) {
  // Forward request to backend to check auth status and user role
  const cookieHeader = request.headers.get('cookie');
  
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader || '',
      },
    });
    
    if (!response.ok) {
      return { isAuthorized: false, error: 'Not authenticated', status: 401 };
    }
    
    const data = await response.json();
    
    if (data.status !== 'sucess' || !data.data || !data.data.data) {
      return { isAuthorized: false, error: 'Invalid response from API', status: 500 };
    }
    
    const user = data.data.data;
    
    // Check if user has admin or lead-guide role
    if (user.role !== 'admin' && user.role !== 'lead-guide') {
      return { isAuthorized: false, error: 'Admin or lead-guide privileges required', status: 403 };
    }
    
    return { isAuthorized: true, user };
  } catch (error) {
    console.error('Error checking admin/lead-guide role:', error);
    return { isAuthorized: false, error: error.message, status: 500 };
  }
}

// GET handler to fetch a specific booking
export async function GET(request, { params }) {
  const { id } = params;
  console.log(`Admin API: GET booking with ID ${id}`);
  
  // Check if user is admin or lead-guide
  const { isAuthorized, error, status } = await checkAdminOrLeadGuideRole(request);
  
  if (!isAuthorized) {
    console.log(`Admin/lead-guide access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin/lead-guide access verified, fetching booking');
  
  // Forward request to backend API
  try {
    const cookieHeader = request.headers.get('cookie');
    
    const response = await fetch(`${BOOKINGS_API}/${id}`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });
    
    // Log response status
    console.log(`Backend booking API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Error fetching booking from backend' },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    const data = await response.json();
    console.log(`Successfully fetched booking: ${data.data?.data?._id || id}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in admin/bookings/${id} GET route:`, error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// PATCH handler to update a booking
export async function PATCH(request, { params }) {
  const { id } = params;
  console.log(`Admin API: PATCH booking with ID ${id}`);
  
  // Check if user is admin or lead-guide
  const { isAuthorized, error, status } = await checkAdminOrLeadGuideRole(request);
  
  if (!isAuthorized) {
    console.log(`Admin/lead-guide access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin/lead-guide access verified, updating booking');
  
  try {
    // Get request body
    const bookingData = await request.json();
    console.log('Update booking data received');
    
    // Get cookies for authentication
    const cookieHeader = request.headers.get('cookie');
    
    // Send request to backend
    const response = await fetch(`${BOOKINGS_API}/${id}`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    // Log response status
    console.log(`Backend booking update API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorData.message || 'Error updating booking' 
        },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    const data = await response.json();
    console.log(`Successfully updated booking: ${data.data?.data?._id || id}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in admin/bookings/${id} PATCH route:`, error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a booking
export async function DELETE(request, { params }) {
  const { id } = params;
  console.log(`Admin API: DELETE booking with ID ${id}`);
  
  // Check if user is admin or lead-guide
  const { isAuthorized, error, status } = await checkAdminOrLeadGuideRole(request);
  
  if (!isAuthorized) {
    console.log(`Admin/lead-guide access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin/lead-guide access verified, deleting booking');
  
  try {
    // Get cookies for authentication
    const cookieHeader = request.headers.get('cookie');
    
    // Send request to backend
    const response = await fetch(`${BOOKINGS_API}/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });
    
    // Log response status
    console.log(`Backend booking delete API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorData.message || 'Error deleting booking' 
        },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    return NextResponse.json({ 
      status: 'success',
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error(`Error in admin/bookings/${id} DELETE route:`, error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
