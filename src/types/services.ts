/**
 * Common type definitions for the services layer
 * Provides centralized exports for all service-related types
 */

import { RankRange } from '@/types/';

// Champion service types
export type {
  Champion,
  Champions,
  RoleKey,
  LaneKey,
  ChampionFetchOptions,
  ChampionServiceConfig,
} from '../services/champions/types';

// Stats service types
export type {
  WinRates,
  HeroStats,
  RankRange,
  Lane,
  StatsFetchOptions,
  StatsServiceConfig,
} from '../services/stats/types';

// Sort utility types
export type { SortKey, SortOrder } from '../types/sort';

// API client types
export type {
  FetchOptions,
  ApiClientOptions,
  CacheOptions,
  Cache,
  CacheEntry,
} from '../services/api/client';

// Error types
export type {
  ApiError,
  NetworkError,
  ValidationError,
  CacheError,
} from '../services/api/error';

// Hook return types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: (options?: { forceRefresh: boolean }) => Promise<T>;
}

export interface FilterOptions {
  searchTerm?: string;
  role?: string;
  lane?: string;
  rank?: RankRange;
}

export interface SortOptions {
  key: string;
  order: 'asc' | 'desc';
}
