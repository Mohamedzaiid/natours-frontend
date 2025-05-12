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

// GET handler to fetch a specific user
export async function GET(request, { params }) {
  const { id } = params;
  console.log(`Admin API: GET user with ID ${id}`);
  
  // Check if user is admin
  const { isAdmin, error, status } = await checkAdminRole(request);
  
  if (!isAdmin) {
    console.log(`Admin access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin access verified, fetching user');
  
  // Forward request to backend API
  try {
    const cookieHeader = request.headers.get('cookie');
    
    const response = await fetch(`${USERS_API}/${id}`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });
    
    // Log response status
    console.log(`Backend user API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Error fetching user from backend' },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    const data = await response.json();
    console.log(`Successfully fetched user: ${data.data?.data?.name || id}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in admin/users/${id} GET route:`, error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// PATCH handler to update a user
export async function PATCH(request, { params }) {
  const { id } = params;
  console.log(`Admin API: PATCH user with ID ${id}`);
  
  // Check if user is admin
  const { isAdmin, error, status } = await checkAdminRole(request);
  
  if (!isAdmin) {
    console.log(`Admin access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin access verified, updating user');
  
  try {
    // Get request body
    const userData = await request.json();
    console.log('Update user data:', userData);
    
    // Get cookies for authentication
    const cookieHeader = request.headers.get('cookie');
    
    // Send request to backend
    const response = await fetch(`${USERS_API}/${id}`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    // Log response status
    console.log(`Backend user update API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorData.message || 'Error updating user' 
        },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    const data = await response.json();
    console.log(`Successfully updated user: ${data.data?.data?.name || id}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in admin/users/${id} PATCH route:`, error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a user
export async function DELETE(request, { params }) {
  const { id } = params;
  console.log(`Admin API: DELETE user with ID ${id}`);
  
  // Check if user is admin
  const { isAdmin, error, status } = await checkAdminRole(request);
  
  if (!isAdmin) {
    console.log(`Admin access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin access verified, deleting user');
  
  try {
    // Get cookies for authentication
    const cookieHeader = request.headers.get('cookie');
    
    // Send request to backend
    const response = await fetch(`${USERS_API}/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });
    
    // Log response status
    console.log(`Backend user delete API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorData.message || 'Error deleting user' 
        },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    return NextResponse.json({ 
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error(`Error in admin/users/${id} DELETE route:`, error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
