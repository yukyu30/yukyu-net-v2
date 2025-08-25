import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
      'public_articles/source/**/*',
    ],
    '/posts/[slug]': ['public_articles/source/**/*'],
  },
  async rewrites() {
    return [
      {
        source: '/public_articles/source/:path*',
        destination: '/public_articles/source/:path*',
      },
    ]
  },
  // 開発サーバーの安定性を向上
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
    }
    return config;
  },
};

export default nextConfig;
