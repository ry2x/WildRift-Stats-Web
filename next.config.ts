import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

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
  webpack(config: WebpackConfig): WebpackConfig {
    // Ensure module and rules exist before pushing
    if (!config.module) config.module = {};
    if (!config.module.rules) config.module.rules = [];

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  assetPrefix:
    process.env.NODE_ENV === 'development'
      ? `http://${process.env.DEV_HOST || 'localhost'}:${process.env.DEV_PORT || '3000'}`
      : '',
  async rewrites() {
    // Use Promise.resolve to satisfy the async requirement
    return Promise.resolve([
      {
        source: '/api/stats-proxy',
        destination:
          'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2',
      },
    ]);
  },
};

export default nextConfig;
