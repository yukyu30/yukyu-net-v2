import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
