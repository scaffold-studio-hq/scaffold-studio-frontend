import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "static.debank.com",
      },
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS images
      },
    ],
    unoptimized: true, // Allow loading images without optimization for IPFS/external sources
  },
  webpack: (config, { isServer }) => {
    // Make pino-pretty optional (it's an optional dev dependency from @walletconnect/logger via @stacks/connect)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    };

    // Ignore optional dependencies that are not needed in browser
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino-pretty': false,
      };
    }

    return config;
  },
};

export default nextConfig;
