'use client';

import { useChampions } from '@/contexts/ChampionContext';
import { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function ChampionSearch() {
  const { searchTerm, setSearchTerm } = useChampions();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // デバウンス処理された検索語の更新
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    [setSearchTerm]
  );

  // 入力値の変更をハンドル
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value); // ローカルの状態を即時更新
    debouncedSetSearchTerm(value); // デバウンスされた更新を実行
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 p-4 rounded-lg shadow-md backdrop-blur-sm border border-white/20 dark:border-blue-900/20">
      <div className="flex items-center gap-2 mb-4">
        <MagnifyingGlassIcon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
          チャンピオン検索
        </h3>
      </div>
      <div className="relative">
        <input
          type="text"
          value={localSearchTerm}
          onChange={handleChange}
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
    </div>
  );
}
