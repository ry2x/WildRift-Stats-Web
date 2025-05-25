import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { Champion } from '@/types/champion';
import { HeroStats } from '@/types/stats';
import { SortKey, SortOrder } from '@/types/sort';
import { getWinRateColor } from '@/utils/statsStyle';
import { sortOptions } from '@/constants/stats';

interface StatsTableProps {
  sortedChampions: HeroStats[];
  championMap: Map<string, Champion>;
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortChange: (key: SortKey, order: SortOrder) => void;
}

/**
 * StatsTable component displays champion statistics in a sortable table.
 * Props:
 * - sortedChampions: List of champions sorted according to current criteria
 * - championMap: Map of champion data for lookup
 * - sortKey: Current column being sorted
 * - sortOrder: Current sort direction (asc/desc)
 * - onSortChange: Callback when sort criteria changes
 */
export const StatsTable: FC<StatsTableProps> = ({
  sortedChampions,
  championMap,
  sortKey,
  sortOrder,
  onSortChange,
}) => {
  const handleSortClick = (key: SortKey) => {
    if (sortKey === key) {
      onSortChange(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(key, 'desc');
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] rounded-lg overflow-hidden shadow-xl">
        <thead>
          <tr className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
            <th className="w-48 px-4 py-3 text-left text-sm font-semibold">
              チャンピオン
            </th>
            {sortOptions.map(option => (
              <th
                key={option.key}
                className="w-28 px-4 py-3 text-left text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-500 dark:hover:bg-blue-700 group"
                onClick={() => handleSortClick(option.key)}
              >
                <div className="flex items-center gap-2">
                  {option.label}
                  <ArrowUpIcon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      sortKey !== option.key
                        ? 'opacity-0 group-hover:opacity-50'
                        : sortOrder === 'desc'
                          ? 'rotate-180'
                          : ''
                    }`}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/20 bg-linear-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 backdrop-blur-sm">
          {sortedChampions.map((champion: HeroStats) => {
            const championData = championMap.get(champion.hero_id);
            if (!championData) return null;

            return (
              <tr
                key={champion.hero_id}
                className="hover:bg-linear-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-300"
              >
                <td className="w-48 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/champions/${championData.id.toLowerCase()}`}
                      className="relative shrink-0 w-8 h-8 rounded-full overflow-hidden bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 hover:scale-110 transition-transform duration-200"
                    >
                      <Image
                        src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${championData.id}.png`}
                        alt={championData.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </Link>
                    <Link
                      href={`/champions/${championData.id.toLowerCase()}`}
                      className="block truncate text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:scale-105 transition-all duration-200 origin-left hover:translate-x-1"
                    >
                      {championData.name}
                    </Link>
                  </div>
                </td>
                <td
                  className={`w-28 px-4 py-3 font-medium ${getWinRateColor(parseFloat(champion.win_rate_percent))}`}
                >
                  {champion.win_rate_percent}%
                </td>
                <td className="w-28 px-4 py-3 text-blue-600 dark:text-blue-400 font-medium">
                  {champion.appear_rate_percent}%
                </td>
                <td className="w-28 px-4 py-3 text-purple-600 dark:text-purple-400 font-medium">
                  {champion.forbid_rate_percent}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
