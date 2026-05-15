import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack(config) {
    config.resolve.alias["@assets"] = path.resolve(process.cwd(), "assets");
    return config;
  },
  turbopack: {},
};

export default nextConfig;
