import { NextResponse } from 'next/server';
import { getStats } from '@/services/stats/api';
import {
  handleApiError,
  isApiError,
  isNetworkError,
} from '@/services/api/error';

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
 * Create success response with cache headers
 */
function createSuccessResponse(
  data: unknown,
  cacheConfig: { maxAge: number; forceRefresh: boolean }
) {
  const { maxAge, forceRefresh } = cacheConfig;
  const staleWhileRevalidate = 60; // 1 minute stale while revalidate

  const cacheControl = forceRefresh
    ? 'no-store'
    : `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`;

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': cacheControl,
      Vary: 'Cache-Control',
      'X-Cache-Status': forceRefresh ? 'REVALIDATED' : 'CACHED',
      'X-Next-Update': new Date(Date.now() + maxAge * 1000).toISOString(),
      Age: '0',
    },
  });
}

/**
 * Create error response with appropriate status and headers
 */
function createErrorResponse(error: Error) {
  console.error('Error fetching stats:', error);

  let status = 500;
  let message = 'Failed to fetch champion stats';

  if (isApiError(error)) {
    status = error.statusCode;
    message = error.message;
  } else if (isNetworkError(error)) {
    status = 503;
    message = 'Service temporarily unavailable';
  }

  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}

/**
 * Parse request options from headers
 */
function parseRequestOptions(request: Request) {
  const cacheHeader = request.headers.get('cache-control') || '';
  const forceRefresh = cacheHeader.includes('no-cache');

  return { forceRefresh };
}

/**
 * Get cache configuration
 */
function getCacheConfig() {
  return {
    maxAge: getSecondsUntilNextUpdate(),
  };
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
    const { forceRefresh } = parseRequestOptions(request);
    const cacheConfig = getCacheConfig();

    // Fetch data using the new service layer
    const data = await getStats({ forceRefresh });

    return createSuccessResponse(data, {
      maxAge: cacheConfig.maxAge,
      forceRefresh,
    });
  } catch (error) {
    const handledError = handleApiError(error);
    return createErrorResponse(handledError);
  }
}
