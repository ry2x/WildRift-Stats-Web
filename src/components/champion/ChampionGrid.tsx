import { ChampionCard } from './ChampionCard';
import { useChampions } from '@/contexts/ChampionContext';
import { useStats } from '@/contexts/StatsContext';
import { useFilters } from '@/contexts/FilterContext';
import { getChampionStats } from '@/utils/dataTransform';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { WinRates } from '@/types';

export const ChampionGrid = () => {
  const { champions, loading: championsLoading, error: championsError, refreshChampions } = useChampions();
  const { stats, currentRank, loading: statsLoading, error: statsError, refreshStats } = useStats();
  const { filters } = useFilters();

  // ローディング中の表示
  if (championsLoading || statsLoading) {
    return <Loading message="チャンピオンデータを読み込み中..." />;
  }

  // エラー時の表示
  if (championsError || statsError) {
    const error = championsError || statsError;
    const handleRetry = async () => {
      if (championsError) await refreshChampions();
      if (statsError) await refreshStats();
    };

    return (
      <ErrorMessage
        message="データの取得中にエラーが発生しました"
        error={error}
        onRetry={handleRetry}
      />
    );
  }

  // データが存在しない場合
  if (!champions || !stats) {
    return <ErrorMessage message="チャンピオンデータが見つかりませんでした" />;
  }

  // フィルタリングとソートの適用
  const filteredChampions = champions
    .filter(champion => {
      // 検索フィルター
      if (
        filters.searchTerm &&
        !champion.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // ロールフィルター
      if (
        filters.selectedRoles.length > 0 &&
        !champion.roles.some(role => filters.selectedRoles.includes(role))
      ) {
        return false;
      }

      // レーンフィルター
      if (
        filters.selectedLanes.length > 0 &&
        !champion.lanes.some(lane => filters.selectedLanes.includes(lane))
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const statsData = stats as WinRates;
      const statsA = getChampionStats(statsData, currentRank, '0').find(
        s => s.hero_id === a.hero_id
      );
      const statsB = getChampionStats(statsData, currentRank, '0').find(
        s => s.hero_id === b.hero_id
      );

      switch (filters.sortBy) {
        case 'name':
          return filters.sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'winRate':
          return filters.sortOrder === 'asc'
            ? parseFloat(statsA?.win_rate_percent || '0') -
                parseFloat(statsB?.win_rate_percent || '0')
            : parseFloat(statsB?.win_rate_percent || '0') -
                parseFloat(statsA?.win_rate_percent || '0');
        case 'pickRate':
          return filters.sortOrder === 'asc'
            ? parseFloat(statsA?.appear_rate_percent || '0') -
                parseFloat(statsB?.appear_rate_percent || '0')
            : parseFloat(statsB?.appear_rate_percent || '0') -
                parseFloat(statsA?.appear_rate_percent || '0');
        case 'banRate':
          return filters.sortOrder === 'asc'
            ? parseFloat(statsA?.forbid_rate_percent || '0') -
                parseFloat(statsB?.forbid_rate_percent || '0')
            : parseFloat(statsB?.forbid_rate_percent || '0') -
                parseFloat(statsA?.forbid_rate_percent || '0');
        default:
          return 0;
      }
    });

  // フィルタリング結果が0件の場合
  if (filteredChampions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        検索条件に一致するチャンピオンが見つかりませんでした
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {filteredChampions.map(champion => {
        const statsData = stats as WinRates;
        const championStats = getChampionStats(statsData, currentRank, '0').find(
          s => s.hero_id === champion.hero_id
        );

        return (
          <ChampionCard
            key={champion.id}
            champion={champion}
            stats={championStats}
          />
        );
      })}
    </div>
  );
};
