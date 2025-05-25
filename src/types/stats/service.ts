/**
 * Stats service type definitions
 */
import type { WinRates } from './stats';

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
