'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { useChampions } from '@/contexts/ChampionContext';
import { useFilters } from '@/contexts/FilterContext';
import { useSort } from '@/contexts/SortContext';
import { LaneKey, RoleKey } from '@/types/champion';

import { ChampionCard } from './ChampionCard';
import { ChampionFilterAndSort } from './ChampionFilterAndSort';
import { ChampionSearch } from './ChampionSearch';
import { Pagination } from './Pagination';

export function ChampionGrid() {
  const { loading, error, filteredChampions, retryFetch } = useChampions();
  const { selectedRoles, selectedLanes, toggleRole, toggleLane } = useFilters();
  const { sortKey, setSortKey, sortOrder, setSortOrder, sortChampions } =
    useSort();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current page from URL
  const currentPageFromUrl = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 12;

  // Track changes to filter state
  const filterState = useMemo(
    () => ({
      roles: Array.from(selectedRoles).sort().join(','),
      lanes: Array.from(selectedLanes).sort().join(','),
    }),
    [selectedRoles, selectedLanes]
  );

  // Memoized pagination values
  const paginationValues = useMemo(() => {
    const sortedChampions = sortChampions(filteredChampions);
    const totalPages = Math.ceil(sortedChampions.length / itemsPerPage);
    const validatedCurrentPage = Math.min(
      Math.max(1, currentPageFromUrl),
      Math.max(1, totalPages)
    );
    const indexOfLastItem = validatedCurrentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return {
      totalPages,
      validatedCurrentPage,
      indexOfLastItem,
      indexOfFirstItem,
      currentChampions: sortedChampions.slice(
        indexOfFirstItem,
        indexOfLastItem
      ),
      totalChampions: sortedChampions.length,
    };
  }, [filteredChampions, currentPageFromUrl, itemsPerPage, sortChampions]);

  // Update URL query parameters
  const updateQueryParams = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      const query = params.toString();
      const url = query ? `?${query}` : '';
      router.push(url, { scroll: false });
    },
    [router, searchParams]
  );

  // Reset page only on filter change (exclude on initialization)
  const prevFilterState = useRef(filterState);
  useEffect(() => {
    if (prevFilterState.current !== filterState) {
      void updateQueryParams(1);
    }
    prevFilterState.current = filterState;
  }, [filterState, updateQueryParams]);

  // Page change handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateQueryParams(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateQueryParams]
  );

  // Update if the current page is invalid (exclude on initial load)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (currentPageFromUrl !== paginationValues.validatedCurrentPage) {
      updateQueryParams(paginationValues.validatedCurrentPage);
    }
  }, [
    currentPageFromUrl,
    paginationValues.validatedCurrentPage,
    updateQueryParams,
  ]);

  if (loading) return <Loading message="チャンピオン情報を読み込み中..." />;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage error={error} onRetry={retryFetch} />
      </div>
    );

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
    <div className="parent">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter and Sort Section */}
        <div className="space-y-6">
          <ChampionSearch />
          <ChampionFilterAndSort
            roles={allRoles}
            selectedRoles={Array.from(selectedRoles)}
            onRoleChange={toggleRole}
            lanes={allLanes}
            selectedLanes={Array.from(selectedLanes)}
            onLaneChange={toggleLane}
            sortBy={sortKey}
            onSortChange={setSortKey}
            sortOrder={sortOrder}
            onOrderChange={setSortOrder}
          />
        </div>

        {/* Champions Grid with Enhanced Pagination */}
        <div className="md:col-span-3 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginationValues.currentChampions.map(champion => (
              <ChampionCard key={champion.id} champion={champion} />
            ))}
          </div>
          {/* Enhanced Pagination Controls */}
          <Pagination
            currentPage={paginationValues.validatedCurrentPage}
            totalPages={paginationValues.totalPages}
            onPageChange={handlePageChange}
            totalItems={paginationValues.totalChampions}
            indexOfFirstItem={paginationValues.indexOfFirstItem}
            indexOfLastItem={paginationValues.indexOfLastItem}
          />
        </div>
      </div>
    </div>
  );
}
