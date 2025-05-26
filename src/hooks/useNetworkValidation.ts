"use client";

import { useEffect, useState } from 'react';
import { usePrivyAuth } from './usePrivyAuth';

// Chain IDs
const SEPOLIA_CHAIN_ID = 11155111;

export interface NetworkValidation {
  isCorrectNetwork: boolean;
  currentChainId: number | null;
  isLoading: boolean;
  switchToSepolia: () => Promise<void>;
  error: string | null;
}

export function useNetworkValidation(): NetworkValidation {
  const { isConnected, user } = usePrivyAuth();
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar a rede atual
  useEffect(() => {
    const checkNetwork = async () => {
      if (!isConnected || !window.ethereum) {
        setCurrentChainId(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Obter o chain ID atual
        const chainId = await window.ethereum.request({ 
          method: 'eth_chainId' 
        });
        
        const numericChainId = parseInt(chainId, 16);
        setCurrentChainId(numericChainId);
      } catch (err) {
        console.error('Erro ao verificar rede:', err);
        setError('Erro ao verificar rede');
      } finally {
        setIsLoading(false);
      }
    };

    checkNetwork();

    // Escutar mudanças de rede
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        const numericChainId = parseInt(chainId, 16);
        setCurrentChainId(numericChainId);
        setError(null);
      };

      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [isConnected]);

  // Função para trocar para Sepolia
  const switchToSepolia = async () => {
    if (!window.ethereum) {
      setError('MetaMask não encontrado');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Tentar trocar para Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Se a rede não estiver adicionada, tentar adicionar
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
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
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Erro ao adicionar rede Sepolia:', addError);
          setError('Erro ao adicionar rede Sepolia');
        }
      } else {
        console.error('Erro ao trocar para Sepolia:', switchError);
        setError('Erro ao trocar para rede Sepolia');
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
    default:
      return chainId ? `Rede ${chainId}` : 'Rede desconhecida';
  }
} 