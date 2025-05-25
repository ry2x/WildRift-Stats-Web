/**
 * Champion API service layer
 * Provides clean interface for champion data operations
 */

import { createApiClient, type ApiClient } from '../api/client';
import { withErrorHandling } from '../api/error';
import { transformChampionData, validateChampionData } from './utils';
import type {
  Champion,
  Champions,
  ChampionFetchOptions,
  ChampionServiceConfig,
  RoleKey,
  LaneKey,
} from '@/types/champion';

// Default configuration
const DEFAULT_CONFIG: ChampionServiceConfig = {
  apiUrl:
    'https://ry2x.github.io/WildRift-Merged-Champion-Data/data_ja_JP.json',
  cacheKey: 'champions-data',
  updateHour: 10,
  updateMinute: 0,
};

// Create API client instance
const apiClient: ApiClient = createApiClient();

/**
 * Get champions data with caching support
 */
export async function getChampions(
  options: ChampionFetchOptions = {}
): Promise<Champions> {
  const { forceRefresh = false } = options;

  return withErrorHandling(async () => {
    const data = await apiClient.fetchData({
      url: DEFAULT_CONFIG.apiUrl,
      validator: validateChampionData,
      cacheKey: DEFAULT_CONFIG.cacheKey,
      forceRefresh,
    });

    return transformChampionData(data);
  });
}

/**
 * Get a specific champion by ID
 */
export async function getChampionById(
  id: string,
  options: ChampionFetchOptions = {}
): Promise<Champion | undefined> {
  const champions = await getChampions(options);
  return champions.find(champion => champion.id === id);
}

/**
 * Get a specific champion by hero_id
 */
export async function getChampionByHeroId(
  heroId: number,
  options: ChampionFetchOptions = {}
): Promise<Champion | undefined> {
  const champions = await getChampions(options);
  return champions.find(champion => champion.hero_id === heroId);
}

/**
 * Get champions filtered by role
 */
export async function getChampionsByRole(
  role: RoleKey,
  options: ChampionFetchOptions = {}
): Promise<Champions> {
  const { filterChampionsByRole } = await import('./utils');
  const champions = await getChampions(options);
  return filterChampionsByRole(champions, role);
}

/**
 * Get champions filtered by lane
 */
export async function getChampionsByLane(
  lane: LaneKey,
  options: ChampionFetchOptions = {}
): Promise<Champions> {
  const { filterChampionsByLane } = await import('./utils');
  const champions = await getChampions(options);
  return filterChampionsByLane(champions, lane);
}

/**
 * Search champions by name
 */
export async function searchChampions(
  searchTerm: string,
  options: ChampionFetchOptions = {}
): Promise<Champions> {
  const { searchChampions: searchUtil } = await import('./utils');
  const champions = await getChampions(options);
  return searchUtil(champions, searchTerm);
}

/**
 * Configure the champion service
 */
export function configureChampionService(
  config: Partial<ChampionServiceConfig>
): void {
  Object.assign(DEFAULT_CONFIG, config);
}
