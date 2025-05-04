'use client';

import { useSort, SortKey } from '@/contexts/SortContext';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'name', label: '名前' },
  { value: 'difficult', label: '難易度' },
  { value: 'damage', label: 'ダメージ' },
  { value: 'survive', label: '生存性' },
  { value: 'utility', label: 'ユーティリティ' },
];

export function ChampionSort() {
  const { sortKey, sortOrder, setSortKey, setSortOrder } = useSort();

  const getSortLabel = (label: string) => {
    if (sortOrder === 'asc') {
      return `${label}順 ↑`;
    }
    return `${label}順 ↓`;
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        value={sortKey}
        onChange={e => setSortKey(e.target.value as SortKey)}
        className="pl-4 pr-10 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none cursor-pointer transition-all duration-300"
        aria-label="ソート項目"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {getSortLabel(option.label)}
          </option>
        ))}
      </select>

      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="p-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-300 group"
        aria-label={sortOrder === 'asc' ? '降順に切り替え' : '昇順に切り替え'}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            sortOrder === 'desc' ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 4h13M3 8h9M3 12h5M3 16h13"
          />
        </svg>
      </button>
    </div>
  );
}
