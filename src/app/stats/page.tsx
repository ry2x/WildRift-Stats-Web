'use client';

import { Suspense } from 'react';
import { StatsMatrix } from '@/components/stats/StatsMatrix';
import { Loading } from '@/components/ui/Loading';

export default function StatsPage() {
  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <div className="container mx-auto">
        <Suspense fallback={<Loading message="統計情報を読み込み中..." />}>
          <StatsMatrix />
        </Suspense>
      </div>
    </main>
  );
}
