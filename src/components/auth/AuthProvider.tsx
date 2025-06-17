"use client";

import React from 'react';
import { ZeroDevTransactionProvider } from '@/components/common/ZeroDevTransactionProvider';
import { ZeroDevInitializer } from '@/components/common/ZeroDevInitializer';

// Simplified provider that just uses basic Privy without wagmi
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  // Check if we have a valid Privy App ID (not empty, not a build placeholder)
  const isValidPrivyAppId = privyAppId && 
    privyAppId.length > 0 && 
    !privyAppId.includes('placeholder') && 
    !privyAppId.includes('build') &&
    privyAppId !== 'clxxx-build-placeholder';

  // If we don't have a valid Privy App ID, show fallback
  if (!isValidPrivyAppId) {
    console.warn('Privy App ID not configured or is a build placeholder. Using fallback mode.');
    
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg mb-2">Configuração de autenticação necessária</p>
            <p className="text-gray-400 text-sm">Configure NEXT_PUBLIC_PRIVY_APP_ID</p>
          </div>
        </div>
        {children}
      </div>
    );
  }

  try {
    // Only import what we absolutely need
    const { PrivyProvider } = require('@privy-io/react-auth');

    return (
      <PrivyProvider
        appId={privyAppId}
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
            <p className="text-white text-lg mb-2">Erro na inicialização da autenticação</p>
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