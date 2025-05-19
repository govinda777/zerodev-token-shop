"use client";

import { AuthProvider } from "@/utils/auth-context";
import { PrivyProvider } from "@privy-io/react-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  console.log("Privy App ID:", process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#3B82F6',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </PrivyProvider>
  );
} 