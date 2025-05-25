'use client';

import { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { RankRange, WinRates } from '@/types/stats';
import { useStatsData } from '@/hooks/useStatsData';

// Context type definition
interface StatsContextType {
  stats: WinRates | null;
  loading: boolean;
  error: Error | null;
  currentRank: RankRange | 'all';
  setCurrentRank: (rank: RankRange | 'all') => void;
  refreshStats: () => Promise<void>;
  retryFetch: () => Promise<void>;
}

// Create context
const StatsContext = createContext<StatsContextType | null>(null);

// Provider component props
interface StatsProviderProps {
  children: ReactNode;
  initialRank?: RankRange | 'all';
}

// Provider component
export function StatsProvider({
  children,
  initialRank = 'all',
}: StatsProviderProps) {
  // Track current rank state at the context level
  const [rankState, setRankState] = useState<RankRange | 'all'>(initialRank);

  // Use the custom hook for data management
  const { stats, loading, error, setRank, refetch } = useStatsData({
    initialRank: rankState === 'all' ? '0' : rankState,
    autoFetch: true,
  });

  // Handle rank updates while maintaining local state
  const updateRank = useMemo(() => {
    return (rank: RankRange | 'all') => {
      setRankState(rank);
      setRank(rank === 'all' ? '0' : rank);
    };
  }, [setRank]);

  // Context value
  const contextValue = useMemo(
    () => ({
      stats,
      loading,
      error,
      currentRank: rankState, // Use our state variable for UI display
      setCurrentRank: updateRank,
      refreshStats: () => refetch(true),
      retryFetch: () => refetch(false),
    }),
    [stats, loading, error, rankState, updateRank, refetch]
  );

  return (
    <StatsContext.Provider value={contextValue}>
      {children}
    </StatsContext.Provider>
  );
}

// Custom hook to use the context
export function useStats() {
  const context = useContext(StatsContext);
  if (context === null) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}

export default StatsContext;
