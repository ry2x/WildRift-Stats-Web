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
import { Champion, Champions } from '@/types';
import { toKatakana } from '@/utils/convertHiragana';
import { useFilters } from '@/contexts/FilterContext';
import { useSort } from '@/contexts/SortContext';

interface ChampionContextType {
  champions: Champions;
  loading: boolean;
  error: Error | null;
  refreshChampions: () => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredChampions: Champions;
}

const ChampionContext = createContext<ChampionContextType | undefined>(
  undefined
);

export function ChampionProvider({ children }: { children: ReactNode }) {
  const [champions, setChampions] = useState<Champions>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedRoles, selectedLanes } = useFilters();
  const { sortChampions } = useSort();

  // Memoize search term conversion
  const normalizedSearchTerm = useMemo(
    () => toKatakana(searchTerm.toLowerCase()),
    [searchTerm]
  );

  // Memoize filtered champions
  const filteredChampions = useMemo(() => {
    const filtered = champions.filter(champion => {
      // Search filter with memoized term
      const matchesSearch =
        champion.name.toLowerCase().includes(normalizedSearchTerm) ||
        toKatakana(champion.name.toLowerCase()).includes(normalizedSearchTerm);

      // Role filter (AND search)
      const matchesRole =
        selectedRoles.size === 0 ||
        Array.from(selectedRoles).every(role => champion.roles.includes(role));

      // Lane filter (AND search)
      const matchesLane =
        selectedLanes.size === 0 ||
        Array.from(selectedLanes).every(lane => champion.lanes.includes(lane));

      return matchesSearch && matchesRole && matchesLane;
    });

    // Sort filtered results
    return sortChampions(filtered);
  }, [
    champions,
    normalizedSearchTerm,
    selectedRoles,
    selectedLanes,
    sortChampions,
  ]);

  // Optimized fetch with caching
  const fetchChampions = useCallback(async () => {
    try {
      const response = await fetch('/api/champions', {
        cache: 'force-cache',
        next: {
          revalidate: getSecondsUntilNextUpdate(),
          tags: ['champions'],
        },
      });

      if (!response.ok) throw new Error('Failed to fetch champions');

      const data = await response.json();
      setChampions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized refresh with proper cache invalidation
  const refreshChampions = useCallback(async () => {
    try {
      const response = await fetch('/api/champions', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch champions');

      const data = await response.json();
      setChampions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchChampions();
  }, [fetchChampions]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      champions,
      loading,
      error,
      refreshChampions,
      searchTerm,
      setSearchTerm,
      filteredChampions,
    }),
    [champions, loading, error, refreshChampions, searchTerm, filteredChampions]
  );

  return (
    <ChampionContext.Provider value={contextValue}>
      {children}
    </ChampionContext.Provider>
  );
}

/**
 * Helper function to get seconds until next update time
 */
function getSecondsUntilNextUpdate(): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(10, 30, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target.getTime() - now.getTime()) / 1000);
}

export function useChampions() {
  const context = useContext(ChampionContext);
  if (context === undefined) {
    throw new Error('useChampions must be used within a ChampionProvider');
  }
  return context;
}
