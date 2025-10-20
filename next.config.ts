import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    typedRoutes: true,
  },
  eslint: {
    dirs: ["app", "components", "lib", "scripts", "types"],
  },
};

export default nextConfig;
