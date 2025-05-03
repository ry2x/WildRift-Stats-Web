'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<WinRates | null>(null);
  const [currentRank, setCurrentRank] = useState<RankRange>('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async (rank: RankRange) => {
    try {
      const response = await fetch(`/api/stats/${rank}`, {
        cache: 'force-cache', // Use cache first
        next: { revalidate: 86400 }, // Revalidate after 24 hours
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stats/${currentRank}`, {
        cache: 'no-store', // Skip cache for refresh
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(currentRank);
  }, [currentRank]);

  return (
    <StatsContext.Provider
      value={{
        stats,
        currentRank,
        loading,
        error,
        setCurrentRank,
        refreshStats,
      }}
    >
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
