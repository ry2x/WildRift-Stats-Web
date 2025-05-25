import { Suspense } from 'react';

import { ChampionDetailContainer } from '@/components/ChampionDetail';
import { Loading } from '@/components/ui/Loading';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

interface ChampionDetailPageProps {
  params: Promise<{
    championId: string;
  }>;
}

export default async function Page({ params }: ChampionDetailPageProps) {
  const { championId } = await params;

  if (!championId) {
    console.error('Champion ID is required but not provided.');
    return null; // Next.js will handle this with notFound() in the client component
  }
  return (
    <main className="min-h-screen bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <Suspense
        fallback={<Loading message="チャンピオン情報を読み込み中..." />}
      >
        <ChampionDetailContainer championId={championId} />
      </Suspense>
      <ScrollToTop />
    </main>
  );
}
