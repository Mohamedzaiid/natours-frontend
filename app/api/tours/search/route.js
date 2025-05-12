import { NextResponse } from 'next/server';

// Get the backend URL from environment variables
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://natours-yslc.onrender.com';

export async function POST(request) {
  try {
    const { destination, dateRange, people } = await request.json();
    
    // Build query parameters for the backend API
    const queryParams = new URLSearchParams();
    
    // Add search parameters to query - use 'name' for destination to leverage our enhanced backend search
    if (destination) {
      queryParams.append('name', destination);
    }
    
    if (dateRange) {
      // Parse date range and add to query
      queryParams.append('date', dateRange);
    }
    
    if (people) {
      // Filter by max group size
      queryParams.append('maxGroupSize', people);
    }
    
    // Log the search query being sent
    console.log(`Searching tours with params: ${queryParams.toString()}`);
    
    // Make request to backend API - use the enhanced '/search' endpoint
    const response = await fetch(`${BACKEND_URL}/api/v1/tours/search?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Backend API error:', data);
      throw new Error(data.message || `Error searching tours: ${response.status} ${response.statusText}`);
    }
    
    // Log the number of results found
    console.log(`Found ${data.results || 0} matching tours`);

    // Return search results with enriched metadata
    return NextResponse.json({
      status: 'success',
      results: data.data?.data || [], 
      query: {
        destination, 
        dateRange, 
        people
      },
      searchTime: new Date().toISOString(),
      // Add helpful suggestion based on results
      suggestion: data.data?.data?.length === 0 
        ? "We couldn't find tours matching your exact criteria. Our AI can help create a custom itinerary for you." 
        : "Here are some tours that match your criteria. Our AI can help you choose the perfect one!"
    });
  } catch (error) {
    console.error('API error:', error);
    
    // Return empty results to trigger AI fallback
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Error searching for tours',
      results: [],
      query: {
        destination: request.body?.destination || '', 
        dateRange: request.body?.dateRange || '', 
        people: request.body?.people || ''
      },
      suggestion: "Let's create a custom travel plan tailored just for you!"
    }, { status: 200 }); // Still return 200 to allow frontend to handle fallback to AI
  }
}