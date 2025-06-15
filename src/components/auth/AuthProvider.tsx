"use client";

import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    console.error('❌ NEXT_PUBLIC_PRIVY_APP_ID is not set');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center p-8">
          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg">
            <h2 className="text-red-400 text-xl font-semibold mb-2">Erro de Configuração</h2>
            <p className="text-red-300 text-sm">
              As variáveis de ambiente não estão configuradas corretamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['email', 'google', 'wallet', 'sms'],
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        supportedChains: [sepolia],
        defaultChain: sepolia,
      }}
    >
      {children}
    </PrivyProvider>
  );
} 