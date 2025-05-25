import { Suspense } from 'react';

import { ChampionGrid } from '@/components/ChampionCards';
import { Loading } from '@/components/ui/Loading';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

export default function ChampionsPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <Suspense
        fallback={<Loading message="チャンピオン情報を読み込み中..." />}
      >
        <ChampionGrid />
      </Suspense>
      <ScrollToTop />
    </main>
  );
}
