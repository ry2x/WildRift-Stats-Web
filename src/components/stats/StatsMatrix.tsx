'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStats } from '@/contexts/StatsContext';
import { useChampions } from '@/contexts/ChampionContext';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { RankRange, Lane, HeroStats, SortKey, SortOrder } from '@/types';
import { RankFilter } from './RankFilter';
import { LaneFilter } from './LaneFilter';
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
  const [isLaneOpen, setIsLaneOpen] = useState(true);

  // Simple rank change without refresh
  const handleRankClick = useCallback(
    (rank: RankRange) => {
      if (rank === currentRank) return;
      setCurrentRank(rank);
    },
    [currentRank, setCurrentRank]
  );

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
  }

  // Empty state
  if (!stats?.data || !stats.data[currentRank]) {
    return (
      <EmptyState
        title="統計情報が見つかりませんでした"
        description="選択した条件に一致する統計情報は存在しません。"
        onRetry={handleRetry}
      />
    );
  }

  const currentStats = stats.data[currentRank];
  const lanes = Object.keys(currentStats) as Lane[];

  // Sort champions based on current sort key and order
  const sortedChampions =
    currentStats[selectedLane]?.sort((a, b) => {
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
    <div className="space-y-8">
      {/* Combined Filter Section */}
      <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 p-4 rounded-lg shadow-md backdrop-blur-sm border border-white/20 dark:border-blue-900/20 space-y-6">
        {/* Rank Filter */}
        <RankFilter
          currentRank={currentRank}
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

      {/* Stats Table */}
      <StatsTable
        sortedChampions={sortedChampions}
        championMap={championMap}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
