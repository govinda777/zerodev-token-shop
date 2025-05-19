"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { getTokenBalance, addTokens, spendTokens } from "@/utils/storage";

interface TokenContextType {
  balance: number;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => void;
  isLoading: boolean;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);
export { TokenContext };

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const { isConnected, address } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && address) {
      setIsLoading(true);
      getTokenBalance(address).then((bal) => {
        setBalance(bal);
        setIsLoading(false);
      });
    } else if (mounted) {
      setBalance(0);
      setIsLoading(false);
    }
  }, [isConnected, address, mounted]);

  const handleAddTokens = (amount: number) => {
    if (!address) return;
    addTokens(address, amount);
    setBalance(prev => (prev ?? 0) + amount);
  };

  const handleSpendTokens = (amount: number) => {
    if (!address) return;
    spendTokens(address, amount);
    setBalance(prev => (prev ?? 0) - amount);
  };

  return (
    <TokenContext.Provider
      value={{
        balance: balance ?? 0,
        addTokens: handleAddTokens,
        spendTokens: handleSpendTokens,
        isLoading,
      }}
    >
      {!mounted || balance === undefined ? <div>Carregando...</div> : children}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
} 