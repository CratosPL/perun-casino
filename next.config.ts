import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['perun-casino.vercel.app'],
  },
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: '/farcaster.json',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/farcaster.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
      {
        source: '/.well-known/farcaster.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
