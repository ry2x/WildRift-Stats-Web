'use client';

import { ChampionGrid } from '@/components/champion/ChampionGrid';

export default function ChampionsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <ChampionGrid />
    </main>
  );
}
