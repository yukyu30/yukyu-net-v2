import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yukyu-net-production.s3.ap-northeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Optimize serverless function size by excluding large directories
  outputFileTracingExcludes: {
    '*': [
      'articles/**/*',
      'public_articles/**/*'
    ]
  }
};

export default nextConfig;
