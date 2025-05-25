/**
 * Common API client functionality type definitions
 */

export interface FetchOptions<T> {
  url: string;
  validator: (data: unknown) => data is T;
  cacheKey: string;
  forceRefresh?: boolean;
}

export interface ApiClientOptions {
  fetch?: typeof globalThis.fetch;
  cacheFactory?: <T>(options: CacheOptions) => Cache<T>;
}

export interface CacheOptions {
  key: string;
  storage?: 'memory' | 'localStorage';
  getExpirationTime?: () => number;
}

export interface ApiClient {
  fetchData: <T>(options: FetchOptions<T>) => Promise<T>;
}

export interface Cache<T> {
  get(): T | null;
  set(data: T): void;
  clear(): void;
}

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
