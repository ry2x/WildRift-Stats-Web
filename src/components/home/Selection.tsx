'use client';

import Card from './Card';

export default function Selection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <Card
            title="チャンピオン一覧"
            description="全チャンピオンの詳細情報、役割、レーン、勝率などを確認できます"
            href="/champions"
          />
          <Card
            title="統計情報"
            description="ランク別の勝率、ピック率、バン率などの詳細な統計データを分析できます"
            href="/stats"
          />
        </div>
      </div>
    </section>
  );
}
