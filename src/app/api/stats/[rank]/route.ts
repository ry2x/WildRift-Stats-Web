import { NextResponse } from 'next/server';
import { fetchStats } from '@/api/stats';
import { RankRange } from '@/types/stats';

/**
 * Route handler for hero stats data
 * Uses Next.js cache for 24 hours
 */
export async function GET(
  request: Request,
  { params }: { params: { rank: RankRange } }
) {
  try {
    const data = await fetchStats(params.rank);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hero stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero stats' },
      { status: 500 }
    );
  }
}
