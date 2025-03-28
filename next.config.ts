import type { NextConfig } from "next";

const nextConfig: NextConfig = {  
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "i.ytimg.com",
        protocol: "https",
      },
      {
        hostname: "yt3.ggpht.com",
        protocol: "https",
      },
      {
        hostname: "tangible-goose-758.convex.cloud",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
