import { NextResponse } from 'next/server';
import { fetchChampions } from '@/api/champions';

/**
 * Calculate seconds until next 10:00 AM
 * @returns number of seconds until next 10:00 AM
 */
function getSecondsUntilNextUpdate(): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(10, 0, 0, 0);

  // If it's already past 10:00 AM, set target to next day
  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target.getTime() - now.getTime()) / 1000);
}

/**
 * Route handler for champion data
 * Implements stale-while-revalidate strategy with daily updates at 10:00 AM
 */
export async function GET(request: Request) {
  try {
    // Get cache headers from request
    const cacheHeader = request.headers.get('cache-control') || '';
    const forceRefresh = cacheHeader.includes('no-cache');

    // Fetch data with potential force refresh
    const data = await fetchChampions(forceRefresh);
    const maxAge = getSecondsUntilNextUpdate();

    // Return response with optimized cache headers
    // maxAge is limited to 1 hour for browsers, but CDN can cache until next update
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, max-age=${Math.min(maxAge, 3600)}, s-maxage=${maxAge}`,
        Vary: 'Cache-Control',
        'X-Cache-Status': forceRefresh ? 'REVALIDATED' : 'CACHED',
        'X-Next-Update': new Date(Date.now() + maxAge * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching champion data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch champion data' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
