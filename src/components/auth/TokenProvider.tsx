"use client";

import { createContext, useEffect, useState, useContext, useCallback } from 'react';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import JourneyLogger from '@/utils/journeyLogger';
import * as Storage from '@/utils/storage'; // Import all storage functions

export interface TokenContextType {
  balance: number;
  addTokens: (amount: number) => Promise<void>; // Now async
  removeTokens: (amount: number) => Promise<boolean>; // Now async, returns success
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
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [welcomeReward, setWelcomeReward] = useState<number | null>(null);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadData = useCallback(async () => {
    if (mounted && isConnected && address) {
      setIsLoading(true);
      
      const hasBeenGrantedWelcome = Storage.hasReceivedWelcomeReward(address); // This is sync

      if (!hasBeenGrantedWelcome) {
        const welcomeRewardAmount = 10; // Define welcome reward amount
        await Storage.addTokens(address, welcomeRewardAmount); // Grant initial tokens
        Storage.markWelcomeRewardReceived(address); // Mark as received

        setBalance(welcomeRewardAmount);
        setIsFirstLogin(true);
        setWelcomeReward(welcomeRewardAmount);
        setShowWelcomeNotification(true);
        
        JourneyLogger.logFirstLogin(address, welcomeRewardAmount);
        JourneyLogger.logTokenReward(address, welcomeRewardAmount, 'welcome_bonus');
        
        // console.log(`🎉 Welcome bonus of ${welcomeRewardAmount} tokens granted to ${address}`); // To be removed
        
        setTimeout(() => {
          setShowWelcomeNotification(false);
        }, 10000);
      } else {
        const currentBalance = await Storage.getTokenBalance(address);
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

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addTokensProvider = useCallback(async (amount: number) => {
    if (!address) return;
    setIsLoading(true);
    await Storage.addTokens(address, amount);
    const newBalance = await Storage.getTokenBalance(address);
    setBalance(newBalance);
    JourneyLogger.logTokenReward(address, amount, 'manual_addition');
    setIsLoading(false);
  }, [address]);

  const removeTokensProvider = useCallback(async (amount: number): Promise<boolean> => {
    if (!address) {
      // console.error('❌ Endereço não disponível para remoção de tokens'); // To be removed
      return false;
    }
    setIsLoading(true);
    const success = await Storage.spendTokens(address, amount);
    if (success) {
      const newBalance = await Storage.getTokenBalance(address);
      setBalance(newBalance);
      // console.log('✅ Tokens removidos com sucesso:', { oldBalance: balance, newBalance, amount }); // To be removed
    } else {
      // console.error('❌ Saldo insuficiente para remoção:', { currentBalance: balance, amount }); // To be removed
    }
    setIsLoading(false);
    return success;
  }, [address, balance]); // Added balance to dep array for oldBalance logging, though it's removed now

  const dismissWelcomeNotification = () => {
    setShowWelcomeNotification(false);
  };

  if (!mounted) {
    // Avoid rendering until client-side mount to prevent hydration issues with localStorage
    return null;
  }

  return (
    <TokenContext.Provider value={{ 
      balance, 
      addTokens: addTokensProvider,
      removeTokens: removeTokensProvider,
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