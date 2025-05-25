import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/cdn/**',
      },
      {
        protocol: 'https',
        hostname: 'game.gtimg.cn',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'mlol.qt.qq.com',
        pathname: '/go/**',
      },
    ],
  },
  assetPrefix:
    process.env.NODE_ENV === 'development'
      ? `http://${process.env.DEV_HOST || 'localhost'}:${process.env.DEV_PORT || '3000'}`
      : '',
  async rewrites() {
    return [
      {
        source: '/api/stats-proxy',
        destination:
          'http://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2',
      },
    ];
  },
};

export default nextConfig;
