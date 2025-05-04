'use client';

import { useChampions } from '@/contexts/ChampionContext';
import { ChampionCard } from './ChampionCard';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ChampionSearch } from './ChampionSearch';
import { ChampionFilter } from './ChampionFilter';
import { ChampionSort } from './ChampionSort';

export function ChampionGrid() {
  const { loading, error, filteredChampions, refreshChampions } =
    useChampions();

  if (loading) return <Loading message="チャンピオンデータを読み込み中..." />;
  if (error)
    return (
      <ErrorMessage
        message="チャンピオンデータの取得に失敗しました"
        error={error}
        onRetry={refreshChampions}
      />
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* コントロールパネル */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            チャンピオンを探す
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="flex-1">
                <ChampionSearch />
              </div>
              <div className="flex-shrink-0">
                <ChampionSort />
              </div>
            </div>
            <ChampionFilter />
          </div>
        </div>

        {/* チャンピオングリッド */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredChampions.map(champion => (
            <ChampionCard key={champion.id} champion={champion} />
          ))}
        </div>

        {/* 検索結果なし */}
        {filteredChampions.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
            <div className="text-gray-600 dark:text-gray-400 text-lg">
              検索条件に一致するチャンピオンが見つかりませんでした。
            </div>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              検索条件やフィルターを変更してみてください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
