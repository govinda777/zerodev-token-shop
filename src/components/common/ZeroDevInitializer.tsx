"use client";

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useZeroDevTransaction } from './ZeroDevTransactionProvider';

export const ZeroDevInitializer = () => {
  const { authenticated, user } = usePrivy();
  const { initializeAccount, accountAddress, isLoading } = useZeroDevTransaction();

  useEffect(() => {
    if (authenticated && user && !accountAddress && !isLoading) {
      initializeAccount();
    }
  }, [authenticated, user, accountAddress, isLoading, initializeAccount]);

  if (!authenticated) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {isLoading && (
        <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
            <span className="text-sm text-purple-700">Inicializando conta ZeroDev...</span>
          </div>
        </div>
      )}
      
      {accountAddress && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700">
              ZeroDev ativo: {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 