// Disable static generation for this route to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const res = await fetch('https://api.github.com/repos/toukoum/portfolio', {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    // Disable Next.js fetch caching
    cache: 'no-store',
  });

  if (!res.ok) {
    return new Response('Failed to fetch stars', { 
      status: res.status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }

  const data = await res.json();
  return Response.json({ stars: data.stargazers_count }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}