"use client";

import { useState, useCallback, useEffect } from 'react';
import { 
  PaymasterType, 
  createKernelClientForUser,
  createKernelClientWithVerifyingPaymaster,
  createKernelClientWithERC20Paymaster,
  getPaymasterInfo
} from '@/utils/zerodev';

interface PaymasterState {
  selectedPaymaster: PaymasterType;
  isLoading: boolean;
  error: string | null;
  lastUsedPaymaster: PaymasterType | null;
}

export function usePaymaster(privateKey?: string) {
  const [state, setState] = useState<PaymasterState>({
    selectedPaymaster: 'default',
    isLoading: false,
    error: null,
    lastUsedPaymaster: null
  });

  // Load saved paymaster preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('preferred-paymaster');
    if (saved && ['default', 'verifying', 'erc20'].includes(saved)) {
      setState(prev => ({ ...prev, selectedPaymaster: saved as PaymasterType }));
    }
  }, []);

  // Save paymaster preference to localStorage
  const savePaymasterPreference = useCallback((type: PaymasterType) => {
    localStorage.setItem('preferred-paymaster', type);
  }, []);

  // Change paymaster type
  const changePaymaster = useCallback((type: PaymasterType) => {
    setState(prev => ({ ...prev, selectedPaymaster: type, error: null }));
    savePaymasterPreference(type);
  }, [savePaymasterPreference]);

  // Create kernel client with selected paymaster
  const createKernelClient = useCallback(async (userPrivateKey?: string) => {
    if (!userPrivateKey && !privateKey) {
      throw new Error('Private key is required');
    }

    const keyToUse = userPrivateKey || privateKey!;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      let client;
      
      switch (state.selectedPaymaster) {
        case 'verifying':
          client = await createKernelClientWithVerifyingPaymaster(keyToUse);
          break;
        case 'erc20':
          client = await createKernelClientWithERC20Paymaster(keyToUse);
          break;
        default:
          client = await createKernelClientForUser(keyToUse, 'default');
          break;
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        lastUsedPaymaster: state.selectedPaymaster 
      }));

      return client;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [privateKey, state.selectedPaymaster]);

  // Test paymaster connection
  const testPaymaster = useCallback(async (type: PaymasterType) => {
    if (!privateKey) {
      throw new Error('Private key is required for testing');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const client = await createKernelClientForUser(privateKey, type);
      const info = getPaymasterInfo(type);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return {
        success: true,
        message: `${info.name} conectado com sucesso!`,
        client
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      return {
        success: false,
        message: `Erro ao conectar ${getPaymasterInfo(type).name}: ${errorMessage}`,
        client: null
      };
    }
  }, [privateKey]);

  // Get current paymaster info
  const getCurrentPaymasterInfo = useCallback(() => {
    return getPaymasterInfo(state.selectedPaymaster);
  }, [state.selectedPaymaster]);

  // Check if paymaster has changed since last use
  const hasPaymasterChanged = useCallback(() => {
    return state.lastUsedPaymaster && state.lastUsedPaymaster !== state.selectedPaymaster;
  }, [state.lastUsedPaymaster, state.selectedPaymaster]);

  // Reset error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    selectedPaymaster: state.selectedPaymaster,
    isLoading: state.isLoading,
    error: state.error,
    lastUsedPaymaster: state.lastUsedPaymaster,
    
    // Actions
    changePaymaster,
    createKernelClient,
    testPaymaster,
    clearError,
    
    // Utilities
    getCurrentPaymasterInfo,
    hasPaymasterChanged,
    
    // Info
    paymasterInfo: getCurrentPaymasterInfo(),
    isPaymasterReady: !state.isLoading && !state.error
  };
} 