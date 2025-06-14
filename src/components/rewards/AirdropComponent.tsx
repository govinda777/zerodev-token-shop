"use client";

import React, { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useBlockchain } from '@/hooks/useBlockchain';
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notificationService';
import { CONTRACTS } from '@/contracts/config';

// Função utilitária para validar endereço de contrato Ethereum e evitar placeholders
function isValidAirdropAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address) && !address.includes('1234567890');
}

interface AirdropCampaign {
  id: string;
  name: string;
  description: string;
  reward: number;
  maxClaims: number;
  currentClaims: number;
  endDate: Date;
  requirements?: string[];
  icon: string;
}

const airdropCampaigns: AirdropCampaign[] = [
  {
    id: 'welcome',
    name: 'Airdrop de Boas-vindas',
    description: 'Ganhe tokens gratuitos só por participar!',
    reward: 25,
    maxClaims: 1000,
    currentClaims: 123,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    icon: '🎁'
  },
  {
    id: 'community',
    name: 'Airdrop da Comunidade',
    description: 'Recompensa para membros ativos da comunidade',
    reward: 50,
    maxClaims: 500,
    currentClaims: 67,
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
    requirements: ['Ter pelo menos 10 tokens', 'Participar da comunidade'],
    icon: '🌟'
  },
  {
    id: 'early',
    name: 'Early Adopter',
    description: 'Para os primeiros usuários da plataforma',
    reward: 100,
    maxClaims: 100,
    currentClaims: 45,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    requirements: ['Ser um dos primeiros 100 usuários'],
    icon: '🚀'
  }
];

export function AirdropComponent() {
  const { balance, addTokens } = useTokens();
  const { airdropOperations, isLoading: blockchainLoading } = useBlockchain();
  const [isLoading, setIsLoading] = useState(false);
  const [claimedAirdrops, setClaimedAirdrops] = useState<string[]>([]);

  // Carregar airdrops já reivindicados - CORRIGIDO para evitar loops
  useEffect(() => {
    const loadClaimedAirdrops = async () => {
      // Verifica se o contrato de airdrop é válido antes de tentar acessar
      if (!isValidAirdropAddress(CONTRACTS.AIRDROP)) {
        // Não tenta acessar nem loga erro repetidamente
        setClaimedAirdrops([]);
        return;
      }
      
      try {
        // Verificar quais airdrops já foram reivindicados
        const claimed = await Promise.all(
          airdropCampaigns.map(async (campaign) => {
            try {
              const isClaimed = await airdropOperations.hasReceived();
              return isClaimed ? campaign.id : null;
            } catch {
              // Não loga erro se o contrato não está deployado
              return null;
            }
          })
        );
        
        setClaimedAirdrops(claimed.filter(Boolean) as string[]);
      } catch {
        // Não loga erro se o contrato não está deployado
        setClaimedAirdrops([]);
      }
    };

    // Só executa se airdropOperations estiver disponível
    if (airdropOperations) {
      loadClaimedAirdrops();
    }
  }, []); // Array vazio - executa apenas uma vez na montagem

  const handleClaimAirdrop = async (campaign: AirdropCampaign) => {
    if (isLoading || blockchainLoading) return;

    setIsLoading(true);

    try {
      // Verificar requisitos específicos
      if (campaign.requirements) {
        const hasMinTokens = campaign.requirements.includes('Ter pelo menos 10 tokens') && balance < 10;
        if (hasMinTokens) {
          notifyWarning('Você precisa ter pelo menos 10 tokens para reivindicar este airdrop.');
          return;
        }
      }

      // Só tenta usar o contrato se for válido
      if (isValidAirdropAddress(CONTRACTS.AIRDROP)) {
        try {
          const tx = await airdropOperations.claimAirdrop();
          
          if (tx) {
            await addTokens(campaign.reward);
            setClaimedAirdrops(prev => [...prev, campaign.id]);
            notifySuccess(`🎉 Airdrop reivindicado! Você ganhou ${campaign.reward} tokens!`);
            return;
          }
        } catch (error) {
          // Fallback para simulação se contrato falhar
        }
      }
      
      // Fallback para simulação (sempre funciona)
      await new Promise(resolve => setTimeout(resolve, 2000));
      await addTokens(campaign.reward);
      setClaimedAirdrops(prev => [...prev, campaign.id]);
      notifySuccess(`🎉 Airdrop (simulado) reivindicado! Você ganhou ${campaign.reward} tokens!`);
      
    } catch (fallbackError) {
      notifyError('Falha ao reivindicar airdrop.');
    } finally {
      setIsLoading(false);
    }
  };

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
                {airdropCampaigns.filter(a => !claimedAirdrops.includes(a.id) && a.endDate > new Date()).length}
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
        {airdropCampaigns.map((campaign) => {
          const isClaimed = claimedAirdrops.includes(campaign.id);
          const isExpired = campaign.endDate <= new Date();
          const meetsRequirements = campaign.requirements ? campaign.requirements.every(req => {
            if (req.includes('Ter pelo menos 10 tokens')) {
              return balance >= 10;
            }
            return true;
          }) : true;
          const isLoadingThis = isLoading && campaign.id === 'welcome';

          return (
            <div
              key={campaign.id}
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
                <div className="text-4xl mb-4">{campaign.icon}</div>

                {/* Airdrop Info */}
                <h4 className="text-lg font-bold text-white mb-2">{campaign.name}</h4>
                <p className="text-white/80 text-sm mb-4">{campaign.description}</p>

                {/* Reward */}
                <div className="text-2xl font-bold text-purple-400 mb-4">
                  +{campaign.reward} Tokens
                </div>

                {/* Time Remaining */}
                {!isExpired && (
                  <div className="bg-black/20 rounded-lg p-3 mb-4">
                    <div className="text-xs text-purple-300 font-medium mb-1">Tempo Restante:</div>
                    <div className="text-white text-sm">{Math.ceil((campaign.endDate.getTime() - Date.now()) / (1000 * 60 * 60))} horas</div>
                  </div>
                )}

                {/* Requirements */}
                <div className="bg-black/20 rounded-lg p-3 mb-4">
                  <div className="text-xs text-purple-300 font-medium mb-2">Requisitos:</div>
                  <ul className="text-xs text-white/80 space-y-1">
                    {campaign.requirements?.map((req, index) => (
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
                    onClick={() => handleClaimAirdrop(campaign)}
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
    </div>
  );
} 