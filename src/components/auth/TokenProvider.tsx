"use client";

import { createContext, useEffect, useState, useContext } from 'react';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import JourneyLogger from '@/utils/journeyLogger';

export interface TokenContextType {
  balance: number;
  addTokens: (amount: number) => void;
  removeTokens: (amount: number) => void;
  isLoading: boolean;
}

export const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const { isConnected, address } = usePrivyAuth();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && address) {
      setIsLoading(true);
      
      // Check if first login and grant initial tokens
      const hasInitialGrant = localStorage.getItem(`initial_grant_${address}`);
      if (!hasInitialGrant) {
        const welcomeReward = 10;
        setBalance(welcomeReward);
        localStorage.setItem(`initial_grant_${address}`, 'true');
        localStorage.setItem(address, welcomeReward.toString());
        
        // Log first login with reward
        JourneyLogger.logFirstLogin(address, welcomeReward);
        JourneyLogger.logTokenReward(address, welcomeReward, 'welcome_bonus');
        
        console.log(`🎉 Welcome bonus of ${welcomeReward} tokens granted to ${address}`);
      } else {
        // Fetch current balance from storage
        const currentBalance = parseInt(localStorage.getItem(address) || "0");
        setBalance(currentBalance);
      }
      
      setIsLoading(false);
    } else if (mounted) {
      setBalance(0);
      setIsLoading(false);
    }
  }, [isConnected, address, mounted]);

  const addTokens = (amount: number) => {
    if (!address) return;
    
    const currentBalance = parseInt(localStorage.getItem(address) || "0");
    const newBalance = currentBalance + amount;
    localStorage.setItem(address, newBalance.toString());
    setBalance(newBalance);
    
    // Log token addition
    JourneyLogger.logTokenReward(address, amount, 'manual_addition');
  };

  const removeTokens = (amount: number) => {
    if (!address) return;
    
    const currentBalance = parseInt(localStorage.getItem(address) || "0");
    if (currentBalance >= amount) {
      const newBalance = currentBalance - amount;
      localStorage.setItem(address, newBalance.toString());
      setBalance(newBalance);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <TokenContext.Provider value={{ balance, addTokens, removeTokens, isLoading }}>
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