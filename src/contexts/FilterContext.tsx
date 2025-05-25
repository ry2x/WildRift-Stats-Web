'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { RoleKey, LaneKey } from '@/types/champion';

interface FilterContextType {
  selectedRoles: Set<RoleKey>;
  selectedLanes: Set<LaneKey>;
  toggleRole: (role: RoleKey) => void;
  toggleLane: (lane: LaneKey) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedRoles, setSelectedRoles] = useState<Set<RoleKey>>(new Set());
  const [selectedLanes, setSelectedLanes] = useState<Set<LaneKey>>(new Set());

  const toggleRole = (role: RoleKey) => {
    setSelectedRoles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(role)) {
        newSet.delete(role);
      } else {
        newSet.add(role);
      }
      return newSet;
    });
  };

  const toggleLane = (lane: LaneKey) => {
    setSelectedLanes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lane)) {
        newSet.delete(lane);
      } else {
        newSet.add(lane);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedRoles(new Set());
    setSelectedLanes(new Set());
  };

  return (
    <FilterContext.Provider
      value={{
        selectedRoles,
        selectedLanes,
        toggleRole,
        toggleLane,
        clearFilters,
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
