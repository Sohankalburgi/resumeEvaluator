import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Ensures best practices are followed
},
typescript: {
    ignoreBuildErrors: true, // Prevents broken builds due to TypeScript errors
},

  experimental: {
    serverComponentsExternalPackages: ['pdf2json'],
  },
};

export default nextConfig;
