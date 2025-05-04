'use client';

import { useCallback } from 'react';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ChampionGrid } from '@/components/champion/ChampionGrid';

export default function Home() {
  const handleRetry = useCallback(() => {
    alert('Retry clicked!');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      <h1 className="mb-8 text-3xl font-bold">Wild Rift チャンピオン一覧</h1>
      <ChampionGrid />

      <h2 className="text-2xl font-bold mb-4">コンポーネントテスト</h2>

      {/* Loading component test */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Loading Component</h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Loading message="データを読み込み中です..." />
        </div>
      </div>

      {/* Error component test */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Error Component</h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <ErrorMessage
            message="データの読み込みに失敗しました"
            onRetry={handleRetry}
          />
        </div>
      </div>
    </div>
  );
}
