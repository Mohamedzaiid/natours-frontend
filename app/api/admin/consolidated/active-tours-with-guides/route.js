import { NextResponse } from 'next/server';

// Get API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';
const ADMIN_API = `${API_URL}/admin`;

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
    
    if (data.status !== 'success' || !data.data || !data.data.data) {
      return { isAdmin: false, error: 'Invalid response from API', status: 500 };
    }
    
    const user = data.data.data;
    
    if (user.role !== 'admin' && user.role !== 'lead-guide') {
      return { isAdmin: false, error: 'Admin privileges required', status: 403 };
    }
    
    return { isAdmin: true, user };
  } catch (error) {
    console.error('Error checking admin role:', error);
    return { isAdmin: false, error: error.message, status: 500 };
  }
}

// GET handler for active tours with guides
export async function GET(request) {
  console.log('Admin API: GET active tours with guides request received');
  
  // Check if user is admin
  const { isAdmin, error, status } = await checkAdminRole(request);
  
  if (!isAdmin) {
    console.log(`Admin access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin access verified, fetching active tours with guides');
  
  // Get cookie for authentication
  const cookieHeader = request.headers.get('cookie');
  
  try {
    // Forward the request to our consolidated backend API
    const response = await fetch(`${ADMIN_API}/active-tours-with-guides`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { status: 'error', message: errorData.message || `Error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Add cache control headers (client-side caching)
    const headers = new Headers();
    headers.append('Cache-Control', 'public, max-age=600'); // 10 minutes
    
    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error('Error in admin/consolidated/active-tours-with-guides GET route:', error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
