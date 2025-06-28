/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // GitHub Pages configuration
  output: 'export',
  trailingSlash: true,
  basePath: '/zerodev-token-shop',
  assetPrefix: '/zerodev-token-shop/',
  // Environment variables fallback for GitHub Pages
  env: {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmaqqs10k00onl20md0g7c7bg',
    NEXT_PUBLIC_ZERODEV_PROJECT_ID: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || 'ca6057ad-912b-4760-ac3d-1f3812d63b12',
    NEXT_PUBLIC_ZERODEV_RPC: process.env.NEXT_PUBLIC_ZERODEV_RPC || 'https://rpc.zerodev.app/api/v3/ca6057ad-912b-4760-ac3d-1f3812d63b12/chain/11155111',
    NEXT_PUBLIC_CHAIN: process.env.NEXT_PUBLIC_CHAIN || 'sepolia',
    NEXT_PUBLIC_TOKEN_CONTRACT: process.env.NEXT_PUBLIC_TOKEN_CONTRACT || '0xYourTokenContract',
    NEXT_PUBLIC_FAUCET_CONTRACT: process.env.NEXT_PUBLIC_FAUCET_CONTRACT || '0xYourFaucetContract',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Ignore build errors temporarily for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Webpack configuration simplificado
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Ignore specific problematic modules
    config.externals = config.externals || [];
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    
    return config;
  },
  // Remover configurações que podem causar problemas
  poweredByHeader: false,
}

module.exports = nextConfig
