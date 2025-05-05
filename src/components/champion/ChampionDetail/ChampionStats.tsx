'use client';

import { useState } from 'react';
import { HeroStats, RankRange, Lane } from '@/types/stats';

interface ChampionStatsProps {
  stats: Record<RankRange, Record<Lane, HeroStats>>;
}

// Map API rank values to display names
const rankDisplayNames: Record<RankRange, string> = {
  '0': '全ランク',
  '1': 'ダイヤモンド以上',
  '2': 'マスター以上',
  '3': 'チャレンジャー以上',
  '4': 'スーパーサーバー',
};

// Map API lane values to display names
const laneDisplayNames: Record<Lane, string> = {
  '1': 'ミッド',
  '2': 'トップ',
  '3': 'ADC',
  '4': 'サポート',
  '5': 'ジャングル',
};

export function ChampionStats({ stats }: ChampionStatsProps) {
  const [selectedRank, setSelectedRank] = useState<RankRange>('0');

  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
          統計情報
        </h2>
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          このチャンピオンの統計情報はありません。
        </p>
      </div>
    );
  }

  const currentStats = stats[selectedRank] || {};
  const lanes = Object.keys(currentStats) as Lane[];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
        統計情報
      </h2>

      {/* Rank Filter with enhanced styling */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {(Object.keys(rankDisplayNames) as RankRange[]).map(rank => (
          <button
            key={rank}
            onClick={() => setSelectedRank(rank)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
              selectedRank === rank
                ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-slate-700/90 text-slate-700 dark:text-slate-300 hover:from-blue-50 hover:to-blue-100 dark:hover:from-slate-700/90 dark:hover:to-slate-600/90 hover:text-blue-600 dark:hover:text-white border border-slate-200/50 dark:border-white/10'
            }`}
          >
            {rankDisplayNames[rank]}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="mt-6">
        {lanes.length === 0 ? (
          <div className="rounded-lg bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/80 p-6 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 transition-all duration-300 hover:border-blue-300/50 dark:hover:border-blue-500/30 shadow-lg shadow-blue-500/5">
            <p className="text-slate-700 dark:text-slate-300">
              このランクでの統計情報はありません。
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lanes.map(lane => {
              const laneStats = currentStats[lane];
              if (!laneStats) return null;

              return (
                <div
                  key={lane}
                  className="group rounded-lg bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/80 p-6 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 transition-all duration-300 hover:border-blue-300/50 dark:hover:border-blue-500/30 shadow-lg shadow-blue-500/5"
                >
                  <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent group-hover:to-blue-600 dark:group-hover:to-blue-300 transition-all">
                    {laneDisplayNames[lane]}レーン
                  </h3>

                  <div className="mt-4 space-y-4">
                    {/* Win Rate */}
                    <div className="group/stat flex justify-between items-center p-2 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                      <span className="text-slate-600 dark:text-slate-300 group-hover/stat:text-blue-600 dark:group-hover/stat:text-white transition-colors">
                        勝率
                      </span>
                      <span
                        className={`font-medium ${getWinRateColor(parseFloat(laneStats.win_rate_percent))} group-hover/stat:scale-110 transition-transform`}
                      >
                        {laneStats.win_rate_percent}%
                      </span>
                    </div>

                    {/* Pick Rate */}
                    <div className="group/stat flex justify-between items-center p-2 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                      <span className="text-slate-600 dark:text-slate-300 group-hover/stat:text-blue-600 dark:group-hover/stat:text-white transition-colors">
                        ピック率
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-300 group-hover/stat:scale-110 transition-transform">
                        {laneStats.appear_rate_percent}%
                      </span>
                    </div>

                    {/* Ban Rate */}
                    <div className="group/stat flex justify-between items-center p-2 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                      <span className="text-slate-600 dark:text-slate-300 group-hover/stat:text-blue-600 dark:group-hover/stat:text-white transition-colors">
                        バン率
                      </span>
                      <span className="font-medium text-blue-600 dark:text-purple-300 group-hover/stat:scale-110 transition-transform">
                        {laneStats.forbid_rate_percent}%
                      </span>
                    </div>

                    {/* Strength Index */}
                    <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-white/10">
                      <div className="group/stat flex justify-between items-center p-2 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                        <span className="text-slate-600 dark:text-slate-300 group-hover/stat:text-blue-600 dark:group-hover/stat:text-white transition-colors">
                          強さ指数
                        </span>
                        <span
                          className={`font-medium ${getStrengthColor(parseInt(laneStats.strength, 10))} group-hover/stat:scale-110 transition-transform`}
                        >
                          {laneStats.strength}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// 勝率に基づいて色を返す関数
function getWinRateColor(winRate: number): string {
  if (winRate >= 52) return 'text-green-600 dark:text-green-400';
  if (winRate <= 48) return 'text-red-600 dark:text-red-400';
  return 'text-yellow-600 dark:text-yellow-400';
}

// 強さ指数に基づいて色を返す関数
function getStrengthColor(strength: number): string {
  if (strength >= 80) return 'text-purple-600 dark:text-purple-400';
  if (strength >= 60) return 'text-blue-600 dark:text-blue-400';
  if (strength >= 40) return 'text-green-600 dark:text-green-400';
  if (strength >= 20) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}
