"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { TokenProvider } from "@/components/auth/TokenProvider";
import { ProductProvider } from "@/components/shop/ProductProvider";
import { InvestmentProvider } from "@/components/investment/InvestmentProvider";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <AuthProvider>
          <TokenProvider>
            <InvestmentProvider>
              <ProductProvider>
                {children}
              </ProductProvider>
            </InvestmentProvider>
          </TokenProvider>
        </AuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
} 