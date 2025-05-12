import { NextResponse } from 'next/server';

// Get the backend URL from environment variables
// Use the deployed backend on Render by default
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://natours-yslc.onrender.com';
console.log('Using backend URL for streaming:', BACKEND_URL);

export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api/v1/chat-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Get the error details from the response if possible
      const errorData = await response.text();
      console.error('Backend API error:', errorData);
      throw new Error(`Error communicating with AI service: ${response.status} ${response.statusText}`);
    }

    // Create a TransformStream to pipe the response through
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        // Pass through the SSE data
        controller.enqueue(chunk);
      },
    });

    // Start the stream by piping the response body to our transform stream
    response.body.pipeTo(transformStream.writable);
    
    // Return our readable stream
    return new Response(transformStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    
    // Create and send an SSE error message
    const encoder = new TextEncoder();
    const errorMessage = `data: ${JSON.stringify({ error: error.message || 'Something went wrong' })}\n\n`;
    
    return new Response(encoder.encode(errorMessage), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}