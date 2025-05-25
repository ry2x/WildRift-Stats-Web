import { memo } from 'react';
import { Champion } from '@/types/champion';

interface ChampionBasicInfoProps {
  champion: Champion;
}

// Memoized component with performance improvements
export const ChampionBasicInfo = memo(function ChampionBasicInfo({
  champion,
}: ChampionBasicInfoProps) {
  // Helper function to get gradient class based on level
  const getGradientClass = (currentIndex: number, value: number) => {
    if (currentIndex >= Math.ceil(value))
      return 'bg-slate-200 dark:bg-slate-700';

    // Different colors for each level
    if (currentIndex === 0)
      return 'bg-linear-to-r from-emerald-400 to-green-300';
    if (currentIndex === 1)
      return 'bg-linear-to-r from-yellow-400 to-amber-300';
    return 'bg-linear-to-r from-orange-400 to-orange-300';
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Description Card */}
      <div className="rounded-lg bg-linear-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/80 p-6 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 transition-all duration-300 hover:border-blue-300/50 dark:hover:border-blue-500/30 shadow-lg shadow-blue-500/5">
        <h2 className="text-xl font-semibold bg-linear-to-r from-blue-600 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
          チャンピオン説明
        </h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          {champion.describe}
        </p>
      </div>

      {/* Stats and Info Card */}
      <div className="space-y-4">
        {/* Champion Stats */}
        <div className="rounded-lg bg-linear-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/80 p-6 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 transition-all duration-300 hover:border-blue-300/50 dark:hover:border-blue-500/30 shadow-lg shadow-blue-500/5">
          <h2 className="text-xl font-semibold bg-linear-to-r from-blue-600 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-4">
            チャンピオンのステータス
          </h2>

          <div className="space-y-4">
            {/* Difficulty */}
            <div className="group">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                難易度
              </h3>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 w-8 rounded ${getGradientClass(i, champion.difficult)} transition-all duration-300`}
                  />
                ))}
              </div>
            </div>

            {/* Damage */}
            <div className="group">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                ダメージ
              </h3>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 w-8 rounded ${getGradientClass(i, champion.damage)} transition-all duration-300`}
                  />
                ))}
              </div>
            </div>

            {/* Survivability */}
            <div className="group">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                生存性
              </h3>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 w-8 rounded ${getGradientClass(i, champion.survive)} transition-all duration-300`}
                  />
                ))}
              </div>
            </div>

            {/* Utility */}
            <div className="group">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                ユーティリティ
              </h3>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 w-8 rounded ${getGradientClass(i, champion.utility)} transition-all duration-300`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Free Champion Status */}
        {champion.is_free && (
          <div className="rounded-lg bg-linear-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/80 p-6 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 transition-all duration-300 hover:border-blue-300/50 dark:hover:border-blue-500/30 shadow-lg shadow-blue-500/5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <span className="bg-linear-to-r from-blue-600 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent font-medium">
                今週のフリーチャンピオンです！
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
