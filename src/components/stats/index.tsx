'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState } from 'react';

import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { useChampions } from '@/contexts/ChampionContext';
import { useStats } from '@/contexts/StatsContext';
import { SortKey, SortOrder } from '@/types/sort';
import { HeroStats, Lane, RankRange, WinRates } from '@/types/stats';
import { formatYYYYMMDDtoISO } from '@/utils/format';

import { LaneFilter } from './LaneFilter';
import { RankFilter } from './RankFilter';
import { StatsTable } from './StatsTable';

export function StatsMatrix() {
  const {
    stats,
    currentRank,
    loading: statsLoading,
    error: statsError,
    setCurrentRank,
    retryFetch: retryStats,
  } = useStats();

  const {
    champions,
    loading: championsLoading,
    error: championsError,
  } = useChampions();

  const [selectedLane, setSelectedLane] = useState<Lane>('1');
  const [sortKey, setSortKey] = useState<SortKey>('win_rate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isRankOpen, setIsRankOpen] = useState(true);
  const [isLaneOpen, setIsLaneOpen] = useState(true); // Simple rank change without refresh - calls updateRank from StatsContext
  const handleRankClick = useCallback(
    (rank: RankRange | 'all') => {
      if (rank === currentRank) return;
      setCurrentRank(rank);
    },
    [currentRank, setCurrentRank]
  );

  // Convert currentRank to actual rank for data access
  const actualRank: RankRange = currentRank === 'all' ? '0' : currentRank;

  // Initialize states based on window size and handle resize
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      setIsRankOpen(isDesktop);
      setIsLaneOpen(isDesktop);
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Map to obtain champion information from champion ID
  const championMap = new Map(
    champions.map(champ => [champ.hero_id.toString(), champ])
  );

  // Handle retry without returning a promise
  const handleRetry = useCallback(() => {
    void retryStats(); // void operator explicitly ignores the promise
  }, [retryStats]);

  // Loading state
  if (statsLoading || championsLoading) {
    return <Loading message="統計情報を読み込み中..." />;
  }

  // Error state
  if (statsError || championsError) {
    return (
      <ErrorMessage error={statsError || championsError} onRetry={retryStats} />
    );
  } // Type guard for stats
  const isValidStats = (stats: WinRates | null): stats is WinRates => {
    return stats !== null && stats.data !== undefined;
  };

  // Empty state
  if (!isValidStats(stats) || !stats.data[actualRank]) {
    return (
      <EmptyState
        title="統計情報が見つかりませんでした"
        description="選択した条件に一致する統計情報は存在しません。"
        onRetry={handleRetry}
      />
    );
  }

  const currentStats = stats.data[actualRank];
  const lanes = Object.keys(currentStats) as Lane[];
  // Sort champions based on current sort key and order
  const sortedChampions =
    currentStats[selectedLane]?.sort((a: HeroStats, b: HeroStats) => {
      const getValueFromKey = (champion: HeroStats) => {
        switch (sortKey) {
          case 'win_rate':
            return parseFloat(champion.win_rate_percent);
          case 'appear_rate':
            return parseFloat(champion.appear_rate_percent);
          case 'forbid_rate':
            return parseFloat(champion.forbid_rate_percent);
          default:
            return 0;
        }
      };

      const valueA = getValueFromKey(a);
      const valueB = getValueFromKey(b);

      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    }) || [];

  // ソート処理のハンドラーを追加
  const handleSortChange = (key: SortKey, order: SortOrder) => {
    setSortKey(key);
    setSortOrder(order);
  };

  return (
    <div className="parent">
      <div className="space-y-8">
        {/* Combined Filter Section */}
        <div className="base-card py-4 shadow-md space-y-2">
          {/* Rank Filter */}
          <RankFilter
            currentRank={actualRank}
            onChange={handleRankClick}
            isOpen={isRankOpen}
            setIsOpen={setIsRankOpen}
          />
          {/* Lane Filter */}
          <LaneFilter
            selectedLane={selectedLane}
            onChange={setSelectedLane}
            isOpen={isLaneOpen}
            setIsOpen={setIsLaneOpen}
            lanes={lanes}
          />
        </div>
        {/* Last Updated Display */}
        <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>
            最終更新日:
            {formatYYYYMMDDtoISO(stats.data[actualRank][1][0].dtstatdate)}
          </span>
        </div>
        {/* Stats Table */}
        <StatsTable
          sortedChampions={sortedChampions}
          championMap={championMap}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
}
