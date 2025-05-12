import { NextResponse } from 'next/server';

// Get API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';
const TOURS_API = `${API_URL}/tours`;

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

// GET handler to fetch a specific tour
export async function GET(request, { params }) {
  const { id } = params;
  console.log(`Admin API: GET tour with ID ${id}`);
  
  // Check if user is admin or lead-guide
  const { isAuthorized, error, status } = await checkAdminOrLeadGuideRole(request);
  
  if (!isAuthorized) {
    console.log(`Admin/lead-guide access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin/lead-guide access verified, fetching tour');
  
  // Forward request to backend API
  try {
    const cookieHeader = request.headers.get('cookie');
    
    const response = await fetch(`${TOURS_API}/${id}`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });
    
    // Log response status
    console.log(`Backend tour API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Error fetching tour from backend' },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    const data = await response.json();
    console.log(`Successfully fetched tour: ${data.data?.data?.name || id}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in admin/tours/${id} GET route:`, error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// PATCH handler to update a tour
export async function PATCH(request, { params }) {
  const { id } = params;
  console.log(`Admin API: PATCH tour with ID ${id}`);
  
  // Check if user is admin or lead-guide
  const { isAuthorized, error, status } = await checkAdminOrLeadGuideRole(request);
  
  if (!isAuthorized) {
    console.log(`Admin/lead-guide access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin/lead-guide access verified, updating tour');
  
  try {
    // Get FormData from request
    const formData = await request.formData();
    console.log('Update tour data received as FormData');
    
    // Create a regular object from FormData for transformation
    const tourData = {};
    for (const [key, value] of formData.entries()) {
      // Skip files to handle them separately
      if (key !== 'imageCover' && !key.startsWith('images')) {
        tourData[key] = value;
      }
    }
    
    // Process special fields
    if (formData.has('startDates')) {
      try {
        // Parse startDates JSON string back to an array
        const startDatesStr = formData.get('startDates');
        if (typeof startDatesStr === 'string') {
          const dates = JSON.parse(startDatesStr);
          // Remove the original string value
          formData.delete('startDates');
          // Create a new form with proper dates
          if (Array.isArray(dates)) {
            dates.forEach((date) => {
              formData.append('startDates', date);
            });
          }
        }
      } catch (err) {
        console.error('Error parsing startDates:', err);
      }
    }
    
    if (formData.has('locations')) {
      try {
        // Parse locations JSON string back to an array
        const locationsStr = formData.get('locations');
        if (typeof locationsStr === 'string') {
          formData.delete('locations');
          // The backend expects location objects as separate fields
          // This is how multipart form handles nested data
          const locations = JSON.parse(locationsStr);
          if (Array.isArray(locations)) {
            locations.forEach((loc, i) => {
              formData.append(`locations[${i}][type]`, 'Point'); // Always set type to Point for GeoJSON
              if (loc.description) formData.append(`locations[${i}][description]`, loc.description);
              if (loc.day) formData.append(`locations[${i}][day]`, loc.day);
              if (loc.coordinates && Array.isArray(loc.coordinates)) {
                formData.append(`locations[${i}][coordinates][0]`, loc.coordinates[0] || 0);
                formData.append(`locations[${i}][coordinates][1]`, loc.coordinates[1] || 0);
              }
            });
          }
        }
      } catch (err) {
        console.error('Error parsing locations:', err);
      }
    }
    
    if (formData.has('startLocation')) {
      try {
        // Parse startLocation JSON string back to an object
        const startLocationStr = formData.get('startLocation');
        if (typeof startLocationStr === 'string') {
          formData.delete('startLocation');
          const startLocation = JSON.parse(startLocationStr);
          formData.append('startLocation[type]', 'Point'); // Always set type to Point for GeoJSON
          if (startLocation.description) formData.append('startLocation[description]', startLocation.description);
          if (startLocation.address) formData.append('startLocation[adress]', startLocation.address); // Note the spelling 'adress' matches the backend model
          if (startLocation.coordinates && Array.isArray(startLocation.coordinates)) {
            formData.append('startLocation[coordinates][0]', startLocation.coordinates[0] || 0);
            formData.append('startLocation[coordinates][1]', startLocation.coordinates[1] || 0);
          }
        }
      } catch (err) {
        console.error('Error parsing startLocation:', err);
      }
    }
    
    if (formData.has('guides')) {
      try {
        // Parse guides JSON string back to an array
        const guidesStr = formData.get('guides');
        if (typeof guidesStr === 'string') {
          formData.delete('guides');
          const guides = JSON.parse(guidesStr);
          if (Array.isArray(guides)) {
            guides.forEach((guideId) => {
              formData.append('guides', guideId);
            });
          }
        }
      } catch (err) {
        console.error('Error parsing guides:', err);
      }
    }
    
    // Log the keys being sent (for debugging)
    console.log('Form data keys:', Array.from(formData.keys()));
    
    // Get cookies for authentication
    const cookieHeader = request.headers.get('cookie');
    
    // Send request to backend
    const response = await fetch(`${TOURS_API}/${id}`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieHeader || '',
        // Don't set Content-Type - the browser will set it with the boundary
      },
      body: formData,
    });
    
    // Log response status
    console.log(`Backend tour update API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorData.message || 'Error updating tour' 
        },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    const data = await response.json();
    console.log(`Successfully updated tour: ${data.data?.data?.name || id}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in admin/tours/${id} PATCH route:`, error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a tour
export async function DELETE(request, { params }) {
  const { id } = params;
  console.log(`Admin API: DELETE tour with ID ${id}`);
  
  // Check if user is admin or lead-guide
  const { isAuthorized, error, status } = await checkAdminOrLeadGuideRole(request);
  
  if (!isAuthorized) {
    console.log(`Admin/lead-guide access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin/lead-guide access verified, deleting tour');
  
  try {
    // Get cookies for authentication
    const cookieHeader = request.headers.get('cookie');
    
    // Send request to backend
    const response = await fetch(`${TOURS_API}/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });
    
    // Log response status
    console.log(`Backend tour delete API response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorData.message || 'Error deleting tour' 
        },
        { status: response.status }
      );
    }
    
    // Parse and return successful response
    return NextResponse.json({ 
      status: 'success',
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error(`Error in admin/tours/${id} DELETE route:`, error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
