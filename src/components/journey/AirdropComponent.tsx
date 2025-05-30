"use client";

import React, { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useJourney } from './JourneyProvider';
import { useBlockchain } from '@/hooks/useBlockchain';
import { MISSION_REWARDS, AIRDROP_CONFIG } from '@/contracts/config';
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notificationService';

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
    id: 'member-airdrop',
    name: AIRDROP_CONFIG.MEMBER_AIRDROP.name,
    description: AIRDROP_CONFIG.MEMBER_AIRDROP.description,
    reward: AIRDROP_CONFIG.MEMBER_AIRDROP.amount,
    icon: '🎁',
    endTime: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 dias
    requirements: ['Possuir pelo menos 1 NFT']
  },
  {
    id: 'staker-airdrop',
    name: AIRDROP_CONFIG.STAKER_AIRDROP.name,
    description: AIRDROP_CONFIG.STAKER_AIRDROP.description,
    reward: AIRDROP_CONFIG.STAKER_AIRDROP.amount,
    icon: '🌟',
    endTime: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 dias
    requirements: ['Ter feito stake']
  },
  {
    id: 'loyalty-airdrop',
    name: 'Airdrop de Fidelidade',
    description: 'Para usuários que completaram múltiplas missões',
    reward: MISSION_REWARDS.AIRDROP,
    icon: '💎',
    endTime: Date.now() + (5 * 24 * 60 * 60 * 1000), // 5 dias
    requirements: ['Completar 4+ missões']
  }
];

export function AirdropComponent() {
  const { addTokens } = useTokens();
  const { journey, completeMission } = useJourney();
  const { airdropOperations, nftOperations, isLoading: blockchainLoading } = useBlockchain();
  const [claimedAirdrops, setClaimedAirdrops] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [eligibilityStatus, setEligibilityStatus] = useState<Record<string, boolean>>({});

  const airdropMission = journey.missions.find(m => m.id === 'airdrop');
  const isUnlocked = airdropMission?.unlocked || false;
  const isCompleted = airdropMission?.completed || false;

  // Verificar elegibilidade e status dos airdrops
  useEffect(() => {
    const checkAirdropStatus = async () => {
      try {
        // Verificar se já recebeu airdrop do contrato
        const hasReceived = await airdropOperations.hasReceived();
        if (hasReceived) {
          setClaimedAirdrops(['member-airdrop']); // Assumindo que o contrato gerencia o airdrop principal
        }

        // Verificar elegibilidade
        const isEligible = await airdropOperations.isEligible();
        setEligibilityStatus(prev => ({
          ...prev,
          'member-airdrop': isEligible
        }));

        // Verificar se possui NFT para airdrop de membros
        const nftBalance = await nftOperations.getBalance();
        setEligibilityStatus(prev => ({
          ...prev,
          'member-airdrop': nftBalance > 0
        }));
      } catch (error) {
        // console.error('Erro ao verificar status do airdrop:', error);
        // Potentially notifyError("Não foi possível verificar o status do airdrop.");
        // Fallback para verificação local
        setEligibilityStatus({
          'member-airdrop': journey.completedMissions.includes('buy-nft'),
          'staker-airdrop': journey.completedMissions.includes('stake'),
          'loyalty-airdrop': journey.completedMissions.length >= 4
        });
      }
    };

    if (isUnlocked) {
      checkAirdropStatus();
    }
  }, [isUnlocked, airdropOperations, nftOperations, journey.completedMissions]);

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
    // Usar status de elegibilidade do blockchain se disponível
    if (eligibilityStatus[airdrop.id] !== undefined) {
      return eligibilityStatus[airdrop.id];
    }

    // Fallback para verificação local
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
    if (claimedAirdrops.includes(airdrop.id) || isLoading || !checkRequirements(airdrop) || blockchainLoading) return;

    setIsLoading(airdrop.id);

    try {
      // Tentar reivindicar via contrato para airdrops principais
      if (airdrop.id === 'member-airdrop') {
        const result = await airdropOperations.claimAirdrop();
        
        if (result.success) {
          // console.log('✅ Airdrop reivindicado via contrato:', result.hash); // Dev log
          await addTokens(airdrop.reward); // addTokens is async
          setClaimedAirdrops(prev => [...prev, airdrop.id]);
          notifySuccess(`Airdrop "${airdrop.name}" reivindicado com sucesso! Você ganhou ${airdrop.reward} tokens.`);

          if (!isCompleted) {
            completeMission('airdrop');
          }
        } else {
          notifyError(`Falha ao reivindicar airdrop: ${result.error?.message || 'Erro desconhecido'}`);
          throw new Error(result.error?.message || 'Falha ao reivindicar airdrop');
        }
      } else {
        // Para outros airdrops, usar simulação (this path will also hit the catch block)
        notifyWarning(`Airdrop "${airdrop.name}" não configurado para interação direta com contrato. Usando simulação.`);
        throw new Error('Airdrop não disponível no contrato');
      }
    } catch (error) {
      // console.error('Erro ao reivindicar airdrop:', error); // Original error
      notifyWarning(`Ocorreu um erro ao reivindicar "${airdrop.name}". Usando simulação.`);
      // Fallback to simulation
      try {
        // console.warn('⚠️ Usando simulação de airdrop'); // Dev log
        await new Promise(resolve => setTimeout(resolve, 2000));

        await addTokens(airdrop.reward); // addTokens is async
        setClaimedAirdrops(prev => [...prev, airdrop.id]);
        notifySuccess(`Airdrop "${airdrop.name}" (simulado) reivindicado! Você ganhou ${airdrop.reward} tokens.`);

        if (!isCompleted) {
          completeMission('airdrop');
        }
      } catch (fallbackError) {
        // console.error('Erro no fallback do airdrop:', fallbackError); // Dev log
        notifyError(`Falha ao reivindicar airdrop "${airdrop.name}" mesmo com simulação.`);
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