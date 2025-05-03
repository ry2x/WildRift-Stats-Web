export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      {/* Header */}
      <header className="p-4 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Wild Rift Champion Stats
        </h1>
        <p className="mt-2 text-blue-200">
          チャンピオンの勝率をチェックしよう！
        </p>
      </header>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="チャンピオン名を入力..."
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 px-4 py-1 rounded-md hover:bg-blue-700 transition-colors">
            検索
          </button>
        </div>
      </div>

      {/* Stats Area */}
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">チャンピオン統計</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ここに統計カードを追加していきます */}
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400">準備中...</p>
              <p className="text-sm text-gray-500">
                チャンピオンを検索してください
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
