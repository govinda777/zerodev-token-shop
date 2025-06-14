"use client";

import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { createContext, useEffect, useState, useCallback } from "react";
import { MockAuthProvider } from './MockAuthProvider';
import { sepolia } from 'viem/chains';
import { NETWORK_CONFIG } from '@/contracts/config';

interface AuthContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  address: string | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Interceptação global mais robusta e silenciosa
let interceptorInstalled = false;

const installRPCInterceptor = () => {
  if (typeof window === 'undefined' || interceptorInstalled) return;
  
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Interceptar apenas RPCs não autorizados (não ZeroDev)
    const blockedDomains = [
      'sepolia.drpc.org',
      '.drpc.org',
      'ethereum-sepolia-rpc.allthatnode.com'
    ];
    
    const isZeroDevRPC = url && url.includes('zerodev.app');
    const shouldIntercept = !isZeroDevRPC && blockedDomains.some(domain => url && url.includes(domain));
    
    if (shouldIntercept && NETWORK_CONFIG.rpcUrl) {
      // Log apenas em desenvolvimento para evitar spam no console
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 RPC redirected:', url, '->', NETWORK_CONFIG.rpcUrl);
      }
      
      const newInput = typeof input === 'string' 
        ? NETWORK_CONFIG.rpcUrl
        : input instanceof URL 
          ? new URL(NETWORK_CONFIG.rpcUrl)
          : { ...input, url: NETWORK_CONFIG.rpcUrl };
      
      return originalFetch.call(this, newInput, init);
    }
    
    return originalFetch.call(this, input, init);
  };
  
  interceptorInstalled = true;
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ RPC Interceptor installed successfully');
  }
};

// Instalar interceptor imediatamente
installRPCInterceptor();

// Configuração customizada do Sepolia com nosso RPC
const customSepolia = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [NETWORK_CONFIG.rpcUrl],
      webSocket: [`wss://rpc.sepolia.org`],
    },
    public: {
      http: [NETWORK_CONFIG.rpcUrl],
      webSocket: [`wss://rpc.sepolia.org`],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
  },
};

console.log('🔧 AuthProvider: Using custom RPC:', NETWORK_CONFIG.rpcUrl);

function PrivyWrapper({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user } = usePrivy();
  const [useFallback, setUseFallback] = useState(false);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  
  const handleFallback = useCallback(() => {
    console.warn('🔄 Switching to fallback authentication');
    setUseFallback(true);
  }, []);

  useEffect(() => {
    console.log('Privy status:', { ready, authenticated, user: !!user });
    
    if (ready) {
      console.log('✅ Privy initialized successfully');
      return;
    }

    // Timeout progressivo para fallback
    const timeout = setTimeout(() => {
      setInitializationAttempts(prev => {
        const newAttempts = prev + 1;
        console.warn(`⏰ Privy initialization attempt ${newAttempts}/3`);
        
        if (newAttempts >= 3) {
          handleFallback();
        }
        
        return newAttempts;
      });
    }, 3000 + (initializationAttempts * 2000)); // 3s, 5s, 7s

    return () => clearTimeout(timeout);
  }, [ready, authenticated, user, initializationAttempts, handleFallback]);
  
  if (useFallback) {
    return (
      <MockAuthProvider>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 mb-4 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ Usando autenticação simulada (Privy indisponível após 3 tentativas)
          </p>
        </div>
        {children}
      </MockAuthProvider>
    );
  }
  
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center max-w-md">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-3">Inicializando autenticação</h2>
          <p className="text-gray-400 mb-6">
            Conectando com o Privy... (Tentativa {initializationAttempts + 1}/3)
          </p>
          <div className="text-xs text-gray-500">
            <p>Powered by Privy</p>
            <p className="mt-2">Fallback automático após 3 tentativas</p>
          </div>
          <button
            onClick={handleFallback}
            className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
          >
            Usar Modo Demo Agora
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    console.error('❌ NEXT_PUBLIC_PRIVY_APP_ID is not set - using fallback auth');
    return (
      <MockAuthProvider>
        <div className="bg-red-500/10 border border-red-500/30 p-3 mb-4 rounded-lg">
          <p className="text-red-400 text-sm">
            ❌ Configuração do Privy não encontrada - usando autenticação simulada
          </p>
        </div>
        {children}
      </MockAuthProvider>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
          logo: undefined,
        },
        // Configurar Sepolia customizado com nosso RPC
        supportedChains: [customSepolia],
        defaultChain: customSepolia,
        // Configurações otimizadas para evitar conflitos
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        // Configurações de carteiras externas simplificadas
        externalWallets: {
          walletConnect: {
            enabled: true,
            // Configuração dinâmica da URL para resolver problema de porta
            ...(typeof window !== 'undefined' && {
              metadata: {
                name: 'ZeroDev Token Shop',
                description: 'Marketplace de tokens na blockchain Sepolia',
                url: window.location.origin,
                icons: [`${window.location.origin}/favicon.ico`]
              }
            })
          },
          coinbaseWallet: {
            connectionOptions: 'all',
          },
        },
      }}
    >
      <PrivyWrapper>
        {children}
      </PrivyWrapper>
    </PrivyProvider>
  );
} 