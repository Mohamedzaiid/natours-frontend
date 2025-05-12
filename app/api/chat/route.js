import { NextResponse } from 'next/server';

// Get the backend URL from environment variables
// Use the deployed backend on Render by default
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://natours-yslc.onrender.com';
console.log('Using backend URL:', BACKEND_URL);

export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Backend API error:', data);
      throw new Error(data.message || `Error communicating with AI service: ${response.status} ${response.statusText}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}