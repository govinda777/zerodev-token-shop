"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { getTokenBalance, addTokens, spendTokens } from "@/utils/storage";

export interface TokenContextType {
  balance: number;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => Promise<boolean>;
  isLoading: boolean;
}

export const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(0);
  const { isConnected, address } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && address) {
      setIsLoading(true);
      getTokenBalance(address).then((bal) => {
        setBalance(bal);
        setIsLoading(false);
      }).catch(() => {
        setBalance(0);
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
    setBalance(prev => prev + amount);
  };

  const handleSpendTokens = async (amount: number): Promise<boolean> => {
    if (!address) return false;
    try {
      const success = await spendTokens(address, amount);
      if (success) {
        setBalance(prev => prev - amount);
      }
      return success;
    } catch (error) {
      console.error("Error spending tokens:", error);
      return false;
    }
  };

  if (!mounted) {
    return null; // Return null instead of loading message to avoid nested loading
  }

  return (
    <TokenContext.Provider
      value={{
        balance,
        addTokens: handleAddTokens,
        spendTokens: handleSpendTokens,
        isLoading,
      }}
    >
      {children}
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