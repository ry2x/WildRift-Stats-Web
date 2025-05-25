/**
 * Champion-specific type definitions for the services layer
 */

import { Champion } from '@/types/services';

// Re-export types from the existing types module for backward compatibility
export type {
  Champion,
  Champions,
  RoleKey,
  LaneKey,
} from '../../types/champion';

export type { SortKey, SortOrder } from '@/types';

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
