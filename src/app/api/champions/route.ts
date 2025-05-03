import { NextResponse } from 'next/server';
import { fetchChampions } from '@/api/champions';

/**
 * Route handler for champion data
 * Uses Next.js cache for 24 hours
 */
export async function GET() {
  try {
    const data = await fetchChampions();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching champion data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch champion data' },
      { status: 500 }
    );
  }
}
