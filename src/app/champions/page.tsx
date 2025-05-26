import { Suspense } from 'react';

import { ChampionGrid } from '@/components/ChampionCards';
import { Loading } from '@/components/ui/Loading';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

export default function ChampionsPage() {
  return (
    <main>
      <Suspense
        fallback={<Loading message="チャンピオン情報を読み込み中..." />}
      >
        <ChampionGrid />
      </Suspense>
      <ScrollToTop />
    </main>
  );
}
