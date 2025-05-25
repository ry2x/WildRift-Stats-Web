/**
 * Custom hook for stats data management
 * Provides a clean interface for React components to access stats data
 */

import { useCallback, useEffect, useState } from 'react';

import {
  getAverageWinRate as getAverageWinRateService,
  getChampionStats as getChampionStatsService,
  getChampionTierList as getTierListService,
  getStats,
  getStatsByRankAndLane as getStatsByRankAndLaneService,
} from '@/services/stats/api';
import type { HeroStats, Lane, RankRange, WinRates } from '@/types/stats';

export interface UseStatsDataOptions {
  autoFetch?: boolean;
  initialRank?: RankRange;
  initialLane?: Lane;
}

export interface UseStatsDataReturn {
  stats: WinRates | null;
  loading: boolean;
  error: Error | null;
  currentRank: RankRange;
  currentLane: Lane | null;
  refetch: (forceRefresh?: boolean) => Promise<void>;
  setRank: (rank: RankRange) => void;
  setLane: (lane: Lane | null) => void;
  getChampionStats: (
    championId: string,
    rank?: RankRange,
    lane?: Lane
  ) => Promise<HeroStats | undefined>;
  getChampionTierList: (rank: RankRange) => Promise<HeroStats[]>;
  getStatsByRankAndLane: (rank: RankRange, lane: Lane) => Promise<HeroStats[]>;
  getAverageWinRate: (lane: Lane) => Promise<number>;
  getCurrentLaneStats: () => HeroStats[];
  // Context compatibility methods
  updateRank: (rank: RankRange | 'all') => void;
  refreshStats: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook for managing stats data with rank and lane filtering
 */
export function useStatsData(
  options: UseStatsDataOptions = {}
): UseStatsDataReturn {
  const { autoFetch = true, initialRank = 'all', initialLane = null } = options;

  // State management
  const [stats, setStats] = useState<WinRates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentRank, setCurrentRank] = useState<RankRange>(
    initialRank === 'all' ? '0' : initialRank
  );
  const [currentLane, setCurrentLane] = useState<Lane | null>(initialLane);

  // Fetch stats data
  const fetchStats = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getStats({ forceRefresh });
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('統計データの取得に失敗しました')
      );
    } finally {
      setLoading(false);
    }
  }, []);
  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      void fetchStats();
    }
  }, [autoFetch, fetchStats]);
  // Handler functions
  const setRank = useCallback((rank: RankRange) => {
    setCurrentRank(rank);
  }, []);

  const setLane = useCallback((lane: Lane | null) => {
    setCurrentLane(lane);
  }, []);
  // Context compatibility methods
  const updateRank = useCallback((rank: RankRange | 'all') => {
    setCurrentRank(rank === 'all' ? '0' : rank);
  }, []);

  const refreshStats = useCallback(async () => {
    await fetchStats(true);
  }, [fetchStats]);

  // Service wrapper functions
  const getChampionStats = useCallback(
    async (
      championId: string,
      rank?: RankRange,
      lane?: Lane
    ): Promise<HeroStats | undefined> => {
      return getChampionStatsService(championId, rank, lane);
    },
    []
  );

  const getChampionTierList = useCallback(
    async (rank: RankRange): Promise<HeroStats[]> => {
      return getTierListService(rank);
    },
    []
  );

  const getStatsByRankAndLane = useCallback(
    async (rank: RankRange, lane: Lane): Promise<HeroStats[]> => {
      return getStatsByRankAndLaneService(rank, lane);
    },
    []
  );

  const getAverageWinRate = useCallback(async (lane: Lane): Promise<number> => {
    return getAverageWinRateService(lane);
  }, []);

  // Get current lane stats based on selected rank and lane
  const getCurrentLaneStats = useCallback((): HeroStats[] => {
    if (!stats || !currentLane) return [];

    const rankData = stats.data[currentRank];
    if (!rankData || !rankData[currentLane]) return [];

    return rankData[currentLane];
  }, [stats, currentRank, currentLane]);
  return {
    stats,
    loading,
    error,
    currentRank,
    currentLane,
    refetch: fetchStats,
    setRank,
    setLane,
    getChampionStats,
    getChampionTierList,
    getStatsByRankAndLane,
    getAverageWinRate,
    getCurrentLaneStats,
    // Context compatibility methods
    updateRank,
    refreshStats,
    isLoading: loading,
  };
}
