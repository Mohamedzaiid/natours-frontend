import { NextResponse } from 'next/server';

// Get API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';
const USERS_API = `${API_URL}/users`;

// Helper function to check admin role
async function checkAdminRole(request) {
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
      return { isAdmin: false, error: 'Not authenticated', status: 401 };
    }
    
    const data = await response.json();
    
    if (data.status !== 'sucess' || !data.data || !data.data.data) {
      return { isAdmin: false, error: 'Invalid response from API', status: 500 };
    }
    
    const user = data.data.data;
    
    if (user.role !== 'admin') {
      return { isAdmin: false, error: 'Admin privileges required', status: 403 };
    }
    
    return { isAdmin: true, user };
  } catch (error) {
    console.error('Error checking admin role:', error);
    return { isAdmin: false, error: error.message, status: 500 };
  }
}

// GET handler to fetch all guides (users with guide or lead-guide role)
export async function GET(request) {
  console.log('Admin API: GET all guides request received');
  
  // Check if user is admin
  const { isAdmin, error, status } = await checkAdminRole(request);
  
  if (!isAdmin) {
    console.log(`Admin access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin access verified, fetching guides');
  
  // We'll use the users endpoint with a filter for roles
  try {
    const cookieHeader = request.headers.get('cookie');
    
    // Fetch all users first (ideally there would be a filter option in the API)
    const response = await fetch(USERS_API, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });
    
    // Log response status
    console.log(`Backend users API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Error fetching guides from backend' },
        { status: response.status }
      );
    }
    
    // Parse the response
    const data = await response.json();
    
    // Filter only users with guide or lead-guide roles
    const guides = data.data.data.filter(user => 
      user.role === 'guide' || user.role === 'lead-guide'
    );
    
    // Return the filtered guides
    console.log(`Successfully fetched ${guides.length} guides`);
    
    return NextResponse.json({
      status: 'success',
      results: guides.length,
      data: {
        data: guides
      }
    });
  } catch (error) {
    console.error('Error in admin/guides GET route:', error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}