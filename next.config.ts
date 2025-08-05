import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
      'public_articles/**/*',
    ],
    '/posts/[slug]': ['public_articles/**/*'],
  },
  async rewrites() {
    return [
      {
        source: '/public_articles/:path*',
        destination: '/public_articles/:path*',
      },
    ]
  },
};

export default nextConfig;
