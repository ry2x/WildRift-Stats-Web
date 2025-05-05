import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { PositionStats, Lane, RankRange, HeroStats } from '@/types/stats';
import { ChampionDetailPage } from '@/components/champion/ChampionDetail/ChampionDetailPage';
import { Champion, Champions } from '@/types/champion';

interface ChampionDetailPageProps {
  params: Promise<{
    championId: string;
  }>;
}

type RankedStats = Record<RankRange, Record<Lane, HeroStats>>;

export default async function Page({ params }: ChampionDetailPageProps) {
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

  const champions = (await response.json()) as Champions;
  const champion = champions.find(
    (c: Champion) => c.id.toLowerCase() === championId.toLowerCase()
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
          stat =>
            stat.hero_id && String(stat.hero_id) === String(champion.hero_id)
        );
        if (champStats) {
          laneStats[lane] = champStats;
        }
      }
    }

    rankStats[rank] = laneStats;
  });

  return <ChampionDetailPage champion={champion} rankStats={rankStats} />;
}
