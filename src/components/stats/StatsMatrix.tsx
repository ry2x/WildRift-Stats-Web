'use client';

import { useState, useEffect } from 'react';
import { useStats } from '@/contexts/StatsContext';
import { useChampions } from '@/contexts/ChampionContext';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { Lane, SortKey, SortOrder } from '@/types';
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
      <div className="rounded-lg bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 p-6 shadow-xl backdrop-blur-sm border border-white/20 dark:border-blue-900/20">
        <p className="text-gray-600 dark:text-gray-300 text-center">
          統計情報が見つかりませんでした。
        </p>
      </div>
    );
  }

  const currentStats = stats.data[currentRank];
  const lanes = Object.keys(currentStats) as Lane[];

  // Sort champions based on current sort key and order
  const sortedChampions =
    currentStats[selectedLane]?.sort((a, b) => {
      const getValueFromKey = (champion: typeof a) => {
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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-8">
      {/* Combined Filter Section */}
      <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 p-4 rounded-lg shadow-md backdrop-blur-sm border border-white/20 dark:border-blue-900/20 space-y-6">
        {/* Rank Filter */}
        <RankFilter
          currentRank={currentRank}
          isOpen={isRankOpen}
          setIsOpen={setIsRankOpen}
          onRankChange={setCurrentRank}
        />

        {/* Lane Filter */}
        <LaneFilter
          selectedLane={selectedLane}
          isOpen={isLaneOpen}
          setIsOpen={setIsLaneOpen}
          onLaneChange={setSelectedLane}
          availableLanes={lanes}
        />
      </div>

      {/* Stats Table */}
      <StatsTable
        champions={championMap}
        sortedStats={sortedChampions}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    </div>
  );
}
