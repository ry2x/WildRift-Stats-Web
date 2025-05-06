import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { PositionStats, Lane, RankRange, HeroStats } from '@/types/stats';
import { ChampionDetailPage } from '@/components/champion/ChampionDetail/ChampionDetailPage';
import { Champion, Champions } from '@/types/champion';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

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
  // プロトコルの判定をより安全に
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

    // Obtain data for each rank band
    const rankStats = {} as RankedStats;
    const ranks: RankRange[] = ['0', '1', '2', '3', '4'];
    const lanes: Lane[] = ['1', '2', '3', '4', '5'];

    // Acquire data for each rank band in parallel (improved error handling)
    try {
      const statsPromises = ranks.map(rank =>
        fetch(`${protocol}://${host}/api/stats/${rank}`, {
          cache: 'force-cache',
          next: { revalidate: 3600 }, // Hourly revalidation
        }).then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch stats for rank ${rank}`);
          }
          return res.json();
        })
      );

      const statsResults = await Promise.all(statsPromises);

      // Organize data for each rank band
      ranks.forEach((rank, index) => {
        const statsData = statsResults[index] as PositionStats;
        const laneStats = {} as Record<Lane, HeroStats>;

        // Collect data for each lane
        for (const lane of lanes) {
          const laneData = statsData[lane];
          if (laneData) {
            const champStats = laneData.find(
              stat =>
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
