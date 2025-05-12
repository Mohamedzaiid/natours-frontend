import { NextResponse } from 'next/server';

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  
  // Parse the cookie string
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key) acc[key] = value;
    return acc;
  }, {});
  
  // Check for jwt cookie
  const hasJwt = !!cookies['jwt'];
  
  return NextResponse.json({
    status: 'success',
    hasJwt,
    cookies: Object.keys(cookies)
  });
}
