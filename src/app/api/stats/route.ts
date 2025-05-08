import { NextResponse } from 'next/server';
import { fetchStats } from '@/api/stats';

/**
 * Calculate seconds until next 10:00 AM
 * @returns number of seconds until next 10:00 AM
 */
function getSecondsUntilNextUpdate(): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(10, 0, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target.getTime() - now.getTime()) / 1000);
}

/**
 * Route handler for combined win rate stats data
 * Implements strict caching strategy with daily updates at 10:00 AM
 *
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get win rates for all ranks
 *     description: Fetches win rate statistics for all champion ranks and roles
 *     responses:
 *       200:
 *         description: Successfully retrieved win rates
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WinRates'
 */
export async function GET(request: Request) {
  try {
    // Get cache headers from request
    const cacheHeader = request.headers.get('cache-control') || '';
    const forceRefresh = cacheHeader.includes('no-cache');

    // Calculate cache duration
    const maxAge = getSecondsUntilNextUpdate();
    const staleWhileRevalidate = 60; // 1 minute stale while revalidate

    // Use stale-while-revalidate strategy for better performance
    const cacheControl = forceRefresh
      ? 'no-store'
      : `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`;

    // Fetch all stats in one go
    const data = await fetchStats(forceRefresh);

    // Return response with optimized cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': cacheControl,
        Vary: 'Cache-Control',
        'X-Cache-Status': forceRefresh ? 'REVALIDATED' : 'CACHED',
        'X-Next-Update': new Date(Date.now() + maxAge * 1000).toISOString(),
        Age: '0',
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
