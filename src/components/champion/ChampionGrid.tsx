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
import { useState, useEffect } from 'react';

export function ChampionGrid() {
  const { champions, loading, error, filteredChampions } = useChampions();
  const { selectedRoles, selectedLanes, toggleRole, toggleLane } = useFilters();
  const { sortKey, setSortKey, sortOrder, setSortOrder } = useSort();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedRoles,
    selectedLanes,
    sortKey,
    sortOrder,
    filteredChampions.length,
  ]);

  // ページ変更時にトップにスクロール
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // ページネーション用のロジック
  const totalPages = Math.ceil(filteredChampions.length / itemsPerPage);

  // Ensure current page is valid
  const validatedCurrentPage = Math.min(currentPage, totalPages);
  const indexOfLastItem = validatedCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentChampions = filteredChampions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // If current page is invalid, update it
  if (currentPage !== validatedCurrentPage) {
    setCurrentPage(validatedCurrentPage);
  }

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

        {/* Champions Grid with Enhanced Pagination */}
        <div className="md:col-span-3 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentChampions.map(champion => (
              <ChampionCard key={champion.id} champion={champion} />
            ))}
          </div>

          {/* Enhanced Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="pagination-text">
              {filteredChampions.length}体のチャンピオン中{' '}
              {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredChampions.length)}体を表示
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="pagination-button"
                aria-label="最初のページへ"
              >
                «
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
                aria-label="前のページへ"
              >
                ‹
              </button>
              <span className="pagination-text">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
                aria-label="次のページへ"
              >
                ›
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="pagination-button"
                aria-label="最後のページへ"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
