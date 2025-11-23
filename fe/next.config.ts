/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
  reactStrictMode: false,
  // Remove swcMinify - it's deprecated
  experimental: {
    webpackBuildWorker: true,
  },
  // Add empty turbopack config to silence the warning
  turbopack: {},
};

module.exports = withPWA(nextConfig);
