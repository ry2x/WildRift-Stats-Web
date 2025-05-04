'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Wild Rift Stats
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            チャンピオンの統計データを分析して、最適な戦略を見つけよう
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Champions Section */}
            <Link
              href="/champions"
              className="group p-8 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-blue-900/20"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                チャンピオン一覧
                <span className="inline-block ml-2 text-blue-500 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                全チャンピオンの詳細情報、役割、レーン、勝率などを確認できます
              </p>
            </Link>

            {/* Stats Section */}
            <Link
              href="/stats"
              className="group p-8 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-blue-900/20"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                統計情報
                <span className="inline-block ml-2 text-blue-500 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                ランク別の勝率、ピック率、バン率などの詳細な統計データを分析できます
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
