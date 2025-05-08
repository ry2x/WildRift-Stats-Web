'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { RankRange, WinRates } from '@/types';

interface StatsContextType {
  stats: WinRates | null;
  currentRank: RankRange;
  loading: boolean;
  error: Error | null;
  setCurrentRank: (rank: RankRange) => void;
  refreshStats: () => Promise<void>;
  retryFetch: () => Promise<void>;
}

interface CachedStats {
  data: WinRates | null;
  timestamp: number;
  expiresAt: number;
}

const StatsContext = createContext<StatsContextType | null>(null);

// Cache key for localStorage
const STATS_CACHE_KEY = 'wild-rift-stats-cache';

/**
 * Calculate next update time (10:00 AM)
 */
function getNextUpdateTime(): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(10, 0, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime();
}

/**
 * Save stats data to localStorage with expiration
 */
function saveStatsToCache(stats: WinRates) {
  if (typeof window === 'undefined') return;

  const cache: CachedStats = {
    data: stats,
    timestamp: Date.now(),
    expiresAt: getNextUpdateTime(),
  };
  try {
    localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save stats to cache:', error);
  }
}

/**
 * Load stats data from localStorage if not expired
 */
function loadStatsFromCache(): WinRates | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(STATS_CACHE_KEY);
    if (!cached) return null;

    const cache = JSON.parse(cached) as CachedStats;
    const now = Date.now();

    if (now < cache.expiresAt && cache.data) {
      return cache.data;
    }

    // Clear expired cache
    localStorage.removeItem(STATS_CACHE_KEY);
  } catch (error) {
    console.warn('Failed to load stats from cache:', error);
  }
  return null;
}

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<WinRates | null>(null);
  const [currentRank, setCurrentRank] = useState<RankRange>('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load cache on client-side only
  useEffect(() => {
    const cachedStats = loadStatsFromCache();
    if (cachedStats) {
      setStats(cachedStats);
      setLoading(false);
    }
  }, []);

  // Check if we have valid data for all ranks
  const hasValidDataForAllRanks = useCallback(() => {
    if (!stats?.data) return false;
    const allRanks: RankRange[] = ['0', '1', '2', '3', '4'];
    return allRanks.every(
      rank => stats.data[rank] && Object.keys(stats.data[rank]).length > 0
    );
  }, [stats]);

  // Fetch all ranks data
  const fetchAllRanksData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);

        // Check cache first unless force refresh
        if (!forceRefresh) {
          const now = Date.now();
          const cached = loadStatsFromCache();
          if (
            cached &&
            now < getNextUpdateTime() &&
            hasValidDataForAllRanks()
          ) {
            console.log(
              'Using cached stats data for all ranks until:',
              new Date(getNextUpdateTime()).toLocaleString()
            );
            setStats(cached);
            return cached;
          }
        }

        // Fetch all stats in one call using the new unified endpoint
        const response = await fetch('/api/stats', {
          headers: forceRefresh ? { 'Cache-Control': 'no-cache' } : undefined,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stats data');
        }

        const newStats = (await response.json()) as WinRates;

        // Save to cache and update state
        saveStatsToCache(newStats);
        setStats(newStats);
        setError(null);
        return newStats;
      } catch (error) {
        console.error('Error fetching stats data:', error);
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [hasValidDataForAllRanks]
  );

  // Memoize refresh function
  const refreshStats = useCallback(async () => {
    const now = Date.now();
    const cached = loadStatsFromCache();
    const shouldForceRefresh = !cached || now >= getNextUpdateTime();
    await fetchAllRanksData(shouldForceRefresh);
  }, [fetchAllRanksData]);

  // Retry fetch function
  const retryFetch = useCallback(async () => {
    try {
      setError(null);
      await fetchAllRanksData();
    } catch {
      // Error is already handled in fetchAllRanksData
    }
  }, [fetchAllRanksData]);

  // Effect for initial fetch
  useEffect(() => {
    if (!hasValidDataForAllRanks()) {
      void fetchAllRanksData();
    }
  }, [fetchAllRanksData, hasValidDataForAllRanks]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      stats,
      currentRank,
      loading,
      error,
      setCurrentRank,
      refreshStats,
      retryFetch,
    }),
    [stats, currentRank, loading, error, refreshStats, retryFetch]
  );

  return (
    <StatsContext.Provider value={contextValue}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === null) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
