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
import { withErrorHandling } from '@/utils/errorHandling';

interface StatsContextType {
  stats: WinRates | null;
  currentRank: RankRange;
  loading: boolean;
  error: unknown | null;
  setCurrentRank: (rank: RankRange) => void;
  refreshStats: () => Promise<void>;
  retryFetch: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

/**
 * Calculate seconds until next 10:00 AM
 */
function getSecondsUntilNextUpdate(): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(10, 0, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target.getTime() - now.getTime()) / 1000);
}

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<WinRates | null>(null);
  const [currentRank, setCurrentRank] = useState<RankRange>('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  // Memoize fetch function with error handling
  const fetchStats = useCallback(
    async (rank: RankRange, forceRefresh = false) => {
      return withErrorHandling(
        async () => {
          const response = await fetch(`/api/stats/${rank}`, {
            cache: forceRefresh ? 'no-store' : 'force-cache',
            next: forceRefresh
              ? undefined
              : {
                  revalidate: getSecondsUntilNextUpdate(),
                  tags: ['stats', `stats-${rank}`],
                },
            headers: forceRefresh
              ? {
                  'Cache-Control': 'no-cache',
                }
              : undefined,
          });

          if (!response.ok) {
            throw new Error('Failed to fetch stats');
          }

          const data = await response.json();
          setStats(data);
          setError(null);
          return data;
        },
        {
          retry: true,
          maxRetries: 3,
          onError: err => {
            console.error('Error fetching stats:', err);
            setError(err);
          },
        }
      );
    },
    []
  );

  // Memoize refresh function
  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      await fetchStats(currentRank, true);
    } finally {
      setLoading(false);
    }
  }, [currentRank, fetchStats]);

  // Retry fetch function
  const retryFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchStats(currentRank);
    } finally {
      setLoading(false);
    }
  }, [currentRank, fetchStats]);

  // Effect for initial fetch and rank changes
  useEffect(() => {
    fetchStats(currentRank).finally(() => setLoading(false));
  }, [currentRank, fetchStats]);

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
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
