'use client';

import { useChampions } from '@/contexts/ChampionContext';

export function ChampionSearch() {
  const { searchTerm, setSearchTerm } = useChampions();

  return (
    <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 p-4 rounded-lg shadow-md backdrop-blur-sm border border-white/20 dark:border-blue-900/20">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
        チャンピオン検索
      </h3>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="チャンピオン名を入力..."
        className="w-full p-2 rounded-md border border-blue-200/20 dark:border-blue-400/20
                 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-900/80
                 text-gray-900 dark:text-white 
                 placeholder-gray-500 dark:placeholder-gray-400
                 focus:ring-blue-500 focus:border-blue-500
                 backdrop-blur-sm"
        aria-label="チャンピオン検索"
      />
    </div>
  );
}
