import { NextResponse } from 'next/server';

// Function to check if the JWT cookie exists
function hasCookie(request) {
  const cookie = request.cookies.get('jwt');
  return cookie && cookie.value !== 'Logged out';
}

export async function middleware(request) {
  // Check if the route is the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check if the user is logged in
    if (!hasCookie(request)) {
      // Redirect to login if not logged in
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Otherwise proceed - the dashboard component will handle checking the admin role
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
