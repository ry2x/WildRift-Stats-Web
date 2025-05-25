/**
 * Custom hook for champion data management
 * Provides a clean interface for React components to access champion data
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Champion, Champions, LaneKey, RoleKey } from '@/types/champion';

import { getChampions } from '../services/champions/api';
import {
  filterChampionsByLane,
  filterChampionsByRole,
  sortChampions as sortChampionsUtil,
} from '../services/champions/utils';

export interface UseChampionDataOptions {
  autoFetch?: boolean;
  role?: string;
  lane?: string;
  searchTerm?: string;
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UseChampionDataReturn {
  champions: Champions;
  allChampions: Champions;
  loading: boolean;
  error: Error | null;
  refetch: (forceRefresh?: boolean) => Promise<void>;
  searchChampions: (term: string) => void;
  filterByRole: (role: string) => void;
  filterByLane: (lane: string) => void;
  sortChampions: (key: string, order?: 'asc' | 'desc') => void;
  clearFilters: () => void;
  getChampionById: (id: string) => Champion | undefined;
  getChampionByHeroId: (heroId: number) => Champion | undefined;
}

/**
 * Hook for managing champion data with filtering and search capabilities
 */
export function useChampionData(
  options: UseChampionDataOptions = {}
): UseChampionDataReturn {
  const {
    autoFetch = true,
    role: initialRole,
    lane: initialLane,
    searchTerm: initialSearchTerm = '',
    sortKey: initialSortKey = 'name',
    sortOrder: initialSortOrder = 'asc',
  } = options;

  // State management
  const [allChampions, setAllChampions] = useState<Champions>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [roleFilter, setRoleFilter] = useState<RoleKey | undefined>(
    initialRole as RoleKey | undefined
  );
  const [laneFilter, setLaneFilter] = useState<LaneKey | undefined>(
    initialLane as LaneKey | undefined
  );
  const [sortKey, setSortKey] = useState(initialSortKey);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  // Fetch champions data
  const fetchChampions = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getChampions({ forceRefresh });
      setAllChampions(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('チャンピオンデータの取得に失敗しました')
      );
    } finally {
      setLoading(false);
    }
  }, []);
  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      void fetchChampions();
    }
  }, [autoFetch, fetchChampions]);

  // Filtered and sorted champions
  const champions = useMemo(() => {
    let filtered = [...allChampions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        champion =>
          champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          champion.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filterChampionsByRole(filtered, roleFilter);
    }

    // Apply lane filter
    if (laneFilter) {
      filtered = filterChampionsByLane(filtered, laneFilter);
    }

    // Apply sorting
    filtered = sortChampionsUtil(filtered, sortKey, sortOrder);

    return filtered;
  }, [allChampions, searchTerm, roleFilter, laneFilter, sortKey, sortOrder]);

  // Handler functions
  const searchChampions = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const filterByRole = useCallback((role: string) => {
    setRoleFilter(role ? (role as RoleKey) : undefined);
  }, []);

  const filterByLane = useCallback((lane: string) => {
    setLaneFilter(lane ? (lane as LaneKey) : undefined);
  }, []);

  const sortChampions = useCallback(
    (key: string, order: 'asc' | 'desc' = 'asc') => {
      setSortKey(key);
      setSortOrder(order);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setRoleFilter(undefined);
    setLaneFilter(undefined);
    setSortKey('name');
    setSortOrder('asc');
  }, []);
  // Lookup functions
  const getChampionById = useCallback(
    (id: string): Champion | undefined => {
      return allChampions.find(
        champion => champion.id.toLowerCase() === id.toLowerCase()
      );
    },
    [allChampions]
  );

  const getChampionByHeroId = useCallback(
    (heroId: number): Champion | undefined => {
      return allChampions.find(champion => champion.hero_id === heroId);
    },
    [allChampions]
  );

  return {
    champions,
    allChampions,
    loading,
    error,
    refetch: fetchChampions,
    searchChampions,
    filterByRole,
    filterByLane,
    sortChampions,
    clearFilters,
    getChampionById,
    getChampionByHeroId,
  };
}
