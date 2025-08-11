import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
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
};

export default nextConfig;
