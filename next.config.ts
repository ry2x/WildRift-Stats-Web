import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/cdn/**',
      },
    ],
  },
  assetPrefix:
    process.env.NODE_ENV === 'development' ? 'http://192.168.0.10:3000' : '',
};

export default nextConfig;
