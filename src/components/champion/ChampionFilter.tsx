'use client';

import { useFilters } from '@/contexts/FilterContext';
import { RoleKey, LaneKey } from '@/types';

const roleLabels: Record<RoleKey, string> = {
  fighter: 'ファイター',
  mage: 'メイジ',
  assassin: 'アサシン',
  marksman: 'マークスマン',
  support: 'サポート',
  tank: 'タンク',
};

const laneLabels: Record<LaneKey, string> = {
  mid: 'ミッド',
  jungle: 'ジャングル',
  top: 'トップ',
  support: 'サポート',
  ad: 'ADキャリー',
};

export function ChampionFilter() {
  const { selectedRoles, selectedLanes, toggleRole, toggleLane, clearFilters } =
    useFilters();

  return (
    <div className="space-y-4">
      {/* ロールフィルター */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          ロール
        </h3>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(roleLabels) as [RoleKey, string][]).map(
            ([role, label]) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${
                  selectedRoles.has(role)
                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }
              `}
                aria-pressed={selectedRoles.has(role)}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* レーンフィルター */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          レーン
        </h3>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(laneLabels) as [LaneKey, string][]).map(
            ([lane, label]) => (
              <button
                key={lane}
                onClick={() => toggleLane(lane)}
                className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${
                  selectedLanes.has(lane)
                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }
              `}
                aria-pressed={selectedLanes.has(lane)}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* クリアボタン */}
      {(selectedRoles.size > 0 || selectedLanes.size > 0) && (
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            フィルターをクリア
          </button>
        </div>
      )}
    </div>
  );
}
