import { WinRates, RankRange } from '../types/stats';

const STATS_API_URL =
  'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2';

/**
 * Fetches champion stats data from the API directly
 * @param rank - Rank range to fetch statistics for
 * @returns Promise containing win rate data
 */
export async function fetchStats(rank: RankRange = '0'): Promise<WinRates> {
  const params = new URLSearchParams({
    rank: rank.toString(),
  });

  const response = await fetch(`${STATS_API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch champion stats: ${response.statusText}`);
  }

  const data = await response.json();
  return data as WinRates;
}
