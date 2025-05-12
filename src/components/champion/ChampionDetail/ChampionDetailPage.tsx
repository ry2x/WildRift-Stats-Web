'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loading } from '@/components/ui/Loading';
import { Champion } from '@/types/champion';
import { HeroStats, Lane, RankRange } from '@/types/stats';
import { StatsProvider } from '@/contexts/StatsContext';

interface ChampionDetailPageProps {
  champion: Champion;
  rankStats: Record<RankRange, Record<Lane, HeroStats>>;
}

// Dynamic import with loading
const ChampionDetailsMain = dynamic(
  () => import('./ChampionDetailsMain').then(mod => mod.ChampionDetailsMain),
  {
    loading: () => <Loading message="チャンピオン情報を読み込み中..." />,
    ssr: false, // Disable SSR for this component
  }
);

export function ChampionDetailPage({
  champion,
  rankStats,
}: ChampionDetailPageProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense
        fallback={<Loading message="チャンピオン情報を読み込み中..." />}
      >
        <ChampionDetailsMain champion={champion} stats={rankStats} />
      </Suspense>
    </main>
  );
}
