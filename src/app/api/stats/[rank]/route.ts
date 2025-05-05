import { NextResponse } from 'next/server';
import { fetchStats } from '@/api/stats';
import { RankRange } from '@/types';

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
 * Route handler for win rate stats data by rank
 * Implements caching strategy with daily updates at 10:00 AM
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ rank: RankRange }> }
) {
  try {
    // Get cache headers from request
    const cacheHeader = request.headers.get('cache-control') || '';
    const forceRefresh = cacheHeader.includes('no-cache');

    const [data, { rank }] = await Promise.all([
      fetchStats(forceRefresh),
      context.params,
    ]);

    // Check if the rank exists in the data
    if (!data.data || !data.data[rank]) {
      return NextResponse.json(
        { error: 'Invalid rank parameter' },
        { status: 400 }
      );
    }

    const maxAge = getSecondsUntilNextUpdate();

    // Return response with optimized cache headers
    return NextResponse.json(data.data[rank], {
      headers: {
        'Cache-Control': `public, max-age=${Math.min(maxAge, 3600)}, s-maxage=${maxAge}`,
        Vary: 'Cache-Control',
        'X-Cache-Status': forceRefresh ? 'REVALIDATED' : 'CACHED',
        'X-Next-Update': new Date(Date.now() + maxAge * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch champion stats' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
