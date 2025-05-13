import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const baseUrl = process.env.REDTYPE_URL || 'http://localhost:1337';
    return [
      {
        source: '/api/redtype/:path*',
        destination: `${baseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
