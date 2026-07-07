import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-libsql", "@libsql/client"],
  experimental: {
    serverActions: {
      allowedOrigins: ["samuiservices.com", "samuiservices.onrender.com", "localhost:3000"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'samuiservices.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-3433478e81804444ae052b8316ad0d83.r2.dev',
      },
    ],
  },
};

export default nextConfig;

if (process.env.NODE_ENV === 'development') {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
