/**
 * Stats API service layer
 * Provides clean interface for stats data operations
 */

import { createApiClient, type ApiClient } from '../api/client';
import { withErrorHandling } from '../api/error';
import { transformStatsData, validateStatsData } from './utils';
import type {
  WinRates,
  StatsFetchOptions,
  StatsServiceConfig,
  RankRange,
  Lane,
  HeroStats,
} from './types';

// Default configuration
const DEFAULT_CONFIG: StatsServiceConfig = {
  apiUrl: '/api/stats-proxy',
  cacheKey: 'stats-data',
  updateHour: 10,
  updateMinute: 0,
};

// Create API client instance
const apiClient: ApiClient = createApiClient();

/**
 * Get stats data with caching support
 */
export async function getStats(
  options: StatsFetchOptions = {}
): Promise<WinRates> {
  const { forceRefresh = false } = options;

  return withErrorHandling(async () => {
    const data = await apiClient.fetchData({
      url: DEFAULT_CONFIG.apiUrl,
      validator: validateStatsData,
      cacheKey: DEFAULT_CONFIG.cacheKey,
      forceRefresh,
    });

    return transformStatsData(data);
  });
}

/**
 * Get stats for a specific champion by hero_id
 */
export async function getChampionStats(
  championId: string,
  rank?: RankRange,
  lane?: Lane,
  options: StatsFetchOptions = {}
): Promise<HeroStats | undefined> {
  const { getChampionStatsByHeroId } = await import('./utils');
  const stats = await getStats(options);
  return getChampionStatsByHeroId(stats, championId, rank, lane);
}

/**
 * Get champion tier list for a specific rank
 */
export async function getChampionTierList(
  rank: RankRange,
  options: StatsFetchOptions = {}
): Promise<HeroStats[]> {
  const { getChampionTierList: getTierList } = await import('./utils');
  const stats = await getStats(options);
  return getTierList(stats, rank);
}

/**
 * Get stats for a specific rank and lane combination
 */
export async function getStatsByRankAndLane(
  rank: RankRange,
  lane: Lane,
  options: StatsFetchOptions = {}
): Promise<HeroStats[]> {
  const { getChampionStatsByRankAndLane } = await import('./utils');
  const stats = await getStats(options);
  return getChampionStatsByRankAndLane(stats, rank, lane);
}

/**
 * Calculate average win rate for a specific lane
 */
export async function getAverageWinRate(
  lane: Lane,
  options: StatsFetchOptions = {}
): Promise<number> {
  const { calculateAverageWinRate } = await import('./utils');
  const stats = await getStats(options);
  return calculateAverageWinRate(stats, lane);
}

/**
 * Configure the stats service
 */
export function configureStatsService(
  config: Partial<StatsServiceConfig>
): void {
  Object.assign(DEFAULT_CONFIG, config);
}
