import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { tourId } = params;
  const url = new URL(request.url);
  const participants = url.searchParams.get('participants') || 1;
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://natours-yslc.onrender.com/api/v1";
  const targetUrl = `${API_URL}/bookings/checkout-session/${tourId}?participants=${participants}`;

  console.log(`Request to /api/bookings/checkout-session/${tourId} endpoint`);
  
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
    console.log("Backend checkout session response status:", response.status);

    // Handle unauthorized errors
    if (response.status === 401) {
      console.log("User is not authenticated (401)");
      return NextResponse.json(
        { status: "fail", message: "Please log in to book a tour" },
        { status: 401 }
      );
    }

    // Handle other errors
    if (!response.ok) {
      console.log("Backend error response:", response.status);
      const errorData = await response.json();
      return NextResponse.json(
        { status: "fail", message: errorData.message || "Backend error" },
        { status: response.status }
      );
    }

    // Parse successful response
    const data = await response.json();
    console.log("Checkout session created successfully");

    // Return response to client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error creating checkout session: " + error.message
      },
      { status: 500 }
    );
  }
}
