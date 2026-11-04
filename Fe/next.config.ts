import './node-compat.js';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.31.250'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'api.dynatours.com' },
      { protocol: 'https', hostname: 'dynatours.com' },
      { protocol: 'https', hostname: 'backdyna.logiclabz.in' },
    ],
  },

  async redirects() {
    return [
      {
        source: '/blog',
        destination: 'https://dynatours.blogspot.com/',
        permanent: false,
      },
      {
        source: '/blogs',
        destination: 'https://dynatours.blogspot.com/',
        permanent: false,
      },
      {
        source: '/blogs/:slug*',
        destination: 'https://dynatours.blogspot.com/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
