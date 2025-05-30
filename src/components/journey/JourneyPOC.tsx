"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  completed: boolean;
  unlocked: boolean;
  reward: {
    type: 'tokens' | 'nft' | 'access' | 'feature';
    amount?: number;
    description: string;
  };
}

interface UserProgress {
  currentMissionIndex: number;
  completedMissions: string[];
  totalTokens: number;
  unlockedFeatures: string[];
}

const initialMissions: Mission[] = [
  {
    id: 'login',
    title: '🔐 Conectar Carteira',
    description: 'Faça login conectando sua carteira Ethereum para começar sua jornada',
    icon: '🔐',
    action: 'Conectar Carteira',
    completed: false,
    unlocked: true,
    reward: {
      type: 'tokens',
      amount: 10,
      description: '10 tokens de boas-vindas + Acesso ao Faucet'
    }
  },
  {
    id: 'faucet',
    title: '🚰 Usar Faucet',
    description: 'Obtenha tokens gratuitos do faucet para começar a experimentar a plataforma',
    icon: '🚰',
    action: 'Receber Tokens',
    completed: false,
    unlocked: false,
    reward: {
      type: 'tokens',
      amount: 25,
      description: '25 tokens do faucet + Acesso ao Staking'
    }
  },
  {
    id: 'stake',
    title: '📈 Fazer Stake',
    description: 'Invista seus tokens para ganhar recompensas e desbloquear funcionalidades avançadas',
    icon: '📈',
    action: 'Stakear Tokens',
    completed: false,
    unlocked: false,
    reward: {
      type: 'feature',
      description: 'Acesso ao Marketplace de NFTs + 5% de rendimento'
    }
  },
  {
    id: 'buy-nft',
    title: '🎨 Comprar NFT',
    description: 'Adquira seu primeiro NFT na plataforma e entre para a comunidade exclusiva',
    icon: '🎨',
    action: 'Comprar NFT',
    completed: false,
    unlocked: false,
    reward: {
      type: 'nft',
      description: 'NFT de Membro + Acesso a Airdrops Exclusivos'
    }
  },
  {
    id: 'airdrop',
    title: '🎁 Receber Airdrop',
    description: 'Participe de um airdrop exclusivo da comunidade de holders de NFT',
    icon: '🎁',
    action: 'Receber Airdrop',
    completed: false,
    unlocked: false,
    reward: {
      type: 'tokens',
      amount: 50,
      description: '50 tokens de airdrop + Acesso a Assinaturas Premium'
    }
  },
  {
    id: 'subscription',
    title: '💳 Fazer Assinatura',
    description: 'Assine um plano premium mensal ou anual para acessar funcionalidades exclusivas',
    icon: '💳',
    action: 'Assinar Premium',
    completed: false,
    unlocked: false,
    reward: {
      type: 'access',
      description: 'Acesso Premium + Renda Passiva Desbloqueada'
    }
  },
  {
    id: 'passive-income',
    title: '💰 Renda Passiva',
    description: 'Configure sua primeira fonte de renda passiva e complete sua jornada',
    icon: '💰',
    action: 'Ativar Renda Passiva',
    completed: false,
    unlocked: false,
    reward: {
      type: 'tokens',
      amount: 100,
      description: '100 tokens de recompensa final + Status VIP'
    }
  }
];

export function JourneyPOC() {
  const { isConnected, user } = usePrivyAuth();
  
  const [progress, setProgress] = useState<UserProgress>({
    currentMissionIndex: 0,
    completedMissions: [],
    totalTokens: 0,
    unlockedFeatures: []
  });

  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [showCelebration, setShowCelebration] = useState(false);

  // Carregar progresso do localStorage
  useEffect(() => {
    if (user?.wallet?.address) {
      const savedProgress = localStorage.getItem(`journey_poc_${user.wallet.address}`);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed);
        
        // Atualizar estado das missões baseado no progresso salvo
        const updatedMissions = initialMissions.map((mission, index) => ({
          ...mission,
          completed: parsed.completedMissions.includes(mission.id),
          unlocked: index <= parsed.currentMissionIndex
        }));
        setMissions(updatedMissions);
      }
    }
  }, [user?.wallet?.address]);

  // Salvar progresso no localStorage
  useEffect(() => {
    if (user?.wallet?.address) {
      localStorage.setItem(`journey_poc_${user.wallet.address}`, JSON.stringify(progress));
    }
  }, [progress, user?.wallet?.address]);

  // Implementações reais das missões
  const executeMissionAction = useCallback(async (missionId: string): Promise<boolean> => {
    try {
      switch (missionId) {
        case 'login':
          return true;
        case 'faucet':
          window.location.hash = '#faucet';
          return true;
        case 'stake':
          window.location.hash = '#staking';
          return true;
        case 'buy-nft':
          window.location.hash = '#nft-marketplace';
          return true;
        case 'airdrop':
          window.location.hash = '#airdrop';
          return true;
        case 'subscription':
          window.location.hash = '#subscription';
          return true;
        case 'passive-income':
          window.location.hash = '#passive-income';
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error(`Erro ao executar missão ${missionId}:`, error);
      return false;
    }
  }, []);

  const handleMissionComplete = useCallback(async (missionId: string) => {
    const missionIndex = missions.findIndex(m => m.id === missionId);
    const mission = missions[missionIndex];
    if (!mission || mission.completed) return;
    // Executar ação real da missão
    const success = await executeMissionAction(missionId);
    if (!success) {
      console.error(`Falha ao executar missão: ${missionId}`);
      return;
    }
    // Atualizar progresso
    const newCompletedMissions = [...progress.completedMissions, missionId];
    const newCurrentIndex = Math.min(progress.currentMissionIndex + 1, missions.length - 1);
    let tokensEarned = 0;
    if (mission.reward.type === 'tokens' && mission.reward.amount) {
      tokensEarned = mission.reward.amount;
    }
    const newProgress = {
      ...progress,
      currentMissionIndex: newCurrentIndex,
      completedMissions: newCompletedMissions,
      totalTokens: progress.totalTokens + tokensEarned,
      unlockedFeatures: [...progress.unlockedFeatures, missionId]
    };
    setProgress(newProgress);
    // Atualizar missões
    const updatedMissions = missions.map((m, index) => ({
      ...m,
      completed: newCompletedMissions.includes(m.id),
      unlocked: index <= newCurrentIndex
    }));
    setMissions(updatedMissions);
    // Mostrar celebração
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  }, [missions, progress, executeMissionAction]);

  // Auto-completar login quando conectado
  useEffect(() => {
    if (isConnected && !progress.completedMissions.includes('login')) {
      handleMissionComplete('login');
    }
  }, [isConnected, handleMissionComplete, progress.completedMissions]);

  const resetJourney = () => {
    const resetProgress = {
      currentMissionIndex: 0,
      completedMissions: [],
      totalTokens: 0,
      unlockedFeatures: []
    };
    
    setProgress(resetProgress);
    setMissions(initialMissions.map((mission, index) => ({
      ...mission,
      completed: false,
      unlocked: index === 0
    })));

    if (user?.wallet?.address) {
      localStorage.removeItem(`journey_poc_${user.wallet.address}`);
    }
  };

  const progressPercentage = (progress.completedMissions.length / missions.length) * 100;
  const isJourneyComplete = progress.completedMissions.length === missions.length;

  if (!isConnected) {
    return (
      <section className="section-spacing">
        <div className="container-responsive">
          <div className="text-center">
            <h2 className="text-h2 font-bold text-white mb-4">🚀 Jornada Progressiva - POC</h2>
            <p className="text-white/80 text-body-lg mb-8">
              Conecte sua carteira para começar uma jornada gamificada e desbloquear funcionalidades!
            </p>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-h3 font-bold text-white mb-2">Primeira Missão</h3>
              <p className="text-white/80 mb-4">Conecte sua carteira para ganhar 10 tokens de boas-vindas!</p>
              <div className="bg-purple-600/20 text-purple-300 text-sm font-medium py-2 px-4 rounded-lg">
                🎁 Recompensa: 10 tokens + Acesso ao Faucet
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing">
      <div className="container-responsive">
        {/* Header com Stats */}
        <div className="text-center mb-12">
          <h2 className="text-h2 font-bold text-white mb-4">🚀 Sua Jornada Progressiva</h2>
          <p className="text-white/80 text-body-lg mb-8">
            Complete missões sequenciais para desbloquear novas funcionalidades!
          </p>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="card text-center bg-purple-500/20 border-purple-500/30">
              <div className="text-h2 font-bold text-purple-400 mb-2">{progress.completedMissions.length}</div>
              <div className="text-white/80 text-body-sm">Missões Concluídas</div>
            </div>
            <div className="card text-center bg-green-500/20 border-green-500/30">
              <div className="text-h2 font-bold text-green-400 mb-2">{progress.totalTokens}</div>
              <div className="text-white/80 text-body-sm">Tokens Ganhos</div>
            </div>
            <div className="card text-center bg-blue-500/20 border-blue-500/30">
              <div className="text-h2 font-bold text-blue-400 mb-2">{progress.unlockedFeatures.length}</div>
              <div className="text-white/80 text-body-sm">Funcionalidades</div>
            </div>
            <div className="card text-center bg-pink-500/20 border-pink-500/30">
              <div className="text-h2 font-bold text-pink-400 mb-2">{Math.round(progressPercentage)}%</div>
              <div className="text-white/80 text-body-sm">Progresso</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-white/60 text-sm mt-2">
              {progress.completedMissions.length} de {missions.length} missões concluídas
            </div>
          </div>
        </div>

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-4 px-8 rounded-xl animate-bounce">
              🎉 Missão Concluída! 🎉
            </div>
          </div>
        )}

        {/* Journey Complete */}
        {isJourneyComplete && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-8 mb-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-h2 font-bold text-white mb-4">Parabéns! Jornada Completa!</h3>
            <p className="text-white/80 text-body-lg mb-6">
              Você completou todas as missões e desbloqueou todas as funcionalidades da plataforma!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-green-600/20 text-green-400 font-medium py-3 px-6 rounded-lg">
                💰 Total Ganho: {progress.totalTokens} tokens
              </div>
              <button
                onClick={resetJourney}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                🔄 Reiniciar Jornada
              </button>
            </div>
          </div>
        )}

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission, index) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              index={index}
              onComplete={() => handleMissionComplete(mission.id)}
              isNext={index === progress.currentMissionIndex && !mission.completed}
            />
          ))}
        </div>

        {/* Debug Info (remover em produção) */}
        <div className="mt-12 p-4 bg-gray-800/50 rounded-lg text-xs text-gray-400">
          <details>
            <summary className="cursor-pointer">Debug Info (POC)</summary>
            <pre className="mt-2">{JSON.stringify({ progress, missions: missions.map(m => ({ id: m.id, completed: m.completed, unlocked: m.unlocked })) }, null, 2)}</pre>
          </details>
        </div>
      </div>
    </section>
  );
}

interface MissionCardProps {
  mission: Mission;
  index: number;
  onComplete: () => void;
  isNext: boolean;
}

function MissionCard({ mission, index, onComplete, isNext }: MissionCardProps) {
  const getCardStyle = () => {
    if (mission.completed) {
      return 'bg-green-500/20 border-green-500/30 shadow-green-500/20';
    }
    if (isNext) {
      return 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-500/50 shadow-purple-500/30 animate-pulse';
    }
    if (mission.unlocked) {
      return 'bg-purple-500/20 border-purple-500/30 shadow-purple-500/20';
    }
    return 'bg-gray-500/20 border-gray-500/30 opacity-60';
  };

  const getStatusIcon = () => {
    if (mission.completed) return '✅';
    if (mission.unlocked) return '🔓';
    return '🔒';
  };

  const getButtonText = () => {
    if (mission.completed) return 'Concluída!';
    if (mission.unlocked) return mission.action;
    return 'Bloqueada';
  };

  const getButtonStyle = () => {
    if (mission.completed) {
      return 'bg-green-600/20 text-green-400 cursor-default';
    }
    if (mission.unlocked) {
      return isNext 
        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
        : 'bg-purple-600 hover:bg-purple-700 text-white';
    }
    return 'bg-gray-600/20 text-gray-400 cursor-not-allowed';
  };

  return (
    <div className={`card card-hover ${getCardStyle()} relative overflow-hidden transition-all duration-300`}>
      {/* Mission Number */}
      <div className="absolute top-4 left-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white text-sm font-bold">
        {index + 1}
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4 text-2xl">
        {getStatusIcon()}
      </div>

      {/* Next Mission Indicator */}
      {isNext && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold py-1 px-3 rounded-full">
          PRÓXIMA
        </div>
      )}

      {/* Mission Content */}
      <div className="pt-12">
        {/* Mission Icon */}
        <div className="text-5xl mb-4 text-center">{mission.icon}</div>

        {/* Mission Info */}
        <h3 className="text-h3 font-bold text-white mb-3 text-center">{mission.title}</h3>
        <p className="text-white/80 text-body mb-6 text-center leading-relaxed">{mission.description}</p>

        {/* Reward */}
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <div className="text-sm text-purple-300 font-medium mb-2 text-center">🎁 Recompensa:</div>
          <div className="text-white text-sm text-center">{mission.reward.description}</div>
        </div>

        {/* Action Button */}
        <button
          onClick={mission.unlocked && !mission.completed ? onComplete : undefined}
          disabled={!mission.unlocked || mission.completed}
          className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-300 ${getButtonStyle()}`}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
} 