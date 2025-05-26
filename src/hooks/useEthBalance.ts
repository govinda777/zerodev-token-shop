"use client";

import { useState, useEffect } from 'react';
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

  const fetchBalance = async () => {
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
      console.error('Erro ao obter saldo ETH:', err);
      setError('Erro ao obter saldo');
      setEthBalance('0');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address, isConnected]);

  return {
    ethBalance,
    isLoading,
    error,
    refetch: fetchBalance
  };
} 