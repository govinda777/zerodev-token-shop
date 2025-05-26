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

export function usePrivyAuth() {
  // Verificar se estamos usando mock auth
  const mockContext = useContext(MockAuthContext);
  const isMockMode = !!mockContext;

  // Se estiver em modo mock, usar mock auth
  if (isMockMode) {
    const mockAuth = useMockAuth();
    return {
      // Estados
      isReady: true,
      isAuthenticated: mockAuth.isConnected,
      isConnecting: mockAuth.isConnecting,
      isConnected: mockAuth.isConnected,
      
      // Dados
      user: mockAuth.isConnected ? { 
        id: 'mock-user', 
        wallet: { address: mockAuth.address } 
      } : null,
      address: mockAuth.address,
      userInfo: mockAuth.isConnected ? {
        id: 'mock-user',
        wallet: mockAuth.address,
        createdAt: Date.now()
      } : null,
      
      // Verificações
      hasWallet: !!mockAuth.address,
      
      // Ações
      connect: mockAuth.connect,
      disconnect: mockAuth.disconnect,
      connectWallet: mockAuth.connect,
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
  } = usePrivy();

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