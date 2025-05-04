import { NextResponse } from 'next/server';
import { fetchStats } from '@/api/stats';
import { RankRange } from '@/types';

/**
 * Calculate seconds until next 10:30 AM
 * @returns number of seconds until next 10:30 AM
 */
function getSecondsUntilNextUpdate(): number {
  const now = new Date();
  const target = new Date(now);

  target.setHours(10, 30, 0, 0);

  // If it's already past 10:30 AM, set target to next day
  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target.getTime() - now.getTime()) / 1000);
}

/**
 * Route handler for win rate stats data by rank
 * Uses Next.js cache until next 10:30 AM
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ rank: RankRange }> }
) {
  try {
    const [data, { rank }] = await Promise.all([fetchStats(), context.params]);

    // Check if the rank exists in the data
    if (!data.data || !data.data[rank]) {
      return NextResponse.json(
        { error: 'Invalid rank parameter' },
        { status: 400 }
      );
    }

    const maxAge = getSecondsUntilNextUpdate();

    return NextResponse.json(data.data[rank], {
      headers: {
        'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge}`,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch champion stats' },
      { status: 500 }
    );
  }
}
