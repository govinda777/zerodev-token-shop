"use client";

import { useEffect, useState } from 'react';
import { usePrivyAuth } from './usePrivyAuth';
import { notifyError, notifySuccess, notifyInfo } from '@/utils/notificationService';

// Chain IDs
const SEPOLIA_CHAIN_ID = 11155111;

export interface NetworkValidation {
  isCorrectNetwork: boolean;
  currentChainId: number | null;
  isLoading: boolean;
  switchToSepolia: () => Promise<void>;
  error: string | null;
}

// Função para detectar provedor Web3 disponível
const detectWeb3Provider = () => {
  if (typeof window === 'undefined') return null;
  
  // Verificar window.ethereum (MetaMask, outros)
  if (window.ethereum) {
    return window.ethereum;
  }
  
  // Verificar web3 (deprecated but still used)
  if ((window as any).web3?.currentProvider) {
    return (window as any).web3.currentProvider;
  }
  
  return null;
};

export function useNetworkValidation(): NetworkValidation {
  const { isConnected, isSmartWallet, isExternalWallet, user } = usePrivyAuth();
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar a rede atual
  useEffect(() => {
    const checkNetwork = async () => {
      if (!isConnected) {
        setCurrentChainId(null);
        return;
      }

      // Para smart wallets, assumir Sepolia por padrão
      if (isSmartWallet) {
        console.log('🔧 Smart wallet detectada, assumindo Sepolia');
        setCurrentChainId(SEPOLIA_CHAIN_ID);
        return;
      }

      const provider = detectWeb3Provider();
      if (!provider) {
        console.log('🔧 Nenhum provider Web3 detectado');
        setCurrentChainId(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Obter o chain ID atual - tentar múltiplos métodos
        let chainId;
        try {
          // Método padrão
          chainId = await provider.request({ method: 'eth_chainId' });
        } catch (err) {
          // Método alternativo
          try {
            chainId = await provider.request({ method: 'net_version' });
            // net_version retorna decimal, precisa converter
            chainId = '0x' + parseInt(chainId, 10).toString(16);
          } catch (err2) {
            console.error('Erro ao obter chain ID:', err, err2);
            throw new Error('Não foi possível obter a rede atual');
          }
        }
        
        const numericChainId = parseInt(chainId, 16);
        setCurrentChainId(numericChainId);
        console.log('🔗 Rede atual detectada:', numericChainId, numericChainId === SEPOLIA_CHAIN_ID ? '(Sepolia)' : '(Outra rede)');
      } catch (err) {
        console.error('Erro ao verificar rede:', err);
        setError('Erro ao verificar rede');
      } finally {
        setIsLoading(false);
      }
    };

    checkNetwork();

    // Escutar mudanças de rede apenas para carteiras externas
    if (isExternalWallet) {
      const provider = detectWeb3Provider();
      if (provider) {
        const handleChainChanged = (chainId: string) => {
          const numericChainId = parseInt(chainId, 16);
          const previousChainId = currentChainId;
          setCurrentChainId(numericChainId);
          setError(null);
          
          console.log('🔗 Rede alterada para:', numericChainId, numericChainId === SEPOLIA_CHAIN_ID ? '(Sepolia)' : '(Outra rede)');
          
          // Mostrar notificação apenas se houve uma mudança real
          if (previousChainId !== null && previousChainId !== numericChainId) {
            if (numericChainId === SEPOLIA_CHAIN_ID) {
              notifySuccess('✅ Conectado à rede Sepolia com sucesso!');
            } else {
              notifyInfo(`🔗 Rede alterada para ${getNetworkName(numericChainId)}`);
            }
          }
        };

        provider.on('chainChanged', handleChainChanged);

        return () => {
          provider.removeListener('chainChanged', handleChainChanged);
        };
      }
    }
  }, [isConnected, currentChainId, isSmartWallet, isExternalWallet]);

  // Função para trocar para Sepolia
  const switchToSepolia = async () => {
    // Se for smart wallet, orientar sobre logout/login
    if (isSmartWallet) {
      const msg = 'Para carteiras embarcadas, faça logout e login novamente para garantir a configuração correta da rede Sepolia.';
      notifyInfo(msg);
      return;
    }

    const provider = detectWeb3Provider();
    
    if (!provider) {
      const errorMsg = 'Nenhuma carteira Web3 detectada. Instale MetaMask ou conecte uma carteira compatível.';
      setError(errorMsg);
      notifyError(errorMsg);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Tentando trocar para Sepolia...');
      notifyInfo('🔄 Alterando para rede Sepolia...');

      // Tentar trocar para Sepolia
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }], // 0xaa36a7
      });

      console.log('✅ Troca para Sepolia realizada com sucesso');
      notifySuccess('✅ Conectado à rede Sepolia com sucesso!');
    } catch (switchError: unknown) {
      console.error('Erro ao trocar para Sepolia:', switchError);
      
      // Se a rede não estiver adicionada, tentar adicionar
      if (switchError instanceof Error && (
        switchError.message.includes('4902') || 
        switchError.message.includes('Unrecognized chain ID') ||
        switchError.message.includes('Unrecognized chain')
      )) {
        try {
          console.log('📡 Tentando adicionar rede Sepolia...');
          notifyInfo('📡 Adicionando rede Sepolia à sua carteira...');
          
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
          
          console.log('✅ Rede Sepolia adicionada com sucesso');
          notifySuccess('✅ Rede Sepolia adicionada e conectada!');
        } catch (addError) {
          console.error('Erro ao adicionar rede Sepolia:', addError);
          setError(`Falha ao adicionar rede Sepolia`);
          notifyError(`Não foi possível adicionar a rede Sepolia. Adicione manualmente nas configurações da sua carteira: Chain ID 11155111`);
        }
      } else if (switchError instanceof Error && switchError.message.includes('4001')) {
        // Usuário rejeitou
        notifyInfo('Operação cancelada pelo usuário');
      } else {
        setError(`Falha ao trocar de rede`);
        notifyError(`Não foi possível trocar para Sepolia. Verifique sua carteira e tente novamente.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isCorrectNetwork = currentChainId === SEPOLIA_CHAIN_ID;

  return {
    isCorrectNetwork,
    currentChainId,
    isLoading,
    switchToSepolia,
    error,
  };
}

// Função utilitária para obter o nome da rede
export function getNetworkName(chainId: number | null): string {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 11155111:
      return 'Sepolia Testnet';
    case 137:
      return 'Polygon';
    case 56:
      return 'BSC';
    case 42161:
      return 'Arbitrum';
    case 10:
      return 'Optimism';
    default:
      return chainId ? `Rede ${chainId}` : 'Rede desconhecida';
  }
} 