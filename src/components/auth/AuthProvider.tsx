"use client";

import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { createContext, useContext, useEffect, useState } from "react";
import { MockAuthProvider } from './MockAuthProvider';
import { sepolia } from 'viem/chains';

interface AuthContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  address: string | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function PrivyWrapper({ children }: { children: React.ReactNode }) {
  const { ready } = usePrivy();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  
  useEffect(() => {
    console.log('Privy ready status:', ready);
    
    // Timeout de 6 segundos para fallback automático
    const timeout = setTimeout(() => {
      if (!ready) {
        console.warn('Privy loading timeout - switching to fallback auth');
        setUseFallback(true);
      }
    }, 6000);

    if (ready) {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [ready]);
  
  if (useFallback) {
    return (
      <MockAuthProvider>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 mb-4 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ Usando autenticação simulada (Privy indisponível)
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
          <p className="text-gray-400 mb-6">Conectando com o Privy...</p>
          <div className="text-xs text-gray-500">
            <p>Powered by Privy</p>
            <p className="mt-2">Fallback automático em 6 segundos</p>
          </div>
          <button
            onClick={() => setUseFallback(true)}
            className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
          >
            Usar Modo Demo
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
    console.error('NEXT_PUBLIC_PRIVY_APP_ID is not set - using fallback auth');
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
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
        },
        // Configurar apenas Sepolia como rede suportada
        supportedChains: [sepolia],
        defaultChain: sepolia,
      }}
    >
      <PrivyWrapper>
        {children}
      </PrivyWrapper>
    </PrivyProvider>
  );
} 