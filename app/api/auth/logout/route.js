import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';
  const targetUrl = `${API_URL}/users/logout`;
  
  console.log('Logout request initiated');

  try {
    // Forward the request to the backend with cookies
    const cookieHeader = request.headers.get('cookie');
    
    // Extract the jwt token to include in Authorization header
    let jwtToken = '';
    if (cookieHeader) {
      const cookies = cookieHeader.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'jwt') {
          jwtToken = value;
          break;
        }
      }
    }
    
    // Make the logout request to the backend
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader || '',
        ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` }),
      },
      credentials: 'include',
    });

    console.log('Backend logout response status:', response.status);
    
    // Create a response to clear the JWT cookie
    const emptyJwtCookie = serialize('jwt', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0), // This will make the cookie expire immediately
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });
    
    // Return a success response with the cookie clearing header
    const result = NextResponse.json({
      status: 'success',
      message: 'Logged out successfully'
    });
    result.headers.set('Set-Cookie', emptyJwtCookie);
    
    return result;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, we still want to clear the cookie
    const emptyJwtCookie = serialize('jwt', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });
    
    const result = NextResponse.json({
      status: 'success',
      message: 'Logged out client-side'
    });
    result.headers.set('Set-Cookie', emptyJwtCookie);
    
    return result;
  }
}
