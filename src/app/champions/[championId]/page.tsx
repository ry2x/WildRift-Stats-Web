import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Lane, RankRange, HeroStats } from '@/types/stats';
import { ChampionDetailPage } from '@/components/champion/ChampionDetail/ChampionDetailPage';
import { Champion, Champions } from '@/types/champion';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface ChampionDetailPageProps {
  params: Promise<{
    championId: string;
  }>;
}

type RankedStats = Record<RankRange, Record<Lane, HeroStats>>;

interface StatsData {
  data: {
    [key in RankRange]: {
      [key in Lane]?: HeroStats[];
    };
  };
}

export default async function Page({ params }: ChampionDetailPageProps) {
  const { championId } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || '';
  // More secure protocol decisions
  const protocol =
    host.startsWith('localhost') || host.includes('127.0.0.1')
      ? 'http'
      : 'https';

  if (!championId) {
    notFound();
  }

  // Fetch champion data with improved error handling
  try {
    const response = await fetch(`${protocol}://${host}/api/champions`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Hourly revalidation
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

    // 各ランク帯のデータを取得（統合APIを使用）
    try {
      const response = await fetch(`${protocol}://${host}/api/stats`, {
        cache: 'force-cache',
        next: { revalidate: 3600 }, // 1時間ごとに再検証
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats data');
      }

      const statsData = (await response.json()) as StatsData;
      const rankStats = {} as RankedStats;
      const ranks: RankRange[] = ['0', '1', '2', '3', '4'];
      const lanes: Lane[] = ['1', '2', '3', '4', '5'];

      // 各ランク帯のデータを整理
      ranks.forEach(rank => {
        const rankData = statsData.data[rank];
        const laneStats = {} as Record<Lane, HeroStats>;

        // Collect data for each lane
        for (const lane of lanes) {
          const laneData = rankData[lane];
          if (laneData) {
            const champStats = laneData.find(
              (stat: HeroStats) =>
                stat.hero_id &&
                String(stat.hero_id) === String(champion.hero_id)
            );
            if (champStats) {
              laneStats[lane] = champStats;
            }
          }
        }

        rankStats[rank] = laneStats;
      });

      return <ChampionDetailPage champion={champion} rankStats={rankStats} />;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return <ErrorMessage message="統計情報の取得に失敗しました" />;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
