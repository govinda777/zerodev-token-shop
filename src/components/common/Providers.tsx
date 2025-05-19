"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { TokenProvider } from "@/components/auth/TokenProvider";
import { ProductProvider } from "@/components/shop/ProductProvider";
import { WagmiConfig, createConfig } from "wagmi";
import { mainnet } from "viem/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
  ],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <AuthProvider>
          <TokenProvider>
            <ProductProvider>
              {children}
            </ProductProvider>
          </TokenProvider>
        </AuthProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
} 