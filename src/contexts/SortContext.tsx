'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Champion } from '@/types/champion';

export type SortKey = 'name' | 'difficult' | 'damage' | 'survive' | 'utility';
export type SortOrder = 'asc' | 'desc';

interface SortContextType {
  sortKey: SortKey;
  sortOrder: SortOrder;
  setSortKey: (key: SortKey) => void;
  setSortOrder: (order: SortOrder) => void;
  sortChampions: (champions: Champion[]) => Champion[];
}

const SortContext = createContext<SortContextType | undefined>(undefined);

export function SortProvider({ children }: { children: ReactNode }) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortChampions = (champions: Champion[]) => {
    return [...champions].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  };

  return (
    <SortContext.Provider
      value={{
        sortKey,
        sortOrder,
        setSortKey,
        setSortOrder,
        sortChampions,
      }}
    >
      {children}
    </SortContext.Provider>
  );
}

export function useSort() {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error('useSort must be used within a SortProvider');
  }
  return context;
}
