import { NextResponse } from "next/server";

export async function GET(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://natours-yslc.onrender.com/api/v1";
  const targetUrl = `${API_URL}/bookings/my-bookings`;

  console.log("Request to /api/bookings/my-bookings endpoint");
  
  try {
    // Get cookies from the browser request
    const cookieHeader = request.headers.get("cookie");
    
    // Forward the request to backend API
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        // Forward cookies for authentication
        Cookie: cookieHeader || '',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      credentials: 'include',
    });

    // Log backend response status
    console.log("Backend bookings response status:", response.status);

    // Handle unauthorized errors
    if (response.status === 401) {
      console.log("User is not authenticated (401)");
      return NextResponse.json(
        { status: "fail", message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Handle other errors
    if (!response.ok) {
      console.log("Backend error response:", response.status);
      return NextResponse.json(
        { status: "fail", message: "Backend error" },
        { status: response.status }
      );
    }

    // Parse successful response
    const data = await response.json();
    console.log("Bookings data retrieved successfully",data);

    // Return response to client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting user bookings:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error retrieving booking information: " + error.message
      },
      { status: 500 }
    );
  }
}
