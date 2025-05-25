'use client';

export default function Title() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 mb-6">
          Wild Rift Stats
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          チャンピオンの統計データを分析して、最適な戦略を見つけよう
        </p>
      </div>
    </section>
  );
}
