import { Suspense } from 'react';

import { StatsMatrix } from '@/components/stats';
import { Loading } from '@/components/ui/Loading';

export default function StatsPage() {
  return (
    <main>
      <Suspense fallback={<Loading message="統計情報を読み込み中..." />}>
        <StatsMatrix />
      </Suspense>
    </main>
  );
}
