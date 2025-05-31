"use client";

import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, http, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { usePrivyAuth } from './usePrivyAuth';

export function useEthBalance() {
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = usePrivyAuth();

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  });

  const fetchBalance = useCallback(async () => {
    if (!address || !isConnected) {
      setEthBalance('0');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const balance = await publicClient.getBalance({
        address: address as `0x${string}`
      });
      
      const formattedBalance = formatEther(balance);
      setEthBalance(formattedBalance);
    } catch (err) {
      // console.error('Erro ao obter saldo ETH:', err); // Potentially notifyError or handle in UI
      setError('Erro ao obter saldo');
      setEthBalance('0');
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, publicClient]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    ethBalance,
    isLoading,
    error,
    refetch: fetchBalance
  };
} 