'use client';

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { laneLabels, roleLabels } from '@/constants/game';
import { useChampions } from '@/contexts/ChampionContext';
import { useStats } from '@/contexts/StatsContext';
import { Champion } from '@/types/champion';
import { HeroStats, Lane, RankRange } from '@/types/stats';

// Import original components
import { ChampionImage } from './ChampionImage';

/**
 * Prepares champion statistics data from raw stats for all ranks and lanes
 *
 * @param stats - Raw stats data from context
 * @param champion - Champion object for which to extract stats
 * @returns Formatted stats data by rank and lane
 */
function prepareChampionStats(
  stats: ReturnType<typeof useStats>['stats'],
  champion: Champion
): Record<RankRange, Record<Lane, HeroStats>> {
  const rankStats: Record<RankRange, Record<Lane, HeroStats>> = {} as Record<
    RankRange,
    Record<Lane, HeroStats>
  >;
  const ranks: RankRange[] = ['0', '1', '2', '3', '4'];

  // Transform stats data from context to the format expected by ChampionDetailPage
  ranks.forEach(rank => {
    const laneStats = {} as Record<Lane, HeroStats>;
    const lanes: Lane[] = ['1', '2', '3', '4', '5'];

    // Get stats for each lane
    if (stats && stats.data && stats.data[rank]) {
      lanes.forEach(lane => {
        if (stats.data[rank][lane]) {
          const champStats = stats.data[rank][lane].find(
            stat => String(stat.hero_id) === String(champion.hero_id)
          );

          if (champStats) {
            laneStats[lane] = champStats;
          }
        }
      });
    }

    rankStats[rank] = laneStats;
  });

  return rankStats;
}

// =====================================
// Main component exported to the app
// =====================================
export function ChampionDetailContainer({
  championId,
}: {
  championId: string;
}) {
  const {
    getChampionById,
    loading: championLoading,
    error: getChampionError,
  } = useChampions();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    retryFetch: retryStats,
  } = useStats();
  const [isReady, setIsReady] = useState(false);

  // Find champion by ID
  const champion = getChampionById(championId);

  useEffect(() => {
    // Wait until both champion data and stats are loaded
    if (!championLoading && !statsLoading) {
      setIsReady(true);
    }
  }, [championLoading, statsLoading]);

  // Show error if any
  if (getChampionError) {
    return <ErrorMessage message="チャンピオン情報の取得に失敗しました" />;
  }

  if (statsError) {
    return <ErrorMessage message="統計情報の取得に失敗しました" />;
  }

  // Show loading state
  if (championLoading || statsLoading || !isReady) {
    return <Loading message="データを読み込み中..." />;
  }

  // Handle not found champion
  if (!champion) {
    notFound();
  }

  // Get champion stats data
  const rankStats = prepareChampionStats(stats, champion);

  // Prepare URLs for images
  const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
  const loadingUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;
  const fallbackUrl = `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${champion.id}.png`;

  // Dynamic imports for sub-components
  const ChampionBasicInfo = dynamic(
    () => import('./ChampionBasicInfo').then(mod => mod.ChampionBasicInfo),
    {
      loading: () => <Loading message="基本情報を読み込み中..." />,
      ssr: true,
    }
  );

  const ChampionStats = dynamic(
    () => import('./ChampionStats').then(mod => mod.ChampionStats),
    {
      loading: () => <Loading message="統計情報を読み込み中..." />,
      ssr: true,
    }
  );

  return (
    <div className="relative w-full">
      {/* Splash Art Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {/* Landscape splash art */}
        <div className="hidden landscape:block h-full w-full">
          <ChampionImage
            src={splashUrl}
            alt={`${champion.name} splash art`}
            className="object-top object-cover transform scale-105 transition-transform duration-1000 hover:scale-110"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            fallbackSrc={fallbackUrl}
          />
        </div>

        {/* Portrait loading art */}
        <div className="block landscape:hidden h-full w-full">
          <ChampionImage
            src={loadingUrl}
            alt={`${champion.name} portrait art`}
            className="object-top object-cover transform scale-105 transition-transform duration-1000 hover:scale-110"
            priority
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 75vw, 50vw"
            fallbackSrc={fallbackUrl}
          />
        </div>

        {/* Multi-layered gradient overlay */}
        <div className="absolute inset-0">
          {/* Base gradient layer */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-900/5 dark:via-gray-900/10 to-slate-900/70 dark:to-gray-900/80" />

          {/* Middle transition layer */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-50/10 dark:via-gray-900/30 to-slate-100/60 dark:to-gray-900/70" />

          {/* Bottom area layer */}
          <div className="absolute bottom-0 h-1/3 inset-x-0 bg-linear-to-t from-white/80 dark:from-gray-900/90 to-transparent" />
        </div>

        {/* Text protection layer with backdrop */}
        <div className="absolute bottom-0 h-48 inset-x-0">
          <div className="absolute inset-0 bg-linear-to-t from-white/60 dark:from-gray-900/80 via-white/30 dark:via-gray-900/50 to-transparent" />
        </div>

        {/* Champion info section with enhanced layout */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 z-10">
          <div className="max-w-7xl mx-auto">
            {/* Champion title area */}
            <div className="flex flex-col items-center space-y-4">
              {/* Name and title */}
              <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] [text-shadow:0_2px_0_rgb(0_0_0/90%)]">
                  {champion.name}
                </h1>
                <p className="text-2xl text-slate-200 italic drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] [text-shadow:0_2px_0_rgb(0_0_0/90%)]">
                  {champion.title}
                </p>
              </div>

              {/* Roles and Lanes with different color schemes */}
              <div className="flex flex-wrap justify-center gap-4">
                {/* Roles - Blue theme */}
                <div className="flex flex-wrap gap-2 items-center">
                  {champion.roles.map(role => (
                    <span
                      key={role}
                      className="inline-block rounded bg-linear-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-800/90 dark:to-indigo-800/90 px-3 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-100 backdrop-blur-sm border border-blue-200/20 dark:border-blue-400/20"
                    >
                      {roleLabels[role]}
                    </span>
                  ))}
                </div>

                {/* Lanes - Purple theme */}
                <div className="flex flex-wrap gap-2 items-center">
                  {champion.lanes.map(lane => (
                    <span
                      key={lane}
                      className="inline-block rounded bg-linear-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-800/90 dark:to-pink-800/90 px-3 py-1.5 text-sm font-medium text-purple-800 dark:text-purple-100 backdrop-blur-sm border border-purple-200/20 dark:border-purple-400/20"
                    >
                      {laneLabels[lane]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with adjusted position */}
      <div className="relative bg-linear-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 -mt-10">
        {/* Adjusted top gradient */}
        <div className="absolute inset-x-0 -top-40 h-40 bg-linear-to-b from-transparent via-white/95 dark:via-gray-900/95 to-white dark:to-gray-900" />

        {/* Content wrapper with minimal top padding */}
        <div className="relative max-w-7xl mx-auto px-4 pt-0 pb-6 space-y-12">
          {/* Stats Section with Error Handling */}
          <Suspense fallback={<Loading message="統計情報を読み込み中..." />}>
            {statsError ? (
              <ErrorMessage error={statsError} onRetry={retryStats} />
            ) : (
              <ChampionStats stats={rankStats} />
            )}
          </Suspense>

          {/* Basic Info Section */}
          <Suspense fallback={<Loading message="基本情報を読み込み中..." />}>
            <ChampionBasicInfo champion={champion} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
