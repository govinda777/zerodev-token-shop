"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
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

export function usePrivyAuth() {
  const {
    authenticated,
    user,
    login,
    logout,
    connectWallet,
    linkWallet
  } = usePrivy();

  // Estados derivados - removendo dependência do ready
  const isReady = true; // Sempre pronto
  const isAuthenticated = authenticated;
  const isConnecting = false; // Simplificado
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

  // Função para verificar se é um smart wallet (melhorada)
  const isSmartWallet = !!(
    user?.wallet?.walletClientType === 'privy' ||
    (user?.wallet?.address && !user?.wallet?.connectorType) ||
    (user?.linkedAccounts?.some(acc => ['email', 'google', 'apple', 'sms'].includes(acc.type)) && user?.wallet?.address)
  );

  // Função para detectar se é carteira externa
  const isExternalWallet = !!(
    user?.wallet?.connectorType &&
    ['metamask', 'walletConnect', 'coinbaseWallet', 'injected'].includes(user.wallet.connectorType)
  );

  // Função para mudar automaticamente para a rede padrão
  const switchToDefaultNetwork = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.log('🔧 Ethereum provider não disponível');
      return;
    }

    try {
      console.log('🔄 Verificando rede atual...');
      
      const currentChainId = await (window.ethereum as any).request({ 
        method: 'eth_chainId' 
      });
      
      const numericChainId = parseInt(currentChainId, 16);
      console.log('🔗 Rede atual:', numericChainId);
      
      if (numericChainId === DEFAULT_CHAIN_ID) {
        console.log('✅ Já está na rede Sepolia');
        notifySuccess('✅ Já conectado à rede Sepolia!');
        return;
      }

      console.log('🔄 Mudando para rede Sepolia...');
      notifyInfo('🔄 Alterando automaticamente para rede Sepolia...');
      
      await (window.ethereum as any).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${DEFAULT_CHAIN_ID.toString(16)}` }],
      });

      console.log('✅ Mudança para Sepolia realizada com sucesso');
      notifySuccess('✅ Conectado à rede Sepolia com sucesso!');
    } catch (switchError: unknown) {
      console.log('⚠️ Tentativa de mudança automática falhou:', switchError);
      
      if (switchError instanceof Error && (
        switchError.message.includes('4902') || 
        switchError.message.includes('Unrecognized chain ID')
      )) {
        try {
          console.log('📡 Adicionando rede Sepolia...');
          notifyInfo('📡 Adicionando rede Sepolia à sua carteira...');
          
          await (window.ethereum as any).request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${DEFAULT_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: [NETWORK_CONFIG.rpcUrl],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
          
          console.log('✅ Rede Sepolia adicionada com sucesso');
          notifySuccess('✅ Rede Sepolia adicionada e conectada!');
        } catch (addError) {
          console.log('❌ Falha ao adicionar rede:', addError);
          notifyInfo('⚠️ Não foi possível trocar automaticamente. Use o botão "Trocar para Sepolia" se necessário.');
        }
      } else if (switchError instanceof Error && switchError.message.includes('4001')) {
        // Usuário rejeitou
        notifyInfo('⚠️ Troca de rede cancelada. Use o indicador no canto superior direito se precisar trocar manualmente.');
      } else {
        notifyInfo('⚠️ Não foi possível trocar automaticamente. Use o botão no canto superior direito se necessário.');
      }
    }
  };

  // Effect para detectar login e forçar troca de rede
  useEffect(() => {
    if (authenticated && user) {
      console.log('🔧 LOGIN DETECTADO:', {
        userId: user.id,
        walletType: user?.wallet?.walletClientType || 'unknown',
        connectorType: user?.wallet?.connectorType || 'none',
        hasWallet: hasWallet,
        isSmartWallet: isSmartWallet,
        isExternalWallet: isExternalWallet,
        loginMethods: user?.linkedAccounts?.map(acc => acc.type) || []
      });

      // Mostrar mensagem de boas-vindas primeiro
      if (isSmartWallet) {
        notifySuccess('✅ Login realizado! Smart wallet configurada automaticamente para Sepolia.');
      } else if (isExternalWallet) {
        notifyInfo('🔄 Login realizado! Verificando/configurando rede Sepolia...');
      }

      // SEMPRE tentar mudar para Sepolia após login, independente do tipo de wallet
      // Aguardar 2 segundos para garantir estabilidade da conexão
      const timer = setTimeout(() => {
        console.log('🚀 Iniciando processo de troca para Sepolia...');
        if (isExternalWallet) {
          switchToDefaultNetwork();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [authenticated, user]);

  // Ações
  const connect = async () => {
    try {
      await login();
    } catch (error) {
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
    isSmartWallet,
    isExternalWallet,
    
    // Ações
    connect,
    disconnect,
    connectWallet,
    linkWallet
  };
} 