import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  turbopack: {},

  // Serve thư mục /storage (ngoài public/) tại URL /storage/*
  // Dùng serverExternalPackages để sharp hoạt động đúng
  serverExternalPackages: ["sharp"],

  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: "/api/storage/:path*",
      },
    ];
  },
};

export default nextConfig;
