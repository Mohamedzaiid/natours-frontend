import { NextResponse } from "next/server";

// Base URL for our backend API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://natours-yslc.onrender.com/api/v1";

// Helper function to forward requests to backend
async function forwardRequest(request, method, body = null) {
  // Target URL for wishlist operations
  const targetUrl = `${API_URL}/wishlist`;

  try {
    // Get cookies from the browser request
    const cookieHeader = request.headers.get("cookie");

    // Setup request options
    const requestOptions = {
      method: method,
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    // Add body if provided (for POST/PUT requests)
    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    // Forward the request to the backend
    const response = await fetch(targetUrl, requestOptions);

    // Check for authentication error
    if (response.status === 401) {
      console.log("User is not authenticated (401)");
      return NextResponse.json(
        { status: "fail", message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Handle general errors
    if (!response.ok) {
      console.log(`Backend error response: ${response.status}`);
      let errorMessage = "Backend error";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse the error, use the default message
      }
      
      return NextResponse.json(
        { status: "fail", message: errorMessage },
        { status: response.status }
      );
    }

    // Parse and return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in ${method} wishlist request:`, error);
    return NextResponse.json(
      {
        status: "error",
        message: `Error processing wishlist request: ${error.message}`
      },
      { status: 500 }
    );
  }
}

// Get the user's wishlist
export async function GET(request) {
  console.log("Request to GET /api/wishlist endpoint");
  return forwardRequest(request, "GET");
}

// Add a tour to the wishlist
export async function POST(request) {
  console.log("Request to POST /api/wishlist endpoint");
  
  try {
    // Parse the request body
    const body = await request.json();
    return forwardRequest(request, "POST", body);
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Invalid request body"
      },
      { status: 400 }
    );
  }
}

// Clear the entire wishlist
export async function DELETE(request) {
  console.log("Request to DELETE /api/wishlist endpoint");
  return forwardRequest(request, "DELETE");
}
