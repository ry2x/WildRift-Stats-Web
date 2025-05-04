'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const [mounted, setMounted] = useState(false);

  // hydrationのミスマッチを防ぐためにマウント後にのみレンダリング
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-200 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wild Rift Stats
            </h1>
          </Link>

          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/champions"
                className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                チャンピオン一覧
              </Link>
              <Link
                href="/stats"
                className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                統計
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
