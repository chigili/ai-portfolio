import { NextResponse } from 'next/server';

// Disable static generation for this route to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Use environment variable or fallback to hardcoded repo
const REPO_URL = 'https://api.github.com/repos/chigili/ai-portfolio';

export const GET = async () => {
  try {
    const response = await fetch(REPO_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ai-portfolio-app',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();
    const stars = data.stargazers_count || 1;
    
    return NextResponse.json({
      success: true,
      data: { stars },
      message: 'Stars retrieved successfully',
      status: 200
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    // Return a fallback value instead of failing completely
    return NextResponse.json({
      success: true,
      data: { stars: 1 },
      message: 'Using fallback star count',
      status: 200
    });
  }
};