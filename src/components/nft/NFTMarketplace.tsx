"use client";

import React, { useState } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { notifySuccess, notifyWarning } from '@/utils/notificationService';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

interface NFT {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const nfts: NFT[] = [
  {
    id: 'basic-nft',
    name: 'Token Shield',
    description: 'Um escudo básico para proteção',
    price: 100,
    image: '🛡️',
    rarity: 'common'
  },
  {
    id: 'premium-nft',
    name: 'Golden Sword',
    description: 'Uma espada dourada poderosa',
    price: 500,
    image: '⚔️',
    rarity: 'rare'
  },
  {
    id: 'elite-nft',
    name: 'Dragon Crown',
    description: 'Coroa lendária de dragão',
    price: 1000,
    image: '👑',
    rarity: 'legendary'
  }
];

const rarityColors = {
  common: 'border-gray-500/30 bg-gray-500/10',
  rare: 'border-blue-500/30 bg-blue-500/10',
  epic: 'border-purple-500/30 bg-purple-500/10',
  legendary: 'border-yellow-500/30 bg-yellow-500/10'
};

const rarityLabels = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário'
};

export function NFTMarketplace() {
  const { balance, removeTokens } = useTokens();
  const { isConnected } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<string[]>([]);

  const handleBuyNFT = async (nft: NFT) => {
    if (balance < nft.price || isLoading || ownedNFTs.includes(nft.id)) return;

    setIsLoading(nft.id);
    
    try {
      console.log('🎨 Comprando NFT em modo local...');
      
      // Simular delay de transação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // SEMPRE usar modo local
      await removeTokens(nft.price);
      setOwnedNFTs(prev => [...prev, nft.id]);
      
      notifySuccess(`🎉 NFT "${nft.name}" adquirido com sucesso!`);
      console.log('✅ NFT comprado localmente:', { nft: nft.name, price: nft.price });
      
    } catch (error: any) {
      console.warn('Erro na compra de NFT:', error);
      notifyWarning('Erro ao comprar NFT. Tente novamente.');
    } finally {
      setIsLoading(null);
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="card">
      <div className="text-center">
        <div className="text-4xl mb-4">🎨</div>
        <h3 className="text-h3 font-bold text-white mb-2">NFT Marketplace</h3>
        <p className="text-white/80 mb-6">
          Adquira NFTs exclusivos com seus tokens!
        </p>

        {/* Status de Conexão */}
        {!isConnected && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Conecte sua carteira para comprar NFTs</span>
            </div>
          </div>
        )}

        {/* Modo Patrocinado Banner */}
        {isConnected && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>✅ Compras Patrocinadas - Sem gas fees!</span>
            </div>
          </div>
        )}

        {/* Balance */}
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <div className="text-purple-300 font-medium text-sm">Saldo Disponível</div>
          <div className="text-white text-2xl font-bold">{formatCurrency(balance)} Tokens</div>
        </div>

        {/* NFTs Grid */}
        <div className="space-y-4 mb-6">
          {nfts.map((nft) => {
            const canAfford = balance >= nft.price;
            const isOwned = ownedNFTs.includes(nft.id);
            const isLoadingThis = isLoading === nft.id;

            return (
              <div
                key={nft.id}
                className={`p-4 rounded-lg border ${rarityColors[nft.rarity]} relative`}
              >
                {/* Rarity Badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-white">
                    {rarityLabels[nft.rarity]}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-4xl">{nft.image}</div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-bold text-lg">{nft.name}</div>
                    <div className="text-white/60 text-sm mb-2">{nft.description}</div>
                    <div className="text-purple-400 font-bold">{formatCurrency(nft.price)} Tokens</div>
                  </div>
                  <div className="flex-shrink-0">
                    {isOwned ? (
                      <div className="bg-green-600/20 text-green-400 font-medium py-2 px-4 rounded-lg text-center">
                        ✅ Possuído
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuyNFT(nft)}
                        disabled={!canAfford || isLoadingThis || !isConnected}
                        className={`py-2 px-4 rounded-lg font-medium transition-all ${
                          canAfford && !isLoadingThis && isConnected
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isLoadingThis ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Comprando...
                          </div>
                        ) : !isConnected ? (
                          'Conecte'
                        ) : !canAfford ? (
                          'Saldo Insuficiente'
                        ) : (
                          '🛒 Comprar'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* My NFTs */}
        {ownedNFTs.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="text-blue-400 text-sm mb-2">
              <div className="font-medium">Minha Coleção</div>
            </div>
            <div className="flex gap-2">
              {ownedNFTs.map(id => {
                const nft = nfts.find(n => n.id === id);
                return nft ? (
                  <div key={id} className="text-2xl" title={nft.name}>
                    {nft.image}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-blue-400 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Marketplace Patrocinado</span>
            </div>
            <p className="text-blue-300 text-xs">
              Todas as compras são processadas com Account Abstraction, sem necessidade de ETH para gas!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 