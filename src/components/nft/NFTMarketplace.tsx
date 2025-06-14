"use client";

import React, { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useBlockchain } from '@/hooks/useBlockchain';
import { NFT_CONFIG } from '@/contracts/config';
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notificationService';

interface NFT {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attributes: { trait_type: string; value: string }[];
  owner?: string;
  forSale?: boolean;
}

const nftCollection: NFT[] = [
  {
    id: 1,
    name: NFT_CONFIG.MEMBER_NFT.name,
    description: NFT_CONFIG.MEMBER_NFT.description,
    price: NFT_CONFIG.MEMBER_NFT.price,
    image: NFT_CONFIG.MEMBER_NFT.image,
    rarity: 'common',
    attributes: [
      { trait_type: 'Rarity', value: 'Common' },
      { trait_type: 'Collection', value: 'Member' },
      { trait_type: 'Power', value: '25' }
    ],
    forSale: true
  },
  {
    id: 2,
    name: NFT_CONFIG.PREMIUM_NFT.name,
    description: NFT_CONFIG.PREMIUM_NFT.description,
    price: NFT_CONFIG.PREMIUM_NFT.price,
    image: NFT_CONFIG.PREMIUM_NFT.image,
    rarity: 'rare',
    attributes: [
      { trait_type: 'Rarity', value: 'Rare' },
      { trait_type: 'Collection', value: 'Premium' },
      { trait_type: 'Power', value: '75' }
    ],
    forSale: true
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
  const { nftOperations, isLoading: blockchainLoading } = useBlockchain();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'owned'>('marketplace');

  // Removed useEffect that called non-existent getUserNFTs function
  // NFTs owned will be tracked locally when purchased

  const handleBuyNFT = async (nft: NFT) => {
    if (balance < nft.price || isLoading || ownedNFTs.some(owned => owned.id === nft.id) || blockchainLoading) return;

    setIsLoading(nft.id);

    try {
      // Como não temos método buyNFT no contrato, usar simulação
      console.log('🔧 Comprando NFT via simulação');
      
      // Simular compra
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await removeTokens(nft.price);
      setOwnedNFTs(prev => [...prev, nft]);
      notifySuccess(`${nft.name} comprado com sucesso!`);
    } catch (error) {
      console.error('Erro ao comprar NFT:', error);
      notifyWarning('Ocorreu um erro ao comprar NFT. Usando simulação.');
      
      // Fallback to simulation
      try {
        console.warn('⚠️ Usando simulação de compra de NFT');
        await new Promise(resolve => setTimeout(resolve, 2000));

        await removeTokens(nft.price);
        setOwnedNFTs(prev => [...prev, nft]);
        notifySuccess(`${nft.name} (simulado) comprado com sucesso!`);
      } catch (fallbackError) {
        console.error('Erro no fallback da compra de NFT:', fallbackError);
        notifyError('Falha ao comprar NFT mesmo com simulação.');
      }
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card text-center">
        <div className="text-4xl mb-4">🎨</div>
        <h3 className="text-h3 font-bold text-white mb-2">NFT Marketplace</h3>
        <p className="text-white/80 mb-4">
          Adquira NFTs exclusivos com benefícios especiais!
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 bg-black/20 rounded-lg p-4">
          <div>
            <div className="text-purple-300 font-medium text-sm">Saldo Disponível</div>
            <div className="text-white text-lg font-bold">{balance} Tokens</div>
          </div>
          <div>
            <div className="text-purple-300 font-medium text-sm">NFTs Possuídos</div>
            <div className="text-white text-lg font-bold">{ownedNFTs.length}</div>
          </div>
        </div>
      </div>

      {/* NFT Collection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nftCollection.map((nft) => {
          const isOwned = ownedNFTs.some(owned => owned.id === nft.id);
          const canAfford = balance >= nft.price;
          const isLoadingThis = isLoading === nft.id;

          return (
            <div
              key={nft.id}
              className={`card ${rarityColors[nft.rarity]} relative overflow-hidden`}
            >
              {/* Rarity Badge */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-xs font-medium text-white">
                  {rarityLabels[nft.rarity]}
                </span>
              </div>

              {/* Owned Badge */}
              {isOwned && (
                <div className="absolute top-3 left-3 bg-green-500/80 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-white">✅ Possuído</span>
                </div>
              )}

              <div className="text-center">
                {/* NFT Image */}
                <div className="text-6xl mb-4">{nft.image}</div>

                {/* NFT Info */}
                <h4 className="text-lg font-bold text-white mb-2">{nft.name}</h4>
                <p className="text-white/80 text-sm mb-4">{nft.description}</p>

                {/* Price */}
                <div className="text-2xl font-bold text-purple-400 mb-4">
                  {nft.price} Tokens
                </div>

                {/* Benefits */}
                <div className="bg-black/20 rounded-lg p-3 mb-4">
                  <div className="text-xs text-purple-300 font-medium mb-2">Benefícios:</div>
                  <ul className="text-xs text-white/80 space-y-1">
                    {nft.attributes.map((attribute, index) => (
                      <li key={index}>• {attribute.trait_type}: {attribute.value}</li>
                    ))}
                  </ul>
                </div>

                {/* Buy Button */}
                {!isOwned ? (
                  <button
                    onClick={() => handleBuyNFT(nft)}
                    disabled={!canAfford || isLoadingThis}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoadingThis ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Comprando...
                      </>
                    ) : !canAfford ? (
                      'Saldo Insuficiente'
                    ) : (
                      <>
                        🛒 Comprar NFT
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full bg-green-600/20 text-green-400 font-medium py-2 px-4 rounded-lg text-center">
                    ✅ Possuído
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Owned NFTs Section */}
      {ownedNFTs.length > 0 && (
        <div className="card">
          <h4 className="text-lg font-bold text-white mb-4">Meus NFTs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ownedNFTs.map((nft) => {
              return (
                <div key={nft.id} className="text-center">
                  <div className="text-3xl mb-2">{nft.image}</div>
                  <div className="text-white text-sm font-medium">{nft.name}</div>
                  <div className="text-purple-300 text-xs">{rarityLabels[nft.rarity]}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 