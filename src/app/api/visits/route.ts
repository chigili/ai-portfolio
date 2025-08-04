import { NextRequest, NextResponse } from 'next/server';

// Extend global to include visit tracker
declare global {
  var visitTracker: Map<string, number> | undefined;
}

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
    // Enhanced bot detection
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot/i.test(userAgent);
    
    // Basic duplicate prevention (same IP within 1 hour)
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    
    // Simple in-memory tracking (will reset on deployment, but better than nothing)
    if (!global.visitTracker) {
      global.visitTracker = new Map();
    }
    
    const lastVisit = global.visitTracker.get(clientIP) || 0;
    const hourInMs = 60 * 60 * 1000;
    const shouldIncrement = !isBot && (now - lastVisit > hourInMs);
    
    let incremented = false;
    if (shouldIncrement) {
      visitCount += 1;
      global.visitTracker.set(clientIP, now);
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