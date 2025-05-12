import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';
  const targetUrl = `${API_URL}/users/login`;
  
  console.log('Direct login request to:', targetUrl);

  try {
    // Get login credentials from request
    const body = await request.json();
    console.log('Login attempt for:', body.email);
    
    // Forward the login request to the backend
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Log response information
    console.log('Backend response status:', response.status);
    const responseData = await response.json();
    
    // Handle error responses
    if (!response.ok) {
      console.log('Login failed:', responseData.message);
      return NextResponse.json(responseData, { status: response.status });
    }
    
    console.log('Login successful, extracting token');
    
    // Get the JWT token from the response
    const jwt = responseData.token;
    
    if (!jwt) {
      console.error('No token found in login response');
      return NextResponse.json({
        status: 'error',
        message: 'No authentication token received from server'
      }, { status: 500 });
    }
    
    console.log('Token obtained, setting cookie');
    
    // Create a cookie for the JWT with httpOnly to protect it from JS access
    const cookie = serialize('jwt', jwt, {
      httpOnly: true, // Important: Makes cookie inaccessible to JavaScript
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 90 * 24 * 60 * 60, // 90 days in seconds
      sameSite: 'lax', // 'lax' allows the cookie to be sent on navigation
    });
    
    // Format the response in a structure expected by the client
    const formattedResponse = {
      status: 'success',
      token: 'TOKEN_HIDDEN_FOR_SECURITY', // Don't send the actual token back to the client
      user: responseData.data.user
    };
    
    // Create response with the data and the cookie
    const result = NextResponse.json(formattedResponse);
    result.headers.set('Set-Cookie', cookie);
    
    console.log('Cookie header set successfully');
    return result;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred during login: ' + error.message
    }, { status: 500 });
  }
}
