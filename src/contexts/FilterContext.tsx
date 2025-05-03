'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { LaneKey, RoleKey } from '@/types';

interface FilterState {
  searchTerm: string;
  selectedRoles: RoleKey[];
  selectedLanes: LaneKey[];
  sortBy: 'name' | 'winRate' | 'pickRate' | 'banRate';
  sortOrder: 'asc' | 'desc';
}

interface FilterContextType {
  filters: FilterState;
  setSearchTerm: (term: string) => void;
  toggleRole: (role: RoleKey) => void;
  toggleLane: (lane: LaneKey) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  searchTerm: '',
  selectedRoles: [],
  selectedLanes: [],
  sortBy: 'name',
  sortOrder: 'asc',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const setSearchTerm = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  const toggleRole = (role: RoleKey) => {
    setFilters(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter(r => r !== role)
        : [...prev.selectedRoles, role],
    }));
  };

  const toggleLane = (lane: LaneKey) => {
    setFilters(prev => ({
      ...prev,
      selectedLanes: prev.selectedLanes.includes(lane)
        ? prev.selectedLanes.filter(l => l !== lane)
        : [...prev.selectedLanes, lane],
    }));
  };

  const setSortBy = (sort: FilterState['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy: sort }));
  };

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearchTerm,
        toggleRole,
        toggleLane,
        setSortBy,
        toggleSortOrder,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
