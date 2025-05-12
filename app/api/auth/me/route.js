import { NextResponse } from "next/server";

export async function GET(request) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://natours-yslc.onrender.com/api/v1";
  const targetUrl = `${API_URL}/users/me`;

  console.log("Request to /api/auth/me endpoint");

  try {
    // Get all cookies from the browser request - httpOnly cookies will automatically be included
    const cookieHeader = request.headers.get("cookie");
    
    // We don't need to parse the cookie ourselves, just pass it to the backend
    // The browser will automatically include httpOnly cookies in the request
    
    // Forward the request with all cookies to the backend API
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        // Forward the original cookies - this is the crucial part!
        Cookie: cookieHeader || '',
      },
      credentials: 'include',
    });

    // Log the backend response
    console.log("Backend response status:", response.status);

    if (response.status === 401) {
      console.log("User is not authenticated (401)");
      return NextResponse.json(
        { status: "fail", message: "Not authenticated" },
        { status: 401 }
      );
    }

    if (!response.ok) {
      console.log("Backend error response:", response.status);
      return NextResponse.json(
        { status: "fail", message: "Backend error" },
        { status: response.status }
      );
    }

    // Parse the response from the backend
    const data = await response.json();
    console.log("User data retrieved successfully");

    // Format response with consistent status
    const formattedResponse = {
      status: "success",
      data: data.data // The user data
    };

    // Forward the response to the client
    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error retrieving user information: " + error.message
      },
      { status: 500 }
    );
  }
}
