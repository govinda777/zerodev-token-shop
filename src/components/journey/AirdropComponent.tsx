"use client";

import React, { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useJourney } from './JourneyProvider';

interface AirdropEvent {
  id: string;
  name: string;
  description: string;
  reward: number;
  icon: string;
  endTime: number;
  requirements: string[];
}

const airdropEvents: AirdropEvent[] = [
  {
    id: 'welcome-airdrop',
    name: 'Airdrop de Boas-vindas',
    description: 'Recompensa especial para novos usuários que compraram NFTs',
    reward: 20,
    icon: '🎁',
    endTime: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 dias
    requirements: ['Possuir pelo menos 1 NFT']
  },
  {
    id: 'community-airdrop',
    name: 'Airdrop da Comunidade',
    description: 'Recompensa para membros ativos da comunidade',
    reward: 15,
    icon: '🌟',
    endTime: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 dias
    requirements: ['Ter feito stake', 'Possuir NFT']
  },
  {
    id: 'loyalty-airdrop',
    name: 'Airdrop de Fidelidade',
    description: 'Para usuários que completaram múltiplas missões',
    reward: 30,
    icon: '💎',
    endTime: Date.now() + (5 * 24 * 60 * 60 * 1000), // 5 dias
    requirements: ['Completar 4+ missões']
  }
];

export function AirdropComponent() {
  const { addTokens } = useTokens();
  const { journey, completeMission } = useJourney();
  const [claimedAirdrops, setClaimedAirdrops] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const airdropMission = journey.missions.find(m => m.id === 'airdrop');
  const isUnlocked = airdropMission?.unlocked || false;
  const isCompleted = airdropMission?.completed || false;

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Expirado';
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const checkRequirements = (airdrop: AirdropEvent): boolean => {
    // Simular verificação de requisitos baseado nas missões completadas
    const completedMissions = journey.completedMissions;
    
    if (airdrop.requirements.includes('Possuir pelo menos 1 NFT')) {
      if (!completedMissions.includes('buy-nft')) return false;
    }
    
    if (airdrop.requirements.includes('Ter feito stake')) {
      if (!completedMissions.includes('stake')) return false;
    }
    
    if (airdrop.requirements.includes('Completar 4+ missões')) {
      if (completedMissions.length < 4) return false;
    }
    
    return true;
  };

  const handleClaimAirdrop = async (airdrop: AirdropEvent) => {
    if (claimedAirdrops.includes(airdrop.id) || isLoading || !checkRequirements(airdrop)) return;

    setIsLoading(airdrop.id);

    try {
      // Simular delay da transação
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Adicionar tokens
      addTokens(airdrop.reward);
      setClaimedAirdrops(prev => [...prev, airdrop.id]);

      // Completar missão se for a primeira vez
      if (!isCompleted) {
        completeMission('airdrop');
      }
    } catch (error) {
      console.error('Erro ao reivindicar airdrop:', error);
    } finally {
      setIsLoading(null);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-h3 font-bold text-white mb-2">Airdrops Bloqueados</h3>
          <p className="text-white/80">Complete a missão de NFT para desbloquear airdrops.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card text-center">
        <div className="text-4xl mb-4">🎁</div>
        <h3 className="text-h3 font-bold text-white mb-2">Airdrops Ativos</h3>
        <p className="text-white/80 mb-4">
          Reivindique tokens gratuitos de eventos especiais!
        </p>
        
        {/* Stats */}
        <div className="bg-black/20 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-purple-300 font-medium">Airdrops Disponíveis</div>
              <div className="text-white text-lg font-bold">
                {airdropEvents.filter(a => !claimedAirdrops.includes(a.id) && a.endTime > Date.now()).length}
              </div>
            </div>
            <div>
              <div className="text-purple-300 font-medium">Airdrops Reivindicados</div>
              <div className="text-white text-lg font-bold">{claimedAirdrops.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Airdrop Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {airdropEvents.map((airdrop) => {
          const isClaimed = claimedAirdrops.includes(airdrop.id);
          const isExpired = airdrop.endTime <= Date.now();
          const meetsRequirements = checkRequirements(airdrop);
          const isLoadingThis = isLoading === airdrop.id;

          return (
            <div
              key={airdrop.id}
              className={`card relative overflow-hidden ${
                isClaimed ? 'bg-green-500/10 border-green-500/30' :
                isExpired ? 'bg-gray-500/10 border-gray-500/30' :
                meetsRequirements ? 'bg-purple-500/10 border-purple-500/30' :
                'bg-red-500/10 border-red-500/30'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {isClaimed ? (
                  <span className="bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                    ✅ Reivindicado
                  </span>
                ) : isExpired ? (
                  <span className="bg-gray-500/80 text-white text-xs px-2 py-1 rounded-full">
                    ⏰ Expirado
                  </span>
                ) : meetsRequirements ? (
                  <span className="bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                    ✅ Elegível
                  </span>
                ) : (
                  <span className="bg-red-500/80 text-white text-xs px-2 py-1 rounded-full">
                    ❌ Bloqueado
                  </span>
                )}
              </div>

              <div className="text-center">
                {/* Airdrop Icon */}
                <div className="text-4xl mb-4">{airdrop.icon}</div>

                {/* Airdrop Info */}
                <h4 className="text-lg font-bold text-white mb-2">{airdrop.name}</h4>
                <p className="text-white/80 text-sm mb-4">{airdrop.description}</p>

                {/* Reward */}
                <div className="text-2xl font-bold text-purple-400 mb-4">
                  +{airdrop.reward} Tokens
                </div>

                {/* Time Remaining */}
                {!isExpired && (
                  <div className="bg-black/20 rounded-lg p-3 mb-4">
                    <div className="text-xs text-purple-300 font-medium mb-1">Tempo Restante:</div>
                    <div className="text-white text-sm">{formatTimeRemaining(airdrop.endTime)}</div>
                  </div>
                )}

                {/* Requirements */}
                <div className="bg-black/20 rounded-lg p-3 mb-4">
                  <div className="text-xs text-purple-300 font-medium mb-2">Requisitos:</div>
                  <ul className="text-xs text-white/80 space-y-1">
                    {airdrop.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span className={meetsRequirements ? 'text-green-400' : 'text-red-400'}>
                          {meetsRequirements ? '✅' : '❌'}
                        </span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Claim Button */}
                {!isClaimed && !isExpired && meetsRequirements ? (
                  <button
                    onClick={() => handleClaimAirdrop(airdrop)}
                    disabled={isLoadingThis}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoadingThis ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Reivindicando...
                      </>
                    ) : (
                      <>
                        🎁 Reivindicar
                      </>
                    )}
                  </button>
                ) : isClaimed ? (
                  <div className="w-full bg-green-600/20 text-green-400 font-medium py-2 px-4 rounded-lg text-center">
                    ✅ Reivindicado
                  </div>
                ) : isExpired ? (
                  <div className="w-full bg-gray-600/20 text-gray-400 font-medium py-2 px-4 rounded-lg text-center">
                    ⏰ Expirado
                  </div>
                ) : (
                  <div className="w-full bg-red-600/20 text-red-400 font-medium py-2 px-4 rounded-lg text-center">
                    ❌ Requisitos não atendidos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission Status */}
      {isCompleted && (
        <div className="card">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-medium text-center">
              ✅ Missão de Airdrop Concluída! Você desbloqueou assinaturas premium.
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 