'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Rendering only after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-linear-to-r from-white via-blue-50 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-200 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wild Rift Stats
            </h1>
          </Link>{' '}
          {/* PC Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link
                href="/champions"
                className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-linear-to-r after:from-blue-600 after:to-purple-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                チャンピオン一覧
              </Link>
              <Link
                href="/stats"
                className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-linear-to-r after:from-blue-600 after:to-purple-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                統計
              </Link>
            </nav>
            <ThemeToggle />
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu (Expandable) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {' '}
          <nav className="flex flex-col space-y-2 pt-2 pb-3 text-right px-2">
            <Link
              href="/champions"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              チャンピオン一覧
            </Link>
            <Link
              href="/stats"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              統計
            </Link>
            <div className="flex justify-end py-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
