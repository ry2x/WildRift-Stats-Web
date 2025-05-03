import { NextResponse } from 'next/server';
import { fetchStats } from '@/api/stats';
import { RankRange } from '@/types';

/**
 * Route handler for win rate stats data by rank
 * Uses Next.js cache for 24 hours
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

    return NextResponse.json(data.data[rank], {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
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
