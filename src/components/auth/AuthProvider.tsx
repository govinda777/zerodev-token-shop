"use client";

import React from 'react';
import { ZeroDevTransactionProvider } from '@/components/common/ZeroDevTransactionProvider';
import { ZeroDevInitializer } from '@/components/common/ZeroDevInitializer';

// Simplified provider that just uses basic Privy without wagmi
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  try {
    // Only import what we absolutely need
    const { PrivyProvider } = require('@privy-io/react-auth');

    return (
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        config={{
          loginMethods: ['email', 'wallet', 'google'],
          appearance: {
            theme: 'dark',
            accentColor: '#676FFF',
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        <ZeroDevTransactionProvider>
          <ZeroDevInitializer />
          {children}
        </ZeroDevTransactionProvider>
      </PrivyProvider>
    );
  } catch (error) {
    console.error('Failed to initialize Privy:', error);
    
    // Fallback UI when Privy fails
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg mb-2">Inicializando autenticação...</p>
            <p className="text-gray-400 text-sm">Modo fallback ativo</p>
          </div>
        </div>
        {children}
      </div>
    );
  }
};

// Export both default and named export for compatibility
export default AuthProvider;
export { AuthProvider }; 