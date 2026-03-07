import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Turbopack is the default in Next.js 16. Empty config satisfies the check.
  // Phase 1: add resolve aliases here if CesiumJS requires them under Turbopack.
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tile.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "assets.cesium.com",
      },
    ],
  },
};

export default nextConfig;
