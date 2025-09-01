import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
    cacheComponents: true,
    useCache: true,
  },
};

export default nextConfig;
