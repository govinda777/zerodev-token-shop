/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Headers de segurança otimizados
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://auth.privy.io https://rpc.sepolia.org https://*.privy.io https://*.zerodev.app data: blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob: https://*.walletconnect.com https://*.walletconnect.org https://api.web3modal.org",
              "connect-src 'self' https://auth.privy.io https://rpc.sepolia.org wss://rpc.sepolia.org https://api.privy.io https://*.zerodev.app https://*.walletconnect.com https://*.walletconnect.org https://pulse.walletconnect.org https://api.web3modal.org https://explorer-api.walletconnect.com https://rpc.walletconnect.com wss://*.walletconnect.com https://*.privy.systems https://sepolia.rpc.privy.systems https://rpc.zerodev.app wss://rpc.zerodev.app",
              "frame-src 'self' https://auth.privy.io https://*.privy.io https://*.walletconnect.com https://*.walletconnect.org https://verify.walletconnect.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          }
        ],
      },
    ];
  },
  // Configuração webpack otimizada
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Otimizações para desenvolvimento
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    return config;
  },
  // Compilador otimizado
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  // Configurações experimentais removidas para estabilidade
  experimental: {
    // Remover configurações experimentais que podem causar problemas
  },
  // Otimizações de performance
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
