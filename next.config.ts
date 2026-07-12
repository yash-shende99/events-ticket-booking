import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets-in.bmscdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'in.bmscdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
