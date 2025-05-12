import { NextResponse } from 'next/server';

// Get API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';

// Helper function to check admin role
async function checkAdminRole(request) {
  // Forward request to backend to check auth status and user role
  const cookieHeader = request.headers.get('cookie');
  
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader || '',
      },
    });
    
    if (!response.ok) {
      return { isAdmin: false, error: 'Not authenticated', status: 401 };
    }
    
    const data = await response.json();
    
    if (data.status !== 'sucess' || !data.data || !data.data.data) {
      return { isAdmin: false, error: 'Invalid response from API', status: 500 };
    }
    
    const user = data.data.data;
    
    if (user.role !== 'admin') {
      return { isAdmin: false, error: 'Admin privileges required', status: 403 };
    }
    
    return { isAdmin: true, user };
  } catch (error) {
    console.error('Error checking admin role:', error);
    return { isAdmin: false, error: error.message, status: 500 };
  }
}

// GET handler to fetch dashboard statistics
export async function GET(request) {
  console.log('Admin API: GET dashboard statistics request received');
  
  // Check if user is admin
  const { isAdmin, error, status } = await checkAdminRole(request);
  
  if (!isAdmin) {
    console.log(`Admin access denied: ${error}`);
    return NextResponse.json({ status: 'error', message: error }, { status });
  }
  
  console.log('Admin access verified, fetching statistics');
  
  // Get cookie for authentication
  const cookieHeader = request.headers.get('cookie');
  
  try {
    // Make API calls to fetch all the data we need for the dashboard
    const [usersRes, toursRes, bookingsRes, reviewsRes, tourStatsRes] = await Promise.all([
      // Fetch users count
      fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          Cookie: cookieHeader || '',
          'Content-Type': 'application/json',
        }
      }),
      
      // Fetch tours count
      fetch(`${API_URL}/tours`, {
        method: 'GET',
        headers: {
          Cookie: cookieHeader || '',
          'Content-Type': 'application/json',
        }
      }),
      
      // Fetch bookings count
      fetch(`${API_URL}/bookings`, {
        method: 'GET',
        headers: {
          Cookie: cookieHeader || '',
          'Content-Type': 'application/json',
        }
      }),
      
      // Fetch reviews count
      fetch(`${API_URL}/reviews`, {
        method: 'GET',
        headers: {
          Cookie: cookieHeader || '',
          'Content-Type': 'application/json',
        }
      }),
      
      // Fetch tour stats
      fetch(`${API_URL}/tours/tours-stats`, {
        method: 'GET',
        headers: {
          Cookie: cookieHeader || '',
          'Content-Type': 'application/json',
        }
      })
    ]);
    
    // Process the responses
    if (!usersRes.ok || !toursRes.ok || !bookingsRes.ok || !reviewsRes.ok || !tourStatsRes.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Error fetching all required data' },
        { status: 500 }
      );
    }
    
    // Parse the responses
    const [usersData, toursData, bookingsData, reviewsData, tourStatsData] = await Promise.all([
      usersRes.json(),
      toursRes.json(),
      bookingsRes.json(),
      reviewsRes.json(),
      tourStatsRes.json()
    ]);
    
    // Format the data for the dashboard
    const stats = {
      counts: {
        users: usersData.result || 0,
        tours: toursData.result || 0,
        bookings: bookingsData.result || 0,
        reviews: reviewsData.result || 0
      },
      tourStats: tourStatsData.data?.stats || [],
      revenue: calculateRevenue(bookingsData.data?.data || []),
      recentUsers: extractRecentUsers(usersData.data?.data || []),
      recentBookings: extractRecentBookings(bookingsData.data?.data || []),
      topTours: extractTopTours(toursData.data?.data || [])
    };
    
    console.log('Successfully compiled dashboard statistics');
    
    return NextResponse.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Error in admin/stats GET route:', error);
    return NextResponse.json(
      { status: 'error', message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// Helper functions for data processing
function calculateRevenue(bookings) {
  if (!bookings || !bookings.length) return { total: 0, trend: 0 };
  
  // Calculate total revenue
  const total = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
  
  // Get last month's bookings for trend
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  
  const lastMonthBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= lastMonth && bookingDate < now;
  });
  
  const twoMonthsAgoBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= twoMonthsAgo && bookingDate < lastMonth;
  });
  
  const lastMonthRevenue = lastMonthBookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
  const twoMonthsAgoRevenue = twoMonthsAgoBookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
  
  // Calculate trend percentage
  let trend = 0;
  if (twoMonthsAgoRevenue > 0) {
    trend = ((lastMonthRevenue - twoMonthsAgoRevenue) / twoMonthsAgoRevenue) * 100;
  }
  
  return {
    total: total,
    lastMonth: lastMonthRevenue,
    twoMonthsAgo: twoMonthsAgoRevenue,
    trend: Math.round(trend)
  };
}

function extractRecentUsers(users) {
  // Sort users by creation date (newest first) and take the first 5
  return users
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
      joined: user.createdAt
    }));
}

function extractRecentBookings(bookings) {
  // Sort bookings by creation date (newest first) and take the first 5
  return bookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(booking => ({
      id: booking._id,
      tour: booking.tour?.name || 'Unknown Tour',
      user: booking.user?.name || 'Unknown User',
      price: booking.price,
      date: booking.createdAt,
      paid: booking.paid ? 'Paid' : 'Pending'
    }));
}

function extractTopTours(tours) {
  // Sort tours by ratings and bookings
  return tours
    .sort((a, b) => b.ratingsAverage - a.ratingsAverage)
    .slice(0, 5)
    .map(tour => ({
      id: tour._id,
      name: tour.name,
      price: tour.price,
      ratingsAverage: tour.ratingsAverage,
      ratingsQuantity: tour.ratingsQuantity,
      difficulty: tour.difficulty,
      duration: tour.duration
    }));
}
