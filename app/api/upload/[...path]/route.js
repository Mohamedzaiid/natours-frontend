// Next.js API route for proxying multipart/form-data requests (file uploads)
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natours-yslc.onrender.com/api/v1';

export async function POST(request, context) {
  // Make sure we await params before using it
  const params = await context.params;
  const { path } = params;
  const pathString = Array.isArray(path) ? path.join('/') : path;
  const targetUrl = `${API_URL}/${pathString}`;
  
  console.log('Catch-all Upload POST request to:', targetUrl);

  try {
    // Forward the FormData as is
    const formData = await request.formData();
    
    const res = await fetch(targetUrl, {
      method: 'PATCH', // Most upload endpoints use PATCH
      headers: {
        // Don't set Content-Type here, let fetch set it with boundary
        'Cookie': request.headers.get('cookie') || '',
      },
      body: formData,
    });

    // Check if the response is JSON
    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      // If not JSON, get the text and create a simple object
      const text = await res.text();
      data = { status: res.ok ? 'success' : 'error', message: text };
    }

    // Forward response with correct status code
    const response = NextResponse.json(data, { status: res.status });
    
    // Copy all headers from the original response
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        // Special handling for cookies
        response.headers.set(key, value);
      } else {
        response.headers.set(key, value);
      }
    });

    return response;
  } catch (error) {
    console.error('Upload proxy error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Error uploading file to backend server: ' + error.message 
    }, { status: 500 });
  }
}
