'use client';

import { useChampions } from '@/contexts/ChampionContext';

export function ChampionSearch() {
  const { searchTerm, setSearchTerm } = useChampions();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        チャンピオン検索
      </h3>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="チャンピオン名を入力..."
        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-gray-700 
                 text-gray-900 dark:text-white 
                 placeholder-gray-500 dark:placeholder-gray-400
                 focus:ring-blue-500 focus:border-blue-500"
        aria-label="チャンピオン検索"
      />
    </div>
  );
}
