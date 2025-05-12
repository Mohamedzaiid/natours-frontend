import { NextResponse } from "next/server";

// Base URL for our backend API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://natours-yslc.onrender.com/api/v1";

// Sync local wishlist with the server
export async function POST(request) {
  console.log("Request to POST /api/wishlist/sync endpoint");
  
  // Target URL for wishlist sync
  const targetUrl = `${API_URL}/wishlist/sync`;

  try {
    // Parse the request body
    const body = await request.json();
    
    // Get cookies from the browser request
    const cookieHeader = request.headers.get("cookie");

    // Forward the request to the backend
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Cookie: cookieHeader || '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body)
    });

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
    console.error("Error syncing wishlist:", error);
    return NextResponse.json(
      {
        status: "error",
        message: `Error syncing wishlist: ${error.message}`
      },
      { status: 500 }
    );
  }
}
