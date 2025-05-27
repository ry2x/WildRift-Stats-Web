'use client';

import { Logo } from '@/components/ui/Logo';

export default function Title() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text mb-6 animate-gradient title-gradient flex items-center justify-center gap-2">
            <Logo
              aria-label="Wild Rift Stats Logo"
              className="w-12 h-12 md:w-16 md:h-16 fill-[url(#title-sync-gradient)]"
            />
            Wild Rift Stats
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          チャンピオンの統計データを分析して、最適な戦略を見つけよう
        </p>
      </div>
    </section>
  );
}
