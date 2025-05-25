/**
 * Common type definitions used across the application
 */

import type { RankRange } from '../stats';

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
