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
  const [error, setError] = useState<Error | null>(null);

  // Memoize fetch function
  const fetchStats = useCallback(
    async (rank: RankRange, forceRefresh = false) => {
      try {
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

        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();
        return data;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
    []
  );

  // Memoize refresh function
  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchStats(currentRank, true);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [currentRank, fetchStats]);

  // Effect for initial fetch and rank changes
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchStats(currentRank);
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadStats();
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
    }),
    [stats, currentRank, loading, error, refreshStats]
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
