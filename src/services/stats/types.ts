/**
 * Stats-specific type definitions for the services layer
 */

import type { WinRates, HeroStats, RankRange, Lane } from '@/types/';

// Re-export types for convenience
export type { WinRates, HeroStats, RankRange, Lane };

// Additional service-specific types
export interface StatsFetchOptions {
  forceRefresh?: boolean;
}

export interface StatsApiResponse {
  stats: WinRates;
}

export interface StatsServiceConfig {
  apiUrl: string;
  cacheKey: string;
  updateHour?: number;
  updateMinute?: number;
}
