"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { TokenProvider } from "@/components/auth/TokenProvider";
import { ProductProvider } from "@/components/shop/ProductProvider";
import { InvestmentProvider } from "@/components/investment/InvestmentProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TokenProvider>
        <InvestmentProvider>
          <ProductProvider>
            {children}
          </ProductProvider>
        </InvestmentProvider>
      </TokenProvider>
    </AuthProvider>
  );
} 