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
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function ChampionGrid() {
  const { champions, loading, error, filteredChampions, retryFetch } =
    useChampions();
  const { selectedRoles, selectedLanes, toggleRole, toggleLane } = useFilters();
  const { sortKey, setSortKey, sortOrder, setSortOrder, sortChampions } =
    useSort();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLから現在のページを取得
  const currentPageFromUrl = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 12;

  // フィルター状態の変更を追跡
  const filterState = useMemo(
    () => ({
      roles: Array.from(selectedRoles).sort().join(','),
      lanes: Array.from(selectedLanes).sort().join(','),
      sort: `${sortKey}-${sortOrder}`,
    }),
    [selectedRoles, selectedLanes, sortKey, sortOrder]
  );

  // メモ化されたページネーション値
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
  }, [
    filteredChampions,
    sortKey,
    sortOrder,
    currentPageFromUrl,
    itemsPerPage,
    sortChampions,
  ]);

  // フィルター変更時のみページをリセット（初期化時は除外）
  const prevFilterState = useRef(filterState);
  useEffect(() => {
    if (prevFilterState.current !== filterState) {
      updateQueryParams(1);
    }
    prevFilterState.current = filterState;
  }, [filterState]);

  // URLクエリパラメーター更新
  const updateQueryParams = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      // 常にページパラメータを設定（1ページ目でも消さない）
      params.set('page', page.toString());
      const query = params.toString();
      const url = query ? `?${query}` : '';
      router.push(url, { scroll: false });
    },
    [router, searchParams]
  );

  // ページ変更のハンドラー
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateQueryParams(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateQueryParams]
  );

  // 現在のページが無効な場合は更新（ただし初期ロード時は除外）
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
            {paginationValues.currentChampions.map(champion => (
              <ChampionCard key={champion.id} champion={champion} />
            ))}
          </div>

          {/* Enhanced Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="pagination-text">
              {paginationValues.totalChampions}体のチャンピオン中{' '}
              {paginationValues.indexOfFirstItem + 1}-
              {Math.min(
                paginationValues.indexOfLastItem,
                paginationValues.totalChampions
              )}
              体を表示
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPageFromUrl === 1}
                className="pagination-button"
                aria-label="最初のページへ"
              >
                «
              </button>
              <button
                onClick={() => handlePageChange(currentPageFromUrl - 1)}
                disabled={currentPageFromUrl === 1}
                className="pagination-button"
                aria-label="前のページへ"
              >
                ‹
              </button>
              <span className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {paginationValues.validatedCurrentPage} /{' '}
                {paginationValues.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPageFromUrl + 1)}
                disabled={currentPageFromUrl === paginationValues.totalPages}
                className="pagination-button"
                aria-label="次のページへ"
              >
                ›
              </button>
              <button
                onClick={() => handlePageChange(paginationValues.totalPages)}
                disabled={currentPageFromUrl === paginationValues.totalPages}
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
