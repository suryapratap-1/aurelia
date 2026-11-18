import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: { formats: ['image/avif', 'image/webp'], qualities: [75, 85] },
  poweredByHeader: false,
  devIndicators: false,
  turbopack: {
    // see lib/vendor/three.mjs: one copy of three.js, without fiber's deprecated Clock warning
    resolveAlias: { three: './lib/vendor/three.mjs' },
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
