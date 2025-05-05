import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loading } from '@/components/ui/Loading';
import {
  PositionStats,
  WinRates,
  Lane,
  RankRange,
  HeroStats,
} from '@/types/stats';
import { headers } from 'next/headers';

interface ChampionDetailPageProps {
  params: Promise<{
    championId: string;
  }>;
}

type RankedStats = Record<RankRange, Record<Lane, HeroStats>>;

// Dynamic import with loading
const ChampionDetailsMain = dynamic(
  () =>
    import('@/components/champion/ChampionDetail/ChampionDetailsMain').then(
      mod => mod.ChampionDetailsMain
    ),
  {
    loading: () => <Loading message="チャンピオン情報を読み込み中..." />,
    ssr: true,
  }
);

export default async function ChampionDetailPage({
  params,
}: ChampionDetailPageProps) {
  const { championId } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  if (!championId) {
    notFound();
  }

  // Fetch champion data
  const response = await fetch(`${protocol}://${host}/api/champions`, {
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch champion data');
  }

  const champions = await response.json();
  const champion = champions.find(
    (c: any) => c.id.toLowerCase() === championId.toLowerCase()
  );

  if (!champion) {
    notFound();
  }

  // 各ランク帯のデータを取得
  const rankStats = {} as RankedStats;
  const ranks: RankRange[] = ['0', '1', '2', '3', '4'];
  const lanes: Lane[] = ['1', '2', '3', '4', '5'];

  // 各ランク帯のデータを並列で取得
  const statsPromises = ranks.map(rank =>
    fetch(`${protocol}://${host}/api/stats/${rank}`, {
      cache: 'force-cache',
    }).then(res => res.json())
  );

  const statsResults = await Promise.all(statsPromises);

  // 各ランク帯のデータを整理
  ranks.forEach((rank, index) => {
    const statsData = statsResults[index] as PositionStats;
    const laneStats = {} as Record<Lane, HeroStats>;

    // レーンごとのデータを収集
    for (const lane of lanes) {
      const laneData = statsData[lane];
      if (laneData) {
        const champStats = laneData.find(
          (stat: HeroStats) =>
            stat.hero_id &&
            stat.hero_id.toString() === champion.hero_id.toString()
        );
        if (champStats) {
          laneStats[lane] = champStats;
        }
      }
    }

    rankStats[rank] = laneStats;
  });

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
