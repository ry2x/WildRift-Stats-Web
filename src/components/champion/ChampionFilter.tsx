'use client';

import { useFilters } from '@/contexts/FilterContext';
import { RoleKey, LaneKey } from '@/types';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

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

interface ChampionFilterProps {
  roles: RoleKey[];
  selectedRoles: RoleKey[];
  onRoleChange: (role: RoleKey) => void;
  lanes: LaneKey[];
  selectedLanes: LaneKey[];
  onLaneChange: (lane: LaneKey) => void;
}

export function ChampionFilter({
  roles,
  selectedRoles,
  onRoleChange,
  lanes,
  selectedLanes,
  onLaneChange,
}: ChampionFilterProps) {
  const [isRolesOpen, setIsRolesOpen] = useState(window.innerWidth >= 768);
  const [isLanesOpen, setIsLanesOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      setIsRolesOpen(isDesktop);
      setIsLanesOpen(isDesktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-6">
      {/* Role Filter */}
      <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 p-4 rounded-lg shadow-md backdrop-blur-sm border border-white/20 dark:border-blue-900/20">
        <button
          onClick={() => setIsRolesOpen(!isRolesOpen)}
          className="w-full flex justify-between items-center text-left"
        >
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            ロールでフィルター
            {selectedRoles.length > 0 && (
              <span className="ml-2 text-sm text-blue-400 dark:text-blue-300">
                ({selectedRoles.length}個選択中)
              </span>
            )}
          </h3>
          <ChevronUpIcon
            className={`w-5 h-5 text-blue-400 dark:text-blue-300 transition-transform duration-200
              ${isRolesOpen ? '' : 'rotate-180'}`}
          />
        </button>

        <div
          className={`mt-4 transition-all duration-200 overflow-hidden
          ${isRolesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`
                  px-3 py-2 rounded-md transition-all duration-200
                  ${
                    selectedRoles.includes(role)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-md shadow-blue-500/20 dark:shadow-purple-500/20'
                      : 'bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-900/80 text-gray-700 dark:text-gray-300 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-blue-800'
                  }
                  backdrop-blur-sm border border-blue-200/20 dark:border-blue-400/20
                `}
              >
                {roleLabels[role]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lane Filter */}
      <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 p-4 rounded-lg shadow-md backdrop-blur-sm border border-white/20 dark:border-blue-900/20">
        <button
          onClick={() => setIsLanesOpen(!isLanesOpen)}
          className="w-full flex justify-between items-center text-left"
        >
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            レーンでフィルター
            {selectedLanes.length > 0 && (
              <span className="ml-2 text-sm text-blue-400 dark:text-blue-300">
                ({selectedLanes.length}個選択中)
              </span>
            )}
          </h3>
          <ChevronUpIcon
            className={`w-5 h-5 text-blue-400 dark:text-blue-300 transition-transform duration-200
              ${isLanesOpen ? '' : 'rotate-180'}`}
          />
        </button>

        <div
          className={`mt-4 transition-all duration-200 overflow-hidden
          ${isLanesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="flex flex-wrap gap-2">
            {lanes.map(lane => (
              <button
                key={lane}
                onClick={() => onLaneChange(lane)}
                className={`
                  px-3 py-2 rounded-md transition-all duration-200
                  ${
                    selectedLanes.includes(lane)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-md shadow-blue-500/20 dark:shadow-purple-500/20'
                      : 'bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-900/80 text-gray-700 dark:text-gray-300 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-blue-800'
                  }
                  backdrop-blur-sm border border-blue-200/20 dark:border-blue-400/20
                `}
              >
                {laneLabels[lane]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
