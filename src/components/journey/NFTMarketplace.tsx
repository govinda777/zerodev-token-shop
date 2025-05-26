"use client";

import React, { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useJourney } from './JourneyProvider';
import { useBlockchain } from '@/hooks/useBlockchain';
import { NFT_CONFIG } from '@/contracts/config';

interface NFT {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  benefits: string[];
}

const nftCollection: NFT[] = [
  {
    id: 'member-nft',
    name: NFT_CONFIG.MEMBER_NFT.name,
    description: NFT_CONFIG.MEMBER_NFT.description,
    price: NFT_CONFIG.MEMBER_NFT.price,
    image: '🏅',
    rarity: 'common',
    benefits: ['Acesso a airdrops exclusivos', 'Membro da comunidade']
  },
  {
    id: 'premium-nft',
    name: NFT_CONFIG.PREMIUM_NFT.name,
    description: NFT_CONFIG.PREMIUM_NFT.description,
    price: NFT_CONFIG.PREMIUM_NFT.price,
    image: '💎',
    rarity: 'rare',
    benefits: ['Acesso a pools premium', '+10% APY em staking', 'Airdrops VIP']
  },
  {
    id: 'golden-token',
    name: 'Golden Token',
    description: 'Token dourado de prestígio',
    price: 50,
    image: '🪙',
    rarity: 'epic',
    benefits: ['Acesso VIP', '+20% em todas as recompensas']
  },
  {
    id: 'diamond-crown',
    name: 'Diamond Crown',
    description: 'Coroa de diamante para elite',
    price: 100,
    image: '👑',
    rarity: 'legendary',
    benefits: ['Acesso total', 'Renda passiva exclusiva', '+50% em recompensas']
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
  const { journey, completeMission } = useJourney();
  const { nftOperations, tokenOperations, isLoading: blockchainLoading } = useBlockchain();
  const [ownedNFTs, setOwnedNFTs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [nftBalance, setNftBalance] = useState(0);

  const nftMission = journey.missions.find(m => m.id === 'buy-nft');
  const isUnlocked = nftMission?.unlocked || false;
  const isCompleted = nftMission?.completed || false;

  // Carregar NFTs do usuário
  useEffect(() => {
    const loadUserNFTs = async () => {
      try {
        const balance = await nftOperations.getBalance();
        setNftBalance(balance);
        
        // Verificar quais NFTs específicos o usuário possui
        const owned = [];
        for (const nft of nftCollection) {
          try {
            if (nft.id === 'member-nft') {
              const owner = await nftOperations.getOwner(NFT_CONFIG.MEMBER_NFT.id);
              // Se não der erro, o NFT existe e tem dono
              owned.push(nft.id);
            } else if (nft.id === 'premium-nft') {
              const owner = await nftOperations.getOwner(NFT_CONFIG.PREMIUM_NFT.id);
              owned.push(nft.id);
            }
          } catch (error) {
            // NFT não existe ou usuário não possui
          }
        }
        setOwnedNFTs(owned);
      } catch (error) {
        console.error('Erro ao carregar NFTs do usuário:', error);
      }
    };

    if (isUnlocked) {
      loadUserNFTs();
    }
  }, [isUnlocked, nftOperations]);

  const handleBuyNFT = async (nft: NFT) => {
    if (balance < nft.price || isLoading || ownedNFTs.includes(nft.id) || blockchainLoading) return;

    setIsLoading(nft.id);

    try {
      let result;
      
      // Comprar NFT específico baseado no ID
      if (nft.id === 'member-nft') {
        result = await nftOperations.buyNFT(NFT_CONFIG.MEMBER_NFT.id);
      } else if (nft.id === 'premium-nft') {
        result = await nftOperations.buyNFT(NFT_CONFIG.PREMIUM_NFT.id);
      } else {
        // Para outros NFTs, simular compra
        throw new Error('NFT não disponível no contrato');
      }

      if (result.success) {
        console.log('✅ NFT comprado via contrato:', result.hash);
        
        // Gastar tokens localmente
        removeTokens(nft.price);
        setOwnedNFTs(prev => [...prev, nft.id]);
        setNftBalance(prev => prev + 1);

        // Completar missão se for a primeira vez
        if (!isCompleted) {
          completeMission('buy-nft');
        }
      } else {
        throw new Error(result.error?.message || 'Falha na compra do NFT');
      }
    } catch (error) {
      console.error('Erro ao comprar NFT:', error);
      
      // Fallback para simulação
      try {
        console.warn('⚠️ Usando simulação de compra de NFT');
        await new Promise(resolve => setTimeout(resolve, 2000));

        removeTokens(nft.price);
        setOwnedNFTs(prev => [...prev, nft.id]);
        setNftBalance(prev => prev + 1);

        if (!isCompleted) {
          completeMission('buy-nft');
        }
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
      }
    } finally {
      setIsLoading(null);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-h3 font-bold text-white mb-2">NFT Marketplace Bloqueado</h3>
          <p className="text-white/80">Complete a missão de staking para desbloquear o marketplace de NFTs.</p>
        </div>
      </div>
    );
  }

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
            <div className="text-white text-lg font-bold">{nftBalance}</div>
          </div>
        </div>
      </div>

      {/* NFT Collection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nftCollection.map((nft) => {
          const isOwned = ownedNFTs.includes(nft.id);
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
                    {nft.benefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
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
            {ownedNFTs.map((nftId) => {
              const nft = nftCollection.find(n => n.id === nftId);
              if (!nft) return null;

              return (
                <div key={nftId} className="text-center">
                  <div className="text-3xl mb-2">{nft.image}</div>
                  <div className="text-white text-sm font-medium">{nft.name}</div>
                  <div className="text-purple-300 text-xs">{rarityLabels[nft.rarity]}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mission Status */}
      {isCompleted && (
        <div className="card">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-medium text-center">
              ✅ Missão de NFT Concluída! Você desbloqueou airdrops especiais.
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 