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
import { withErrorHandling } from '@/utils/errorHandling';

interface ChampionContextType {
  champions: Champions;
  loading: boolean;
  error: Error | null; // unknown型を具体的な型に変更
  refreshChampions: () => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredChampions: Champions;
  retryFetch: () => Promise<void>;
}

const ChampionContext = createContext<ChampionContextType | null>(null);

export function ChampionProvider({ children }: { children: ReactNode }) {
  const [champions, setChampions] = useState<Champions>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedRoles, selectedLanes } = useFilters();
  const { sortChampions } = useSort();

  // 検索用語の正規化をメモ化
  const normalizedSearchTerm = useMemo(
    () => toKatakana(searchTerm.toLowerCase()),
    [searchTerm]
  );

  // フィルター条件のメモ化
  const filterConditions = useMemo(
    () => ({
      hasRoles: selectedRoles.size > 0,
      hasLanes: selectedLanes.size > 0,
      roles: Array.from(selectedRoles),
      lanes: Array.from(selectedLanes),
    }),
    [selectedRoles, selectedLanes]
  );

  // チャンピオンフィルタリング関数のメモ化
  const filterChampion = useCallback(
    (champion: Champion) => {
      // 検索フィルター
      if (normalizedSearchTerm) {
        const name = champion.name.toLowerCase();
        const katakanaName = toKatakana(name);
        if (
          !name.includes(normalizedSearchTerm) &&
          !katakanaName.includes(normalizedSearchTerm)
        ) {
          return false;
        }
      }

      // ロールフィルター（AND検索）
      if (
        filterConditions.hasRoles &&
        !filterConditions.roles.every(role => champion.roles.includes(role))
      ) {
        return false;
      }

      // レーンフィルター（AND検索）
      if (
        filterConditions.hasLanes &&
        !filterConditions.lanes.every(lane => champion.lanes.includes(lane))
      ) {
        return false;
      }

      return true;
    },
    [normalizedSearchTerm, filterConditions]
  );

  // フィルター済みチャンピオンのメモ化
  const filteredChampions = useMemo(
    () => sortChampions(champions.filter(filterChampion)),
    [champions, filterChampion, sortChampions]
  );

  // Optimized fetch with caching and error handling
  const fetchChampions = useCallback(async (forceRefresh = false) => {
    return withErrorHandling(
      async () => {
        try {
          const response = await fetch('/api/champions', {
            cache: forceRefresh ? 'no-store' : 'force-cache',
            next: forceRefresh
              ? undefined
              : {
                  revalidate: getSecondsUntilNextUpdate(),
                  tags: ['champions'],
                },
            headers: forceRefresh
              ? {
                  'Cache-Control': 'no-cache',
                }
              : undefined,
          });

          if (!response.ok) {
            throw new Error('Failed to fetch champions');
          }

          const data = (await response.json()) as Champions;
          setChampions(data);
          setError(null);
        } catch (err) {
          if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error('An unknown error occurred'));
          }
        }
      },
      {
        retry: true,
        maxRetries: 3,
        onError: err => {
          console.error('Error fetching champions:', err);
          if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error('An unknown error occurred'));
          }
        },
      }
    );
  }, []);

  // Optimized refresh with proper cache invalidation
  const refreshChampions = useCallback(async () => {
    try {
      setLoading(true);
      await fetchChampions(true);
    } finally {
      setLoading(false);
    }
  }, [fetchChampions]);

  // Retry fetch function
  const retryFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchChampions();
    } finally {
      setLoading(false);
    }
  }, [fetchChampions]);

  // Initial fetch
  useEffect(() => {
    void fetchChampions().finally(() => setLoading(false));
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
      retryFetch,
    }),
    [
      champions,
      loading,
      error,
      refreshChampions,
      searchTerm,
      filteredChampions,
      retryFetch,
    ]
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
  target.setHours(10, 0, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target.getTime() - now.getTime()) / 1000);
}

export function useChampions() {
  const context = useContext(ChampionContext);
  if (context === null) {
    throw new Error('useChampions must be used within a ChampionProvider');
  }
  return context;
}
