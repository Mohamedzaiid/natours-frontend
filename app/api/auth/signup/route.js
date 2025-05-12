import { NextResponse } from 'next/server';

export async function POST(request) {
  // Use the correct backend API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';
  const targetUrl = `${API_URL}/users/signup`;
  
  console.log('Direct signup request to:', targetUrl);

  try {
    // Get the signup data
    const body = await request.json();
    console.log('Signup attempt for email:', body.email);
    
    // Additional email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({
        status: 'fail',
        message: 'Please provide a valid email address',
      }, { status: 400 });
    }
    
    // Avoid example.com domains as they might be blocked
    if (body.email.endsWith('@example.com')) {
      return NextResponse.json({
        status: 'fail',
        message: 'Please use a real email address, not an example domain',
      }, { status: 400 });
    }
    
    // Validate the data before sending to backend
    if (!body.name || !body.email || !body.password || !body.passwordConfirm) {
      return NextResponse.json({
        status: 'fail',
        message: 'Missing required fields',
      }, { status: 400 });
    }

    if (body.password !== body.passwordConfirm) {
      return NextResponse.json({
        status: 'fail',
        message: 'Passwords do not match',
      }, { status: 400 });
    }
    
    // Send the request to the backend
    let res;
    try {
      res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      console.log('Backend signup response status:', res.status);
    } catch (fetchError) {
      console.error('Network error during signup:', fetchError);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Network error connecting to the authentication service. Please try again later.' 
      }, { status: 503 });
    }

    // Get the response data
    let data;
    const textResponse = await res.text();
    
    try {
      data = JSON.parse(textResponse);
      console.log('Signup response data parsed successfully');
    } catch (e) {
      console.error('Failed to parse JSON response:', e, 'Raw response:', textResponse);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Invalid response from server' 
      }, { status: 500 });
    }
    
    // If the response is not successful, return the error
    if (!res.ok) {
      console.log('Backend signup failed:', data);
      
      // For 500 errors, provide a more user-friendly message
      if (res.status === 500) {
        console.error('Backend server error during signup');
        
        // Try to check if the backend is actually reachable
        try {
          const healthCheck = await fetch(`${API_URL}/users`, { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('Backend health check status:', healthCheck.status);
          
          // If we can reach the API but got a 500, it's likely an issue with the specific request
          if (healthCheck.ok) {
            return NextResponse.json({
              status: 'fail',
              message: 'The server encountered an issue with your signup request. This might be because the email is already registered or there was a problem validating your information.',
            }, { status: 400 });
          }
        } catch (healthCheckError) {
          console.error('Backend appears to be unreachable:', healthCheckError);
        }
        
        // General server error message
        return NextResponse.json({
          status: 'fail',
          message: 'Server error processing your request. Please try again later.',
        }, { status: 500 });
      }
      
      return NextResponse.json({
        status: 'fail',
        message: data.message || 'Signup failed',
      }, { status: res.status });
    }

    // Simply pass through the exact response from the backend
    // This ensures we don't lose any data structure the frontend expects
    const response = NextResponse.json(data);
    
    // IMPORTANT: Copy all cookies from the response
    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('Found Set-Cookie header, forwarding it...');
      response.headers.set('Set-Cookie', setCookieHeader);
    } else {
      console.log('No Set-Cookie header found, creating one...');
      // If no cookie was set by the backend, create one with the JWT
      if (data.token) {
        // Set the cookie to expire in 90 days
        const expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        response.headers.set('Set-Cookie', `jwt=${data.token}; Path=/; Expires=${expires.toUTCString()}; HttpOnly; SameSite=Lax`);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Error during signup: ' + error.message 
    }, { status: 500 });
  }
}
