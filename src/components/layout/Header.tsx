import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wild Rift Stats
            </h1>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/champions"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                チャンピオン一覧
              </Link>
              <Link
                href="/stats"
                className="text-gray-600 hover:text-gray-900 transition-colors"
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
