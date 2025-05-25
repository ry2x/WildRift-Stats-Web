'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { RankRange, WinRates } from '@/types';
import { useStatsData } from '@/hooks/useStatsData';

interface StatsContextType {
  stats: WinRates | null;
  currentRank: RankRange;
  loading: boolean;
  error: Error | null;
  setCurrentRank: (rank: RankRange) => void;
  refreshStats: () => Promise<void>;
  retryFetch: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | null>(null);

export function StatsProvider({ children }: { children: ReactNode }) {
  // Use the new custom hook for data management
  const { stats, loading, error, currentRank, setRank, refetch } = useStatsData(
    { initialRank: '0' }
  );

  // Context value
  const contextValue = useMemo(
    () => ({
      stats,
      currentRank,
      loading,
      error,
      setCurrentRank: setRank,
      refreshStats: () => refetch(true),
      retryFetch: () => refetch(false),
    }),
    [stats, currentRank, loading, error, setRank, refetch]
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
