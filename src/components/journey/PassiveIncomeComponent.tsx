"use client";

import React, { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useJourney } from './JourneyProvider';

interface IncomeStream {
  id: string;
  name: string;
  description: string;
  initialInvestment: number;
  dailyReturn: number;
  icon: string;
  riskLevel: 'low' | 'medium' | 'high';
  duration: number; // em dias
}

const incomeStreams: IncomeStream[] = [
  {
    id: 'savings-account',
    name: 'Conta Poupança',
    description: 'Investimento seguro com retorno garantido',
    initialInvestment: 100,
    dailyReturn: 1,
    icon: '🏦',
    riskLevel: 'low',
    duration: 30
  },
  {
    id: 'liquidity-pool',
    name: 'Pool de Liquidez',
    description: 'Forneça liquidez e ganhe taxas de transação',
    initialInvestment: 200,
    dailyReturn: 3,
    icon: '🌊',
    riskLevel: 'medium',
    duration: 60
  },
  {
    id: 'yield-farming',
    name: 'Yield Farming',
    description: 'Estratégia avançada com altos retornos',
    initialInvestment: 500,
    dailyReturn: 8,
    icon: '🚜',
    riskLevel: 'high',
    duration: 90
  }
];

const riskColors = {
  low: 'border-green-500/30 bg-green-500/10',
  medium: 'border-yellow-500/30 bg-yellow-500/10',
  high: 'border-red-500/30 bg-red-500/10'
};

const riskLabels = {
  low: 'Baixo Risco',
  medium: 'Risco Médio',
  high: 'Alto Risco'
};

interface ActiveInvestment {
  streamId: string;
  startDate: number;
  investment: number;
  totalEarned: number;
  lastClaim: number;
}

export function PassiveIncomeComponent() {
  const { balance, removeTokens, addTokens } = useTokens();
  const { journey, completeMission } = useJourney();
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const passiveIncomeMission = journey.missions.find(m => m.id === 'passive-income');
  const isUnlocked = passiveIncomeMission?.unlocked || false;
  const isCompleted = passiveIncomeMission?.completed || false;

  // Calcular ganhos pendentes
  const calculatePendingEarnings = (investment: ActiveInvestment): number => {
    const stream = incomeStreams.find(s => s.id === investment.streamId);
    if (!stream) return 0;

    const now = Date.now();
    const daysSinceLastClaim = Math.floor((now - investment.lastClaim) / (24 * 60 * 60 * 1000));
    
    return Math.min(daysSinceLastClaim * stream.dailyReturn, stream.dailyReturn * 7); // Max 7 dias
  };

  const getTotalPendingEarnings = (): number => {
    return activeInvestments.reduce((total, investment) => {
      return total + calculatePendingEarnings(investment);
    }, 0);
  };

  const handleInvest = async (stream: IncomeStream) => {
    if (balance < stream.initialInvestment || isLoading) return;

    setIsLoading(stream.id);

    try {
      // Simular delay da transação
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Gastar tokens
      removeTokens(stream.initialInvestment);

      // Criar novo investimento
      const newInvestment: ActiveInvestment = {
        streamId: stream.id,
        startDate: Date.now(),
        investment: stream.initialInvestment,
        totalEarned: 0,
        lastClaim: Date.now()
      };

      setActiveInvestments(prev => [...prev, newInvestment]);

      // Completar missão se for a primeira vez
      if (!isCompleted) {
        completeMission('passive-income');
      }
    } catch (error) {
      console.error('Erro ao investir:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleClaimEarnings = async (investmentIndex: number) => {
    const investment = activeInvestments[investmentIndex];
    const pendingEarnings = calculatePendingEarnings(investment);
    
    if (pendingEarnings <= 0) return;

    try {
      // Simular delay da transação
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Adicionar tokens ganhos
      addTokens(pendingEarnings);

      // Atualizar investimento
      setActiveInvestments(prev => prev.map((inv, index) => 
        index === investmentIndex 
          ? { 
              ...inv, 
              totalEarned: inv.totalEarned + pendingEarnings,
              lastClaim: Date.now()
            }
          : inv
      ));
    } catch (error) {
      console.error('Erro ao reivindicar ganhos:', error);
    }
  };

  const formatDuration = (days: number): string => {
    if (days < 30) return `${days} dias`;
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  };

  if (!isUnlocked) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-h3 font-bold text-white mb-2">Renda Passiva Bloqueada</h3>
          <p className="text-white/80">Complete a missão de assinatura para desbloquear renda passiva.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card text-center">
        <div className="text-4xl mb-4">💰</div>
        <h3 className="text-h3 font-bold text-white mb-2">Renda Passiva</h3>
        <p className="text-white/80 mb-4">
          Configure fontes de renda passiva e ganhe tokens automaticamente!
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 bg-black/20 rounded-lg p-4">
          <div>
            <div className="text-purple-300 font-medium text-sm">Investimentos Ativos</div>
            <div className="text-white text-lg font-bold">{activeInvestments.length}</div>
          </div>
          <div>
            <div className="text-purple-300 font-medium text-sm">Ganhos Pendentes</div>
            <div className="text-white text-lg font-bold">{getTotalPendingEarnings()}</div>
          </div>
          <div>
            <div className="text-purple-300 font-medium text-sm">Total Ganho</div>
            <div className="text-white text-lg font-bold">
              {activeInvestments.reduce((total, inv) => total + inv.totalEarned, 0)}
            </div>
          </div>
        </div>

        {/* Claim All Button */}
        {getTotalPendingEarnings() > 0 && (
          <button
            onClick={() => {
              activeInvestments.forEach((_, index) => {
                if (calculatePendingEarnings(activeInvestments[index]) > 0) {
                  handleClaimEarnings(index);
                }
              });
            }}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            🪙 Reivindicar Todos os Ganhos ({getTotalPendingEarnings()} tokens)
          </button>
        )}
      </div>

      {/* Income Streams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {incomeStreams.map((stream) => {
          const hasActiveInvestment = activeInvestments.some(inv => inv.streamId === stream.id);
          const canAfford = balance >= stream.initialInvestment;
          const isLoadingThis = isLoading === stream.id;

          return (
            <div
              key={stream.id}
              className={`card ${riskColors[stream.riskLevel]} relative overflow-hidden`}
            >
              {/* Risk Badge */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-xs font-medium text-white">
                  {riskLabels[stream.riskLevel]}
                </span>
              </div>

              <div className="text-center">
                {/* Stream Icon */}
                <div className="text-4xl mb-4">{stream.icon}</div>

                {/* Stream Info */}
                <h4 className="text-lg font-bold text-white mb-2">{stream.name}</h4>
                <p className="text-white/80 text-sm mb-4">{stream.description}</p>

                {/* Investment Details */}
                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-purple-300 font-medium">Investimento</div>
                      <div className="text-white">{stream.initialInvestment} tokens</div>
                    </div>
                    <div>
                      <div className="text-purple-300 font-medium">Retorno Diário</div>
                      <div className="text-white">{stream.dailyReturn} tokens</div>
                    </div>
                    <div>
                      <div className="text-purple-300 font-medium">Duração</div>
                      <div className="text-white">{formatDuration(stream.duration)}</div>
                    </div>
                    <div>
                      <div className="text-purple-300 font-medium">ROI Anual</div>
                      <div className="text-white">
                        {Math.round((stream.dailyReturn * 365 / stream.initialInvestment) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invest Button */}
                {!hasActiveInvestment ? (
                  <button
                    onClick={() => handleInvest(stream)}
                    disabled={!canAfford || isLoadingThis}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoadingThis ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Investindo...
                      </>
                    ) : !canAfford ? (
                      'Saldo Insuficiente'
                    ) : (
                      <>
                        💰 Investir Agora
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full bg-green-600/20 text-green-400 font-medium py-2 px-4 rounded-lg text-center">
                    ✅ Investimento Ativo
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Investments */}
      {activeInvestments.length > 0 && (
        <div className="card">
          <h4 className="text-lg font-bold text-white mb-4">Meus Investimentos</h4>
          <div className="space-y-4">
            {activeInvestments.map((investment, index) => {
              const stream = incomeStreams.find(s => s.id === investment.streamId);
              if (!stream) return null;

              const pendingEarnings = calculatePendingEarnings(investment);
              const daysSinceStart = Math.floor((Date.now() - investment.startDate) / (24 * 60 * 60 * 1000));

              return (
                <div key={index} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stream.icon}</span>
                      <div>
                        <div className="text-white font-medium">{stream.name}</div>
                        <div className="text-white/60 text-sm">
                          Investido há {daysSinceStart} dias
                        </div>
                      </div>
                    </div>
                    {pendingEarnings > 0 && (
                      <button
                        onClick={() => handleClaimEarnings(index)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded-lg transition-colors"
                      >
                        Reivindicar {pendingEarnings}
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-purple-300 font-medium">Investimento</div>
                      <div className="text-white">{investment.investment} tokens</div>
                    </div>
                    <div>
                      <div className="text-purple-300 font-medium">Total Ganho</div>
                      <div className="text-white">{investment.totalEarned} tokens</div>
                    </div>
                    <div>
                      <div className="text-purple-300 font-medium">Pendente</div>
                      <div className="text-white">{pendingEarnings} tokens</div>
                    </div>
                  </div>
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
              ✅ Missão de Renda Passiva Concluída! Você completou todas as jornadas!
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 