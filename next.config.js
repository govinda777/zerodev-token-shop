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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://auth.privy.io https://rpc.sepolia.org",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://auth.privy.io https://rpc.sepolia.org wss://rpc.sepolia.org https://api.privy.io",
              "frame-src 'self' https://auth.privy.io",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
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
