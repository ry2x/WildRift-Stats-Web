'use client';

import { ChampionCard } from './ChampionCard';
import { ChampionFilter } from './ChampionFilter';
import { ChampionSort } from './ChampionSort';
import { ChampionSearch } from './ChampionSearch';
import { useChampions } from '@/contexts/ChampionContext';
import { useFilters } from '@/contexts/FilterContext';
import { useSort } from '@/contexts/SortContext';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';
import { RoleKey, LaneKey } from '@/types';

export function ChampionGrid() {
  const { champions, loading, error, filteredChampions } = useChampions();
  const { selectedRoles, selectedLanes, toggleRole, toggleLane } = useFilters();
  const { sortKey, setSortKey, sortOrder, setSortOrder } = useSort();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const allRoles: RoleKey[] = [
    'fighter',
    'mage',
    'assassin',
    'marksman',
    'support',
    'tank',
  ];
  const allLanes: LaneKey[] = ['mid', 'jungle', 'top', 'support', 'ad'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className="space-y-6">
          <ChampionSearch />
          <ChampionFilter
            roles={allRoles}
            selectedRoles={Array.from(selectedRoles)}
            onRoleChange={toggleRole}
            lanes={allLanes}
            selectedLanes={Array.from(selectedLanes)}
            onLaneChange={toggleLane}
          />
          <ChampionSort
            sortBy={sortKey}
            onSortChange={setSortKey}
            sortOrder={sortOrder}
            onOrderChange={setSortOrder}
          />
        </div>

        {/* Champions Grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredChampions.map(champion => (
              <ChampionCard key={champion.id} champion={champion} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
