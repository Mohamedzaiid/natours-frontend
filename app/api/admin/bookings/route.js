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

// GET handler to fetch all bookings
export async function GET(request) {
  console.log('Admin API: GET all bookings request received');
  
  // Check if user is admin or lead-guide
  const { isAuthorized, error, status } = await checkAdminOrLeadGuideRole(request);
  
  if (!isAuthorized) {
    console.log(`Admin/lead-guide access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin/lead-guide access verified, fetching bookings');
  
  // Forward request to backend API
  try {
    const cookieHeader = request.headers.get('cookie');
    
    const response = await fetch(BOOKINGS_API, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });
    
    // Log response status
    console.log(`Backend bookings API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Error fetching bookings from backend' },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    const data = await response.json();
    console.log(`Successfully fetched ${data.results || 0} bookings`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in admin/bookings GET route:', error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST handler to create a new booking (admin functionality)
export async function POST(request) {
  console.log('Admin API: POST new booking request received');
  
  // Check if user is admin or lead-guide
  const { isAuthorized, error, status } = await checkAdminOrLeadGuideRole(request);
  
  if (!isAuthorized) {
    console.log(`Admin/lead-guide access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin/lead-guide access verified, creating booking');
  
  try {
    // Get request body
    const bookingData = await request.json();
    console.log('Booking creation data received');
    
    // Get cookies for authentication
    const cookieHeader = request.headers.get('cookie');
    
    // Send request to backend
    const response = await fetch(BOOKINGS_API, {
      method: 'POST',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    // Log response status
    console.log(`Backend booking creation API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorData.message || 'Error creating booking' 
        },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    const data = await response.json();
    console.log(`Successfully created booking: ${data.data?.data?._id || 'New Booking'}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in admin/bookings POST route:', error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
