'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStats } from '@/contexts/StatsContext';
import { useChampions } from '@/contexts/ChampionContext';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { RankRange, Lane, HeroStats, SortKey, SortOrder } from '@/types';
import { getWinRateColor } from '@/utils/statsStyle';
import { sortOptions } from '@/constants/stats';
import {
  ArrowUpIcon,
  ChevronUpIcon,
  GlobeAltIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { laneDisplayNames, rankDisplayNames } from '@/constants/game';

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

  return (
    <div className="space-y-8">
      {/* Combined Filter Section */}
      <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 p-4 rounded-lg shadow-md backdrop-blur-sm border border-white/20 dark:border-blue-900/20 space-y-6">
        {/* Rank Filter */}
        <div>
          <button
            onClick={() => setIsRankOpen(!isRankOpen)}
            className="w-full flex justify-between items-center text-left"
          >
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                ランクの選択
                <span className="ml-2 text-sm text-blue-400 dark:text-blue-300">
                  ({rankDisplayNames[currentRank]})
                </span>
              </h3>
            </div>
            <ChevronUpIcon
              className={`w-5 h-5 text-blue-400 dark:text-blue-300 transition-transform duration-200
                ${isRankOpen ? '' : 'rotate-180'}`}
            />
          </button>

          <div
            className={`mt-4 transition-all duration-200 overflow-hidden
            ${isRankOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="flex flex-wrap gap-2">
              {Object.entries(rankDisplayNames).map(([rank, name]) => (
                <button
                  key={rank}
                  onClick={() => setCurrentRank(rank as RankRange)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    currentRank === rank
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-500/20 dark:shadow-purple-500/20'
                      : 'bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-900/80 text-gray-700 dark:text-gray-300 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-blue-800'
                  } backdrop-blur-sm border border-blue-200/20 dark:border-blue-400/20`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lane Filter */}
        <div className="border-t border-gray-200/20 dark:border-gray-700/20 pt-6">
          <button
            onClick={() => setIsLaneOpen(!isLaneOpen)}
            className="w-full flex justify-between items-center text-left"
          >
            <div className="flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                レーンの選択
                <span className="ml-2 text-sm text-blue-400 dark:text-blue-300">
                  ({laneDisplayNames[selectedLane]})
                </span>
              </h3>
            </div>
            <ChevronUpIcon
              className={`w-5 h-5 text-blue-400 dark:text-blue-300 transition-transform duration-200
                ${isLaneOpen ? '' : 'rotate-180'}`}
            />
          </button>

          <div
            className={`mt-4 transition-all duration-200 overflow-hidden
            ${isLaneOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="flex flex-wrap gap-2">
              {lanes.map(lane => (
                <button
                  key={lane}
                  onClick={() => setSelectedLane(lane)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedLane === lane
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-500/20 dark:shadow-purple-500/20'
                      : 'bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-900/80 text-gray-700 dark:text-gray-300 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-blue-800'
                  } backdrop-blur-sm border border-blue-200/20 dark:border-blue-400/20`}
                >
                  {laneDisplayNames[lane]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[640px] rounded-lg overflow-hidden shadow-xl">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <th className="w-48 px-4 py-3 text-left text-sm font-semibold">
                チャンピオン
              </th>
              {sortOptions.map(option => (
                <th
                  key={option.key}
                  className="w-28 px-4 py-3 text-left text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-500 dark:hover:bg-blue-700 group"
                  onClick={() => {
                    if (sortKey === option.key) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortKey(option.key);
                      setSortOrder('desc');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {option.label}
                    <ArrowUpIcon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        sortKey !== option.key
                          ? 'opacity-0 group-hover:opacity-50'
                          : sortOrder === 'desc'
                            ? 'rotate-180'
                            : ''
                      }`}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/20 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 backdrop-blur-sm">
            {sortedChampions.map((champion: HeroStats) => {
              const championData = championMap.get(champion.hero_id);
              if (!championData) return null;

              return (
                <tr
                  key={champion.hero_id}
                  className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-300"
                >
                  <td className="w-48 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/champions/${championData.id.toLowerCase()}`}
                        className="relative flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 hover:scale-110 transition-transform duration-200"
                      >
                        <Image
                          src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${championData.id}.png`}
                          alt={championData.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </Link>
                      <Link
                        href={`/champions/${championData.id.toLowerCase()}`}
                        className="block truncate text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:scale-105 transition-all duration-200 origin-left hover:translate-x-1"
                      >
                        {championData.name}
                      </Link>
                    </div>
                  </td>
                  <td
                    className={`w-28 px-4 py-3 font-medium ${getWinRateColor(parseFloat(champion.win_rate_percent))}`}
                  >
                    {champion.win_rate_percent}%
                  </td>
                  <td className="w-28 px-4 py-3 text-blue-600 dark:text-blue-400 font-medium">
                    {champion.appear_rate_percent}%
                  </td>
                  <td className="w-28 px-4 py-3 text-purple-600 dark:text-purple-400 font-medium">
                    {champion.forbid_rate_percent}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
