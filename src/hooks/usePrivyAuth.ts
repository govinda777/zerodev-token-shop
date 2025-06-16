"use client";

import { useState, useCallback } from 'react';
import { notifySuccess, notifyError, notifyInfo } from '@/utils/notificationService';

export interface UserInfo {
  id: string;
  email?: string;
  wallet?: string;
  createdAt?: number;
}

// Chain ID da rede padrão (Sepolia)
const DEFAULT_CHAIN_ID = 11155111;

export interface PrivyAuthState {
  isReady: boolean;
  isConnected: boolean;
  isAuthenticated: boolean;
  isConnecting: boolean;
  address: string | null;
  userId: string | null;
  userInfo: UserInfo | null;
  walletType: 'unknown' | 'privy' | 'external';
  connectorType: 'none' | 'privy' | 'injected' | 'walletconnect';
  hasWallet: boolean;
  isSmartWallet: boolean;
  isExternalWallet: boolean;
  loginMethods: string[];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  user: any;
}

// Check if Privy is available at module level
let PrivyHook: any = null;
try {
  const { usePrivy } = require('@privy-io/react-auth');
  PrivyHook = usePrivy;
} catch (error) {
  console.warn('Privy não disponível no módulo:', error);
}

export function usePrivyAuth(): PrivyAuthState {
  const [isConnecting, setIsConnecting] = useState(false);

  // Always call hooks consistently - either real Privy or null
  const privyData = PrivyHook ? PrivyHook() : null;

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      if (privyData?.login) {
        await privyData.login();
        notifySuccess('Conectado com sucesso!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        notifyInfo('Modo desenvolvimento - Privy não disponível');
      }
    } catch (error: any) {
      console.error('Erro ao conectar:', error);
      notifyError('Erro ao conectar. Tente novamente.');
    } finally {
      setIsConnecting(false);
    }
  }, [privyData?.login]);

  const disconnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      if (privyData?.logout) {
        await privyData.logout();
        notifyInfo('Desconectado com sucesso');
      } else {
        notifyInfo('Logout em modo desenvolvimento');
      }
    } catch (error: any) {
      console.error('Erro ao desconectar:', error);
      notifyError('Erro ao desconectar');
    } finally {
      setIsConnecting(false);
    }
  }, [privyData?.logout]);

  // Extract real data from Privy when available
  const isReady = privyData?.ready ?? true;
  const isAuthenticated = privyData?.authenticated ?? false;
  const user = privyData?.user ?? null;
  const isConnected = Boolean(isAuthenticated && user);
  const address = user?.wallet?.address || null;
  const userId = user?.id || null;
  
  const userInfo: UserInfo | null = user ? {
    id: user.id,
    email: user.email?.address,
    wallet: user.wallet?.address,
    createdAt: user.createdAt || Date.now(),
  } : null;

  const walletType: 'unknown' | 'privy' | 'external' = 
    user?.wallet?.walletClientType === 'privy' ? 'privy' : 
    user?.wallet ? 'external' : 'unknown';

  const connectorType: 'none' | 'privy' | 'injected' | 'walletconnect' = 
    user?.wallet?.connectorType || 'none';

  const hasWallet = Boolean(user?.wallet);
  const isSmartWallet = user?.wallet?.walletClientType === 'privy';
  const isExternalWallet = user?.wallet && user?.wallet?.walletClientType !== 'privy';

  return {
    isReady,
    isConnected,
    isAuthenticated,
    isConnecting,
    address,
    userId,
    userInfo,
    walletType,
    connectorType,
    hasWallet,
    isSmartWallet,
    isExternalWallet: Boolean(isExternalWallet),
    loginMethods: ['email', 'wallet', 'google'],
    connect,
    disconnect,
    user,
  };
}

// Original code commented out for deployment:
/*
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect, useCallback } from 'react';
import { notifySuccess, notifyError, notifyInfo } from '@/utils/notificationService';

export interface PrivyAuthState {
  isConnected: boolean;
  address: string | null;
  userId: string | null;
  walletType: 'unknown' | 'privy' | 'external';
  connectorType: 'none' | 'privy' | 'injected' | 'walletconnect';
  hasWallet: boolean;
  isSmartWallet: boolean;
  isExternalWallet: boolean;
  loginMethods: string[];
}

export function usePrivyAuth(): PrivyAuthState {
  // ... original implementation
}
*/ 