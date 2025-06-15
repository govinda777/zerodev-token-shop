"use client";

import { useState, useEffect } from 'react';
import { NETWORK_CONFIG } from '@/contracts/config';
import { notifyInfo, notifySuccess } from '@/utils/notificationService';

export interface UserInfo {
  id: string;
  email?: string;
  wallet?: string;
  createdAt?: number;
}

// Chain ID da rede padrão (Sepolia)
const DEFAULT_CHAIN_ID = 11155111;

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
  const [authState] = useState<PrivyAuthState>({
    isConnected: false,
    address: null,
    userId: null,
    walletType: 'unknown',
    connectorType: 'none',
    hasWallet: false,
    isSmartWallet: false,
    isExternalWallet: false,
    loginMethods: [],
  });

  useEffect(() => {
    console.log('🚧 Authentication temporarily disabled for deployment');
  }, []);

  return authState;
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