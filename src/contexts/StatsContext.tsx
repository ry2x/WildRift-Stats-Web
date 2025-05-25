'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useStatsData } from '@/hooks/useStatsData';
import type { RankRange, WinRates } from '@/types/services';

// Context type definition
interface StatsContextType {
  stats: WinRates | null;
  isLoading: boolean;
  error: string | null;
  currentRank: RankRange | 'all';
  updateRank: (rank: RankRange | 'all') => void;
  refreshStats: () => Promise<void>;
  retryFetch: () => Promise<void>;
}

// Create context
const StatsContext = createContext<StatsContextType | undefined>(undefined);

// Provider component props
interface StatsProviderProps {
  children: ReactNode;
  initialRank?: RankRange | 'all';
}

// Provider component
export const StatsProvider: React.FC<StatsProviderProps> = ({
  children,
  initialRank = 'all',
}) => {
  const statsData = useStatsData({
    initialRank: initialRank === 'all' ? '0' : initialRank,
    autoFetch: true,
  }); // Create context value with proper interface
  const contextValue: StatsContextType = {
    stats: statsData.stats, // Keep original structure
    isLoading: statsData.isLoading,
    error: statsData.error?.message || null,
    currentRank: initialRank,
    updateRank: statsData.updateRank,
    refreshStats: statsData.refreshStats,
    retryFetch: statsData.refreshStats, // Use refreshStats as retryFetch
  };

  return (
    <StatsContext.Provider value={contextValue}>
      {children}
    </StatsContext.Provider>
  );
};

// Custom hook to use the context
export const useStats = (): StatsContextType => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

export default StatsContext;
