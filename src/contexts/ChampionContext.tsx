'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Champion, Champions } from '@/types';

interface ChampionContextType {
  champions: Champions;
  loading: boolean;
  error: Error | null;
  refreshChampions: () => Promise<void>;
}

const ChampionContext = createContext<ChampionContextType | undefined>(
  undefined
);

export function ChampionProvider({ children }: { children: ReactNode }) {
  const [champions, setChampions] = useState<Champions>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChampions = async () => {
    try {
      const response = await fetch('/api/champions', {
        cache: 'force-cache', // Use cache first
        next: { revalidate: 86400 }, // Revalidate after 24 hours
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
  };

  const refreshChampions = async () => {
    try {
      const response = await fetch('/api/champions', {
        cache: 'no-store', // Skip cache for refresh
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
  };

  useEffect(() => {
    fetchChampions();
  }, []);

  return (
    <ChampionContext.Provider
      value={{ champions, loading, error, refreshChampions }}
    >
      {children}
    </ChampionContext.Provider>
  );
}

export function useChampions() {
  const context = useContext(ChampionContext);
  if (context === undefined) {
    throw new Error('useChampions must be used within a ChampionProvider');
  }
  return context;
}
