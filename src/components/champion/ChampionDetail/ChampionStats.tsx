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
        <h2 className="text-2xl font-bold text-white">統計情報</h2>
        <p className="mt-4 text-slate-300">
          このチャンピオンの統計情報はありません。
        </p>
      </div>
    );
  }

  const currentStats = stats[selectedRank] || {};
  const lanes = Object.keys(currentStats) as Lane[];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white">統計情報</h2>

      {/* Rank Filter */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {(Object.keys(rankDisplayNames) as RankRange[]).map(rank => (
          <button
            key={rank}
            onClick={() => setSelectedRank(rank)}
            className={`whitespace-nowrap rounded px-4 py-2 text-sm font-medium transition ${
              selectedRank === rank
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {rankDisplayNames[rank]}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="mt-6">
        {lanes.length === 0 ? (
          <p className="text-slate-300 p-4 rounded-lg bg-gradient-to-br from-slate-800/90 to-blue-900/90 backdrop-blur-sm border border-white/10">
            このランクでの統計情報はありません。
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lanes.map(lane => {
              const laneStats = currentStats[lane];
              if (!laneStats) return null;

              return (
                <div
                  key={lane}
                  className="rounded-lg bg-gradient-to-br from-slate-800/90 to-blue-900/90 p-4 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-blue-500/30"
                >
                  <h3 className="text-lg font-medium text-white">
                    {laneDisplayNames[lane]}レーン
                  </h3>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">勝率</span>
                      <span
                        className={`font-medium ${getWinRateColor(parseFloat(laneStats.win_rate_percent))}`}
                      >
                        {laneStats.win_rate_percent}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">ピック率</span>
                      <span className="font-medium text-white">
                        {laneStats.appear_rate_percent}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">バン率</span>
                      <span className="font-medium text-white">
                        {laneStats.forbid_rate_percent}%
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">強さ指数</span>
                        <span
                          className={`font-medium ${getStrengthColor(parseInt(laneStats.strength, 10))}`}
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
  if (winRate >= 52) return 'text-green-400';
  if (winRate <= 48) return 'text-red-400';
  return 'text-yellow-400';
}

// 強さ指数に基づいて色を返す関数
function getStrengthColor(strength: number): string {
  if (strength >= 80) return 'text-purple-400';
  if (strength >= 60) return 'text-blue-400';
  if (strength >= 40) return 'text-green-400';
  if (strength >= 20) return 'text-yellow-400';
  return 'text-red-400';
}
