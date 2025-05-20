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
    ],
  },
  assetPrefix:
    process.env.NODE_ENV === 'development'
      ? `http://${process.env.DEV_HOST || 'localhost'}:${process.env.DEV_PORT || '3000'}`
      : '',
};

export default nextConfig;
