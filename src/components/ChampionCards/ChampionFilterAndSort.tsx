'use client';

import {
  AdjustmentsHorizontalIcon,
  ChevronUpIcon,
  MapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

import { laneLabels, roleLabels, sortOptions } from '@/constants/game';
import { SortKey, SortOrder } from '@/contexts/SortContext';
import { LaneKey, RoleKey } from '@/types/champion';

interface ChampionFilterAndSortProps {
  roles: RoleKey[];
  selectedRoles: RoleKey[];
  onRoleChange: (role: RoleKey) => void;
  lanes: LaneKey[];
  selectedLanes: LaneKey[];
  onLaneChange: (lane: LaneKey) => void;
  sortBy: SortKey;
  onSortChange: (key: SortKey) => void;
  sortOrder: SortOrder;
  onOrderChange: (order: SortOrder) => void;
}

export function ChampionFilterAndSort({
  roles,
  selectedRoles,
  onRoleChange,
  lanes,
  selectedLanes,
  onLaneChange,
  sortBy,
  onSortChange,
  sortOrder,
  onOrderChange,
}: ChampionFilterAndSortProps) {
  const [isRolesOpen, setIsRolesOpen] = useState(window.innerWidth >= 768);
  const [isLanesOpen, setIsLanesOpen] = useState(window.innerWidth >= 768);
  const [isSortOpen, setIsSortOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      setIsRolesOpen(isDesktop);
      setIsLanesOpen(isDesktop);
      setIsSortOpen(isDesktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleOrder = () => {
    onOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="base-card p-4 shadow-md space-y-6">
      {/* Role Filter Section */}
      <div>
        <button
          onClick={() => setIsRolesOpen(!isRolesOpen)}
          className="w-full flex justify-between items-center text-left"
        >
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
            <h3 className="text-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              ロールでフィルター
              {selectedRoles.length > 0 && (
                <span className="ml-2 text-sm text-blue-400 dark:text-blue-300">
                  ({selectedRoles.length}個選択中)
                </span>
              )}
            </h3>
          </div>
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
                      ? 'base-btn-on'
                      : 'base-btn-off'
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

      {/* Lane Filter Section */}
      <div>
        <button
          onClick={() => setIsLanesOpen(!isLanesOpen)}
          className="w-full flex justify-between items-center text-left"
        >
          <div className="flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
            <h3 className="text-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              レーンでフィルター
              {selectedLanes.length > 0 && (
                <span className="ml-2 text-sm text-blue-400 dark:text-blue-300">
                  ({selectedLanes.length}個選択中)
                </span>
              )}
            </h3>
          </div>
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
                      ? 'base-btn-on'
                      : 'base-btn-off'
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

      {/* Sort Section */}
      <div>
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="w-full flex justify-between items-center text-left"
        >
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
            <h3 className="text-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              並び替え
              <span className="ml-2 text-sm text-blue-400 dark:text-blue-300">
                ({sortOptions.find(opt => opt.value === sortBy)?.label})
              </span>
            </h3>
          </div>
          <ChevronUpIcon
            className={`w-5 h-5 text-blue-400 dark:text-blue-300 transition-transform duration-200
              ${isSortOpen ? '' : 'rotate-180'}`}
          />
        </button>

        <div
          className={`mt-4 transition-all duration-200 overflow-hidden
          ${isSortOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="flex flex-wrap gap-2">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  if (sortBy === option.value) {
                    toggleOrder();
                  } else {
                    onSortChange(option.value);
                    onOrderChange('asc');
                  }
                }}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md 
                  transition-all duration-200 
                  ${sortBy === option.value ? 'base-btn-on' : 'base-btn-off'}
                  backdrop-blur-sm border border-blue-200/20 dark:border-blue-400/20
                `}
              >
                <span>{option.label}</span>
                {sortBy === option.value && (
                  <ArrowUpIcon
                    className={`
                      w-4 h-4 transition-transform duration-200
                      ${sortOrder === 'desc' ? 'rotate-180' : ''}
                    `}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
