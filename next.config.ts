import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/redtype/:path*',
        destination: 'http://localhost:1337/:path*',
      },
    ];
  },
};

export default nextConfig;
