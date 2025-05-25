'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { useFilters } from '@/contexts/FilterContext';
import { useSort } from '@/contexts/SortContext';
import { useChampionData } from '@/hooks/useChampionData';
import { Champion, Champions } from '@/types/champion';
import { toKatakana } from '@/utils/convertHiragana';

export interface ChampionContextType {
  champions: Champions;
  loading: boolean;
  error: Error | null;
  refreshChampions: () => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredChampions: Champions;
  retryFetch: () => Promise<void>;
  getChampionById: (id: string) => Champion | undefined;
  getChampionByHeroId: (heroId: number) => Champion | undefined;
}

const ChampionContext = createContext<ChampionContextType | null>(null);

export function ChampionProvider({ children }: { children: ReactNode }) {
  const { selectedRoles, selectedLanes } = useFilters();
  const { sortChampions } = useSort();

  // Use the new custom hook for data management
  const {
    champions: allChampions,
    loading,
    error,
    refetch,
    getChampionById,
    getChampionByHeroId,
  } = useChampionData();

  // Local search term state (for backward compatibility)
  const [searchTerm, setSearchTerm] = useState('');

  // Filter champions based on context filters
  const filteredChampions = useMemo(() => {
    let filtered = [...allChampions];

    // Apply search filter with hiragana conversion
    if (searchTerm) {
      const normalizedSearchTerm = toKatakana(searchTerm.toLowerCase());
      filtered = filtered.filter(champion => {
        const name = champion.name.toLowerCase();
        const katakanaName = toKatakana(name);
        return (
          name.includes(normalizedSearchTerm) ||
          katakanaName.includes(normalizedSearchTerm)
        );
      });
    }

    // Apply role filter (AND search)
    if (selectedRoles.size > 0) {
      const roles = Array.from(selectedRoles);
      filtered = filtered.filter(champion =>
        roles.every(role => champion.roles.includes(role))
      );
    }

    // Apply lane filter (AND search)
    if (selectedLanes.size > 0) {
      const lanes = Array.from(selectedLanes);
      filtered = filtered.filter(champion =>
        lanes.every(lane => champion.lanes.includes(lane))
      );
    }

    // Apply sorting
    return sortChampions(filtered);
  }, [allChampions, searchTerm, selectedRoles, selectedLanes, sortChampions]);

  // Context value
  const contextValue = useMemo(
    () => ({
      champions: allChampions,
      loading,
      error,
      refreshChampions: () => refetch(true),
      searchTerm,
      setSearchTerm,
      filteredChampions,
      retryFetch: () => refetch(false),
      getChampionById,
      getChampionByHeroId,
    }),
    [
      allChampions,
      loading,
      error,
      refetch,
      searchTerm,
      setSearchTerm,
      filteredChampions,
      getChampionById,
      getChampionByHeroId,
    ]
  );

  return (
    <ChampionContext.Provider value={contextValue}>
      {children}
    </ChampionContext.Provider>
  );
}

export function useChampions() {
  const context = useContext(ChampionContext);
  if (context === null) {
    throw new Error('useChampions must be used within a ChampionProvider');
  }
  return context;
}
