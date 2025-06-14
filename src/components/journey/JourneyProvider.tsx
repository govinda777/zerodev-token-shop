"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Mission, UserJourney, JourneyContextType } from '@/types/journey';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useTokens } from '@/hooks/useTokens';

const JourneyContext = createContext<JourneyContextType | null>(null);

const initialMissions: Mission[] = [
  {
    id: 'login',
    title: 'Conectar Carteira',
    description: 'Faça login conectando sua carteira Ethereum',
    icon: '🔐',
    completed: false,
    unlocked: true,
    reward: {
      type: 'tokens',
      amount: 10,
      description: '10 tokens de boas-vindas'
    }
  },
  {
    id: 'faucet',
    title: 'Usar Faucet',
    description: 'Obtenha tokens gratuitos do faucet',
    icon: '🚰',
    completed: false,
    unlocked: false,
    reward: {
      type: 'tokens',
      amount: 5,
      description: '5 tokens do faucet'
    },
    requirements: ['login']
  },
  {
    id: 'stake',
    title: 'Fazer Stake',
    description: 'Invista seus tokens para ganhar recompensas',
    icon: '📈',
    completed: false,
    unlocked: false,
    reward: {
      type: 'access',
      description: 'Acesso a investimentos avançados'
    },
    requirements: ['faucet']
  },
  {
    id: 'buy-nft',
    title: 'Comprar NFT',
    description: 'Adquira seu primeiro NFT na plataforma',
    icon: '🎨',
    completed: false,
    unlocked: false,
    reward: {
      type: 'nft',
      description: 'NFT de participação especial'
    },
    requirements: ['stake']
  },
  {
    id: 'airdrop',
    title: 'Receber Airdrop',
    description: 'Participe de um airdrop da comunidade',
    icon: '🎁',
    completed: false,
    unlocked: false,
    reward: {
      type: 'tokens',
      amount: 20,
      description: '20 tokens de airdrop'
    },
    requirements: ['buy-nft']
  },
  {
    id: 'subscription',
    title: 'Fazer Assinatura',
    description: 'Assine um plano mensal ou anual',
    icon: '💳',
    completed: false,
    unlocked: false,
    reward: {
      type: 'access',
      description: 'Acesso a funcionalidades premium'
    },
    requirements: ['airdrop']
  },
  {
    id: 'passive-income',
    title: 'Renda Passiva',
    description: 'Configure sua primeira fonte de renda passiva',
    icon: '💰',
    completed: false,
    unlocked: false,
    reward: {
      type: 'tokens',
      amount: 50,
      description: '50 tokens de recompensa final'
    },
    requirements: ['subscription']
  }
];

interface JourneyProviderProps {
  children: ReactNode;
}

export function JourneyProvider({ children }: JourneyProviderProps) {
  const { isConnected, user } = usePrivyAuth();
  const { addTokens } = useTokens();
  
  const [journey, setJourney] = useState<UserJourney>({
    currentStep: 0,
    missions: initialMissions,
    totalTokensEarned: 0,
    completedMissions: []
  });

  const completeMission = useCallback((missionId: string) => {
    // Verificar se já foi completada antes de fazer qualquer coisa
    setJourney(prev => {
      if (prev.completedMissions.includes(missionId)) {
        return prev; // Já completada
      }
      
      // Buscar a missão para pegar a recompensa
      const mission = prev.missions.find(m => m.id === missionId);
      
      const updatedMissions = prev.missions.map(mission => {
        if (mission.id === missionId) {
          return { ...mission, completed: true };
        }
        return mission;
      });
      
      // Desbloquear próximas missões
      const unlockedMissions = updatedMissions.map(mission => {
        if (mission.requirements) {
          const allRequirementsMet = mission.requirements.every(req => 
            [...prev.completedMissions, missionId].includes(req)
          );
          return { ...mission, unlocked: allRequirementsMet };
        }
        return mission;
      });
      
      const newCompletedMissions = [...prev.completedMissions, missionId];
      const tokensFromMission = mission?.reward?.amount || 0;
      
      // Dar recompensa APÓS a atualização do estado
      if (mission?.reward?.type === 'tokens' && mission.reward.amount) {
        setTimeout(() => {
          addTokens(mission.reward!.amount!);
        }, 0);
      }
      
      return {
        ...prev,
        missions: unlockedMissions,
        completedMissions: newCompletedMissions,
        currentStep: newCompletedMissions.length,
        totalTokensEarned: prev.totalTokensEarned + tokensFromMission
      };
    });
  }, [addTokens]);

  // Carregar progresso do localStorage
  useEffect(() => {
    if (user?.wallet?.address) {
      const savedJourney = localStorage.getItem(`journey_${user.wallet.address}`);
      if (savedJourney) {
        const parsed = JSON.parse(savedJourney);
        setJourney(parsed);
      }
    }
  }, [user?.wallet?.address]);

  // Salvar progresso no localStorage
  useEffect(() => {
    if (user?.wallet?.address) {
      localStorage.setItem(`journey_${user.wallet.address}`, JSON.stringify(journey));
    }
  }, [journey, user?.wallet?.address]);

  // Verificar se o login foi completado
  useEffect(() => {
    if (isConnected && !journey.completedMissions.includes('login')) {
      // Atrasa a execução para evitar setState durante render
      setTimeout(() => {
        completeMission('login');
      }, 0);
    }
  }, [isConnected, completeMission, journey.completedMissions]);

  const checkMissionRequirements = (missionId: string): boolean => {
    const mission = journey.missions.find(m => m.id === missionId);
    if (!mission?.requirements) return true;
    
    return mission.requirements.every(req => 
      journey.completedMissions.includes(req)
    );
  };

  const getNextAvailableMission = (): Mission | null => {
    return journey.missions.find(mission => 
      mission.unlocked && !mission.completed
    ) || null;
  };

  const resetJourney = () => {
    setJourney({
      currentStep: 0,
      missions: initialMissions,
      totalTokensEarned: 0,
      completedMissions: []
    });
    
    if (user?.wallet?.address) {
      localStorage.removeItem(`journey_${user.wallet.address}`);
    }
  };

  const contextValue: JourneyContextType = {
    journey,
    completeMission,
    checkMissionRequirements,
    getNextAvailableMission,
    resetJourney
  };

  return (
    <JourneyContext.Provider value={contextValue}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney(): JourneyContextType {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
} 