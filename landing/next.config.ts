import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com"
      }
    ],
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
