"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { createKernelClientForUser, generateNewPrivateKey } from '@/utils/zerodev';

interface ZeroDevTransactionContextType {
  executeTransaction: (to: string, value: bigint, data?: string) => Promise<string>;
  isLoading: boolean;
  kernelClient: any;
  accountAddress: string | null;
  initializeAccount: () => Promise<void>;
}

const ZeroDevTransactionContext = createContext<ZeroDevTransactionContextType | null>(null);

const ZeroDevTransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authenticated } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);
  const [kernelClient, setKernelClient] = useState<any>(null);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);

  const initializeAccount = useCallback(async () => {
    if (!authenticated || !user) {
      console.log('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      
      // Generate or retrieve private key for the user
      // In a real app, you'd store this securely associated with the user
      const privateKey = generateNewPrivateKey();
      
      // Create kernel client
      const { kernelClient: client, accountAddress: address } = await createKernelClientForUser(privateKey);
      
      setKernelClient(client);
      setAccountAddress(address);
      
      console.log('ZeroDev account initialized:', address);
    } catch (error) {
      console.error('Failed to initialize ZeroDev account:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, user]);

  const executeTransaction = useCallback(async (to: string, value: bigint, data?: string) => {
    if (!kernelClient) {
      throw new Error('Kernel client not initialized. Call initializeAccount first.');
    }

    try {
      setIsLoading(true);
      
      const txHash = await kernelClient.sendTransaction({
        to: to as `0x${string}`,
        value,
        data: data as `0x${string}`,
      });

      console.log('Transaction sent:', txHash);
      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [kernelClient]);

  const value = {
    executeTransaction,
    isLoading,
    kernelClient,
    accountAddress,
    initializeAccount,
  };

  return (
    <ZeroDevTransactionContext.Provider value={value}>
      {children}
    </ZeroDevTransactionContext.Provider>
  );
};

export function useZeroDevTransaction() {
  const context = useContext(ZeroDevTransactionContext);
  if (!context) {
    throw new Error('useZeroDevTransaction must be used within ZeroDevTransactionProvider');
  }
  return context;
}

// Export both default and named export for compatibility
export default ZeroDevTransactionProvider;
export { ZeroDevTransactionProvider }; 