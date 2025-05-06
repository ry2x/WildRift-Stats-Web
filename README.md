# Wild Rift Stats 🎮

Wild Riftのチャンピオン統計情報を簡単に確認できるウェブアプリケーションです。

## 💫 特徴

- 🏆 チャンピオンの詳細な統計情報の表示
- 🔍 チャンピオン検索機能
- 📊 ランク別の統計データの可視化
- ✨ モダンでレスポンシブなUI
- 🌐 SEO対応

## 📱 ページ構成

### 🏠 ホームページ (/)

- モダンなヒーローセクション
- 主要機能へのクイックアクセス
- グラデーションを活用した美しいUI

### 👥 チャンピオン一覧ページ (/champions)

- 高度な検索・フィルター機能
- ロール/レーン別フィルタリング
- ページネーション付きグリッドレイアウト
- レスポンシブデザイン対応

### 🎯 チャンピオン詳細ページ (/champions/[id])

- ダイナミックなスプラッシュアート表示
- チャンピオンの基本情報（難易度、ダメージ等）
- ランク帯別の詳細な統計データ
- モバイルフレンドリーなレイアウト

### 📈 統計ページ (/stats)

- ランク帯ごとの統計マトリックス
- レーン別の勝率分析
- インタラクティブなデータビジュアライゼーション

## 🛠 技術スタック

- **フレームワーク:** [Next.js](https://nextjs.org/) (App Router)
- **言語:** TypeScript
- **スタイリング:** Tailwind CSS
- **フォント:** Geist Font
- **状態管理:** Context API
- **データフェッチ:** SWR

## 🚀 開発を始める

1. リポジトリをクローンする:

```bash
git clone <your-repo-url>
cd haku-web-wr
```

2. 依存関係をインストール:

```bash
pnpm install
```

3. 開発サーバーを起動:

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)をブラウザで開いてアプリケーションを確認できます。

## 📁 プロジェクト構成

```
src/
├── api/          # APIエンドポイント
├── app/          # Nextjsページとルーティング
├── components/   # UIコンポーネント
├── contexts/     # React Context
├── services/     # 外部サービス連携
├── types/        # TypeScript型定義
└── utils/        # ユーティリティ関数
```

## 📦 デプロイ

このプロジェクトは[Vercel](https://vercel.com)でのデプロイを推奨します：

1. [Vercel](https://vercel.com)でアカウントを作成
2. このリポジトリをインポート
3. デプロイ🚀

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## ✨ クレジット

- UI/UXデザイン: [Your Name]
- アイコン: [Source]
- データソース: Wild Rift API
