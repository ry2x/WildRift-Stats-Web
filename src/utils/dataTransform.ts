import type { Champion, Champions } from '@/types/champion';
import type { HeroStats, Lane, RankRange, WinRates } from '@/types/stats';
/**
 * Transform champion data to a map for easier lookup
 * @param champions - Array of champion data
 * @returns Map of champions with hero_id as key
 */
export const createChampionMap = (
  champions: Champions
): Map<number, Champion> => {
  return new Map(
    champions.map((champion: Champion) => [champion.hero_id, champion])
  );
};

/**
 * Get champion stats for specific rank and lane
 * @param stats - Full stats data
 * @param rank - Rank range to filter
 * @param lane - Lane position to filter
 * @returns Filtered hero stats
 */
export const getChampionStats = (
  stats: WinRates | null,
  rank: RankRange,
  lane: Lane
): HeroStats[] => {
  if (!stats || !stats.data || !stats.data[rank]) return [];
  const rankStats = stats.data[rank];
  return rankStats[lane] || [];
};

/**
 * Merge champion data with their stats
 * @param champion - Champion base data
 * @param stats - Champion statistics
 * @returns Combined champion data with stats
 */
export const mergeChampionData = (champion: Champion, stats: HeroStats) => {
  return {
    ...champion,
    stats: {
      winRate: parseFloat(stats.win_rate_float),
      appearRate: parseFloat(stats.appear_rate_float),
      banRate: parseFloat(stats.forbid_rate_float),
      strength: parseInt(stats.strength, 10),
      position: stats.position,
    },
  };
};
