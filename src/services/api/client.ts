/**
 * Common API client functionality for data fetching
 * Provides a unified interface for API communication and caching
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

/**
 * Create a unified API client with configurable fetch and cache dependencies
 */
export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const { fetch = globalThis.fetch, cacheFactory = createCache } = options;

  /**
   * Generic data fetching function with caching support
   */
  return {
    fetchData: async function <T>({
      url,
      validator,
      cacheKey,
      forceRefresh = false,
    }: FetchOptions<T>): Promise<T> {
      const cache = cacheFactory<T>({ key: cacheKey });

      // Check cache first unless forced refresh is requested
      if (!forceRefresh) {
        const cachedData = cache.get();
        if (cachedData !== null) {
          return cachedData;
        }
      }
      // Fetch data from API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const rawData = (await response.json()) as unknown;
      if (!validator(rawData)) {
        throw new Error('Invalid data format received from API');
      }
      const data = rawData;

      // Cache the validated data
      cache.set(data);

      return data;
    },
  };
}

/**
 * Create a cache instance with configurable storage and expiration
 */
export function createCache<T>({
  key,
  storage = 'memory',
  getExpirationTime = getNextDailyUpdate,
}: CacheOptions): Cache<T> {
  // Memory cache
  let memoryCache: CacheEntry<T> | null = null;

  return {
    get: () => {
      // Check memory cache first
      if (memoryCache && Date.now() < memoryCache.expiresAt) {
        return memoryCache.data;
      }

      // Check localStorage cache (client-side only)
      if (storage === 'localStorage' && typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry<T> = JSON.parse(cached) as CacheEntry<T>;
            if (Date.now() < entry.expiresAt) {
              // Update memory cache with localStorage data
              memoryCache = entry;
              return entry.data;
            }
          }
        } catch (e) {
          console.warn('Failed to load from localStorage:', e);
        }
      }

      return null;
    },

    set: (data: T) => {
      const expirationTime = getExpirationTime();

      // Update memory cache
      memoryCache = { data, expiresAt: expirationTime };

      // Update localStorage cache (client-side only)
      if (storage === 'localStorage' && typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            key,
            JSON.stringify({ data, expiresAt: expirationTime })
          );
        } catch (e) {
          console.warn('Failed to save to localStorage:', e);
        }
      }
    },

    clear: () => {
      memoryCache = null;
      if (storage === 'localStorage' && typeof window !== 'undefined') {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('Failed to remove from localStorage:', e);
        }
      }
    },
  };
}

/**
 * Get the timestamp for the next daily update (default: 10:00 AM)
 */
export function getNextDailyUpdate(
  hour: number = 10,
  minute: number = 0
): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime();
}
