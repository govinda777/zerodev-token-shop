"use client";

import React from 'react';
// Temporarily disabled for deployment
// import { PrivyProvider } from '@privy-io/react-auth';
// import { WagmiProvider } from '@privy-io/wagmi';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { http } from 'viem';
// import { sepolia } from 'viem/chains';
// import { createConfig } from '@privy-io/wagmi';

// Temporarily simplified for deployment
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div style={{ 
        padding: '1rem', 
        background: '#f0f0f0', 
        borderRadius: '8px', 
        margin: '1rem 0',
        textAlign: 'center'
      }}>
        <p>🚧 Authentication temporarily disabled for deployment</p>
        <p>Full Web3 functionality will be restored after resolving dependency conflicts</p>
      </div>
      {children}
    </div>
  );
};

// Export both default and named export for compatibility
export default AuthProvider;
export { AuthProvider };

// Original code commented out for deployment:
/*
const queryClient = new QueryClient();

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url.com/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default AuthProvider;
*/ 