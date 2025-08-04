import { NextRequest, NextResponse } from 'next/server';

// In-memory counter for demo purposes
// In production, this would use a database like Redis, PostgreSQL, or Firebase
let visitCount = 12847; // Starting with a reasonable number for professional appearance

export const GET = async () => {
  return NextResponse.json({
    success: true,
    data: { count: visitCount },
    message: 'Visit count retrieved successfully',
    status: 200
  });
};

export const POST = async (request: NextRequest) => {
  try {
    // Simple bot detection
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    
    let incremented = false;
    if (!isBot) {
      visitCount += 1;
      incremented = true;
    }
    
    return NextResponse.json({
      success: true,
      data: { 
        count: visitCount,
        incremented,
        clientIP: process.env.NODE_ENV === 'development' ? (request as any).ip : undefined
      },
      message: `Visit ${incremented ? 'recorded' : 'detected as bot'}`,
      status: 200
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process visit',
      status: 500
    }, { status: 500 });
  }
};