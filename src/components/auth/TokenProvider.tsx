"use client";

import { createContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export interface TokenContextType {
  balance: number;
  addTokens: (amount: number) => void;
  removeTokens: (amount: number) => void;
}

export const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const { isConnected, address } = useAuth();
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
        setBalance(10);
        localStorage.setItem(`initial_grant_${address}`, 'true');
      }

      // Fetch current balance from storage
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

  const addTokens = (amount: number) => {
    if (!address) return;
    addTokensToStorage(address, amount); // Persist to storage
    setBalance(prev => prev + amount);
  };

  const removeTokens = (amount: number) => {
    if (!address) return;
    spendTokensFromStorage(address, amount).then(success => {
      if (success) {
        setBalance(prev => Math.max(0, prev - amount));
      }
    });
  };

  // Mock functions for storage interaction
  const addTokensToStorage = (address: string, amount: number) => {
    let currentBalance = parseInt(localStorage.getItem(address) || "0");
    localStorage.setItem(address, (currentBalance + amount).toString());
  }

  const spendTokensFromStorage = async (address: string, amount: number): Promise<boolean> => {
    let currentBalance = parseInt(localStorage.getItem(address) || "0");
    if (currentBalance >= amount) {
      localStorage.setItem(address, (currentBalance - amount).toString());
      return true;
    }
    return false;
  }

  if (!mounted) {
    return null; // Return null instead of loading message to avoid nested loading
  }

  return (
    <TokenContext.Provider value={{ balance, addTokens, removeTokens }}>
      {children}
    </TokenContext.Provider>
  );
}

import { useContext } from "react";

function getTokenBalance(address: string): Promise<number> {
  return new Promise((resolve) => {
    const balance = parseInt(localStorage.getItem(address) || "0");
    resolve(balance);
  });
}

function addTokens(address: string, amount: number) {
  let currentBalance = parseInt(localStorage.getItem(address) || "0");
  localStorage.setItem(address, (currentBalance + amount).toString());
}

async function spendTokens(address: string, amount: number): Promise<boolean> {
  let currentBalance = parseInt(localStorage.getItem(address) || "0");
  if (currentBalance >= amount) {
    localStorage.setItem(address, (currentBalance - amount).toString());
    return true;
  }
  return false;
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
}