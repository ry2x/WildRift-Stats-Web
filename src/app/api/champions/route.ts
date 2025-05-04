import { NextResponse } from 'next/server';
import { fetchChampions } from '@/api/champions';

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
 * Route handler for champion data
 * Uses Next.js cache until next 10:30 AM
 */
export async function GET() {
  try {
    const data = await fetchChampions();
    const maxAge = getSecondsUntilNextUpdate();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge}`,
      },
    });
  } catch (error) {
    console.error('Error fetching champion data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch champion data' },
      { status: 500 }
    );
  }
}
