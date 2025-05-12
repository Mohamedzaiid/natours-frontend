import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { status: 'error', message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { status: 'error', message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Send this data to your backend API
    // 2. Or send an email directly
    // 3. Or save to a database
    
    // For now, we'll just simulate a successful submission
    // In a real implementation, you might want to do something like:
    
    /*
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/v1/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, subject, message }),
    });
    
    if (!backendResponse.ok) {
      throw new Error('Failed to submit contact form to backend');
    }
    
    const data = await backendResponse.json();
    */
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(
      { 
        status: 'success', 
        message: 'Thank you for your message! We will get back to you shortly.' 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      { status: 'error', message: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    );
  }
}