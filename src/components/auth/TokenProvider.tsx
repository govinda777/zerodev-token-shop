"use client";

import { createContext, useEffect, useState, useContext } from 'react';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import JourneyLogger from '@/utils/journeyLogger';

export interface TokenContextType {
  balance: number;
  addTokens: (amount: number) => void;
  removeTokens: (amount: number) => void;
  isLoading: boolean;
  isFirstLogin: boolean;
  welcomeReward: number | null;
  showWelcomeNotification: boolean;
  dismissWelcomeNotification: () => void;
}

export const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const { isConnected, address } = usePrivyAuth();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [welcomeReward, setWelcomeReward] = useState<number | null>(null);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && address) {
      setIsLoading(true);
      
      // Check if first login and grant initial tokens
      const hasInitialGrant = localStorage.getItem(`initial_grant_${address}`);
      if (!hasInitialGrant) {
        const welcomeRewardAmount = 10;
        setBalance(welcomeRewardAmount);
        setIsFirstLogin(true);
        setWelcomeReward(welcomeRewardAmount);
        setShowWelcomeNotification(true);
        
        localStorage.setItem(`initial_grant_${address}`, 'true');
        localStorage.setItem(address, welcomeRewardAmount.toString());
        
        // Log first login with reward
        JourneyLogger.logFirstLogin(address, welcomeRewardAmount);
        JourneyLogger.logTokenReward(address, welcomeRewardAmount, 'welcome_bonus');
        
        console.log(`🎉 Welcome bonus of ${welcomeRewardAmount} tokens granted to ${address}`);
        
        // Auto-dismiss notification after 10 seconds
        setTimeout(() => {
          setShowWelcomeNotification(false);
        }, 10000);
      } else {
        // Fetch current balance from storage
        const currentBalance = parseInt(localStorage.getItem(address) || "0");
        setBalance(currentBalance);
        setIsFirstLogin(false);
        setWelcomeReward(null);
      }
      
      setIsLoading(false);
    } else if (mounted) {
      setBalance(0);
      setIsFirstLogin(false);
      setWelcomeReward(null);
      setShowWelcomeNotification(false);
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
    console.log('🔍 TokenProvider.removeTokens chamado:', { amount, address, currentBalance: balance });
    
    if (!address) {
      console.error('❌ Endereço não disponível para remoção de tokens');
      return;
    }
    
    const currentBalance = parseInt(localStorage.getItem(address) || "0");
    console.log('🔍 Saldo atual no localStorage:', currentBalance);
    
    if (currentBalance >= amount) {
      const newBalance = currentBalance - amount;
      localStorage.setItem(address, newBalance.toString());
      setBalance(newBalance);
      console.log('✅ Tokens removidos com sucesso:', { oldBalance: currentBalance, newBalance, amount });
    } else {
      console.error('❌ Saldo insuficiente para remoção:', { currentBalance, amount });
    }
  };

  const dismissWelcomeNotification = () => {
    setShowWelcomeNotification(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <TokenContext.Provider value={{ 
      balance, 
      addTokens, 
      removeTokens, 
      isLoading,
      isFirstLogin,
      welcomeReward,
      showWelcomeNotification,
      dismissWelcomeNotification
    }}>
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