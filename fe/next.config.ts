/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // <-- REQUIRED for standalone Docker builds

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
};

module.exports = nextConfig;
