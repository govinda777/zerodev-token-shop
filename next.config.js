/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Força o uso do SWC mesmo com configuração Babel presente
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
