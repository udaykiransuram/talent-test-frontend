import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'videos.pexels.com',
      },
    ],
  },
  // Allow dev requests from alternate origins (e.g., 127.0.0.1:3005) to suppress warnings
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3005',
      'http://127.0.0.1:3005',
    ],
  },
};

export default nextConfig;
