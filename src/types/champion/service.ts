/**
 * Champion service type definitions
 */
import type { Champion } from './champion';

// Additional service-specific types
export interface ChampionFetchOptions {
  forceRefresh?: boolean;
}

export interface ChampionApiResponse {
  champions: Champion[];
}

export interface ChampionServiceConfig {
  apiUrl: string;
  cacheKey: string;
  updateHour?: number;
  updateMinute?: number;
}
