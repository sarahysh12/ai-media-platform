import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-1f82cad03a5343eca857c8175ab7813b.r2.dev',
        port: '',
        pathname: '/tile-images/**',
      },
    ],
  },
};

export default nextConfig;
