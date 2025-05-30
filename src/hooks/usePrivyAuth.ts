"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useMockAuth } from '@/components/auth/MockAuthProvider';
import { useContext } from 'react';
import { MockAuthContext } from '@/components/auth/MockAuthProvider';

export interface UserInfo {
  id: string;
  email?: string;
  wallet?: string;
  createdAt?: number;
}

// ATENÇÃO: useMockAuth e usePrivy são chamados no topo para evitar hooks condicionalmente.
export function usePrivyAuth() {
  const mockContext = useContext(MockAuthContext);
  const privy = usePrivy();

  // Verificar se estamos usando mock auth
  const isMockMode = !!mockContext;

  // Se estiver em modo mock, usar mockContext diretamente
  if (isMockMode && mockContext) {
    return {
      // Estados
      isReady: true,
      isAuthenticated: mockContext.isConnected,
      isConnecting: mockContext.isConnecting,
      isConnected: mockContext.isConnected,
      // Dados
      user: mockContext.isConnected ? { 
        id: 'mock-user', 
        wallet: { address: mockContext.address } 
      } : null,
      address: mockContext.address,
      userInfo: mockContext.isConnected ? {
        id: 'mock-user',
        wallet: mockContext.address,
        createdAt: Date.now()
      } : null,
      // Verificações
      hasWallet: !!mockContext.address,
      // Ações
      connect: mockContext.connect,
      disconnect: mockContext.disconnect,
      connectWallet: mockContext.connect,
      linkWallet: async () => {}
    };
  }

  // Usar Privy normalmente
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    connectWallet,
    linkWallet
  } = privy;

  // Estados derivados
  const isReady = ready;
  const isAuthenticated = authenticated;
  const isConnecting = !ready;
  const isConnected = authenticated;

  // Dados do usuário
  const address = user?.wallet?.address;
  
  const userInfo: UserInfo | null = user ? {
    id: user.id,
    email: user.email?.address,
    wallet: user.wallet?.address,
    createdAt: user.createdAt ? new Date(user.createdAt).getTime() : Date.now()
  } : null;

  // Verificações
  const hasWallet = !!user?.wallet?.address;

  // Ações
  const connect = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Erro ao conectar:', error);
      throw error;
    }
  };

  const disconnect = () => {
    logout();
  };

  return {
    // Estados
    isReady,
    isAuthenticated,
    isConnecting,
    isConnected,
    
    // Dados
    user,
    address,
    userInfo,
    
    // Verificações
    hasWallet,
    
    // Ações
    connect,
    disconnect,
    connectWallet,
    linkWallet
  };
} 