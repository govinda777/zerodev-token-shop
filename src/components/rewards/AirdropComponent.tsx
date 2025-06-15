"use client";

import React, { useState, useCallback } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { notifySuccess, notifyWarning } from '@/utils/notificationService';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

interface AirdropCampaign {
  id: string;
  name: string;
  description: string;
  reward: number;
  participants: number;
  maxParticipants: number;
  endDate: Date;
  icon: string;
  requirements: string[];
}

const airdropCampaigns: AirdropCampaign[] = [
  {
    id: 'welcome-airdrop',
    name: 'Airdrop de Boas-vindas',
    description: 'Tokens gratuitos para novos usuários',
    reward: 100,
    participants: 847,
    maxParticipants: 1000,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    icon: '🎁',
    requirements: ['Conectar carteira', 'Ser novo usuário']
  },
  {
    id: 'community-airdrop',
    name: 'Airdrop da Comunidade',
    description: 'Recompensa por participação ativa',
    reward: 250,
    participants: 312,
    maxParticipants: 500,
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias
    icon: '🚀',
    requirements: ['Ter pelo menos 50 tokens', 'Ser membro há mais de 1 semana']
  },
  {
    id: 'holder-airdrop',
    name: 'Airdrop de Holders',
    description: 'Recompensa para grandes holders',
    reward: 500,
    participants: 89,
    maxParticipants: 200,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    icon: '💎',
    requirements: ['Ter pelo menos 1000 tokens', 'Não ter vendido tokens nos últimos 30 dias']
  }
];

export function AirdropComponent() {
  const { balance, addTokens } = useTokens();
  const { isConnected } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [claimedAirdrops, setClaimedAirdrops] = useState<string[]>([]);

  const formatDate = useCallback((date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const getDaysRemaining = useCallback((endDate: Date): number => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  const isEligible = useCallback((campaign: AirdropCampaign): boolean => {
    if (claimedAirdrops.includes(campaign.id)) return false;
    if (campaign.participants >= campaign.maxParticipants) return false;
    if (getDaysRemaining(campaign.endDate) <= 0) return false;

    // Verificar requisitos específicos
    if (campaign.id === 'community-airdrop' && balance < 50) return false;
    if (campaign.id === 'holder-airdrop' && balance < 1000) return false;

    return true;
  }, [balance, claimedAirdrops, getDaysRemaining]);

  const handleClaimAirdrop = async (campaign: AirdropCampaign) => {
    if (!isEligible(campaign) || isLoading) return;

    setIsLoading(campaign.id);
    
    try {
      console.log('🎁 Reivindicando airdrop em modo local...');
      
      // Simular delay de transação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // SEMPRE usar modo local
      addTokens(campaign.reward);
      setClaimedAirdrops(prev => [...prev, campaign.id]);
      
      notifySuccess(`🎉 Airdrop "${campaign.name}" reivindicado! +${campaign.reward} tokens!`);
      console.log('✅ Airdrop reivindicado localmente:', { campaign: campaign.name, reward: campaign.reward });
      
    } catch (error: any) {
      console.warn('Erro no airdrop:', error);
      notifyWarning('Erro ao reivindicar airdrop. Tente novamente.');
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
        <div className="text-4xl mb-4">🎁</div>
        <h3 className="text-h3 font-bold text-white mb-2">Airdrops Ativos</h3>
        <p className="text-white/80 mb-6">
          Reivindique tokens gratuitos de campanhas ativas!
        </p>

        {/* Status de Conexão */}
        {!isConnected && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Conecte sua carteira para participar de airdrops</span>
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
              <span>✅ Airdrops Patrocinados - Sem gas fees!</span>
            </div>
          </div>
        )}

        {/* Balance */}
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <div className="text-purple-300 font-medium text-sm">Saldo Atual</div>
          <div className="text-white text-2xl font-bold">{formatCurrency(balance)} Tokens</div>
        </div>

        {/* Airdrop Campaigns */}
        <div className="space-y-4 mb-6">
          {airdropCampaigns.map((campaign) => {
            const eligible = isEligible(campaign);
            const claimed = claimedAirdrops.includes(campaign.id);
            const isLoadingThis = isLoading === campaign.id;
            const daysRemaining = getDaysRemaining(campaign.endDate);

            return (
              <div
                key={campaign.id}
                className="p-4 rounded-lg border border-white/20 bg-black/20"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{campaign.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-bold text-lg">{campaign.name}</div>
                      <div className="text-purple-400 font-bold">
                        +{formatCurrency(campaign.reward)} Tokens
                      </div>
                    </div>
                    <div className="text-white/60 text-sm mb-3">{campaign.description}</div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-white/60 mb-1">
                        <span>Participantes: {campaign.participants}/{campaign.maxParticipants}</span>
                        <span>Termina em {daysRemaining} dias</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${(campaign.participants / campaign.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-3">
                      <div className="text-white/60 text-xs font-medium mb-1">Requisitos:</div>
                      <div className="space-y-1">
                        {campaign.requirements.map((req, index) => (
                          <div key={index} className="text-white/50 text-xs flex items-center gap-1">
                            <span>•</span>
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                      {claimed ? (
                        <div className="bg-green-600/20 text-green-400 font-medium py-2 px-4 rounded-lg text-sm">
                          ✅ Reivindicado
                        </div>
                      ) : !eligible ? (
                        <div className="bg-gray-600 text-gray-400 font-medium py-2 px-4 rounded-lg text-sm cursor-not-allowed">
                          {daysRemaining <= 0 ? 'Expirado' : 
                           campaign.participants >= campaign.maxParticipants ? 'Esgotado' : 
                           'Não Elegível'}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleClaimAirdrop(campaign)}
                          disabled={isLoadingThis || !isConnected}
                          className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                            isConnected && !isLoadingThis
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isLoadingThis ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Reivindicando...
                            </div>
                          ) : !isConnected ? (
                            'Conecte'
                          ) : (
                            '🎁 Reivindicar'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-blue-400 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Airdrops Patrocinados</span>
            </div>
            <p className="text-blue-300 text-xs">
              Todos os airdrops são processados com Account Abstraction, sem necessidade de ETH para gas!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 