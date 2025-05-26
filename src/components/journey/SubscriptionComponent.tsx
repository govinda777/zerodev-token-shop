"use client";

import React, { useState } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useJourney } from './JourneyProvider';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: 'monthly' | 'annual';
  features: string[];
  icon: string;
  popular?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Básico Mensal',
    description: 'Acesso a funcionalidades essenciais',
    price: 25,
    duration: 'monthly',
    icon: '📦',
    features: [
      'Acesso a faucet premium',
      'Suporte por email',
      'Dashboard básico',
      'Histórico de 30 dias'
    ]
  },
  {
    id: 'premium-monthly',
    name: 'Premium Mensal',
    description: 'Funcionalidades avançadas e benefícios extras',
    price: 50,
    duration: 'monthly',
    icon: '⭐',
    popular: true,
    features: [
      'Todos os recursos básicos',
      'Staking com bônus +15%',
      'Acesso a NFTs exclusivos',
      'Suporte prioritário',
      'Analytics avançados',
      'Airdrops exclusivos'
    ]
  },
  {
    id: 'premium-annual',
    name: 'Premium Anual',
    description: 'Melhor valor com desconto anual',
    price: 500,
    duration: 'annual',
    icon: '👑',
    features: [
      'Todos os recursos premium',
      'Desconto de 17% (2 meses grátis)',
      'NFT exclusivo de aniversário',
      'Acesso beta a novos recursos',
      'Consultoria personalizada',
      'Renda passiva premium'
    ]
  }
];

export function SubscriptionComponent() {
  const { balance, removeTokens } = useTokens();
  const { journey, completeMission } = useJourney();
  const [activeSubscription, setActiveSubscription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const subscriptionMission = journey.missions.find(m => m.id === 'subscription');
  const isUnlocked = subscriptionMission?.unlocked || false;
  const isCompleted = subscriptionMission?.completed || false;

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (balance < plan.price || isLoading || activeSubscription) return;

    setIsLoading(plan.id);

    try {
      // Simular delay da transação
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Gastar tokens
      removeTokens(plan.price);
      setActiveSubscription(plan.id);

      // Completar missão se for a primeira vez
      if (!isCompleted) {
        completeMission('subscription');
      }
    } catch (error) {
      console.error('Erro ao assinar plano:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const getActivePlan = () => {
    return subscriptionPlans.find(plan => plan.id === activeSubscription);
  };

  if (!isUnlocked) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-h3 font-bold text-white mb-2">Assinaturas Bloqueadas</h3>
          <p className="text-white/80">Complete a missão de airdrop para desbloquear assinaturas premium.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card text-center">
        <div className="text-4xl mb-4">💳</div>
        <h3 className="text-h3 font-bold text-white mb-2">Assinaturas Premium</h3>
        <p className="text-white/80 mb-4">
          Desbloqueie funcionalidades exclusivas com nossos planos premium!
        </p>
        
        {/* Current Subscription */}
        {activeSubscription && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-medium mb-2">✅ Assinatura Ativa</div>
            <div className="text-white">
              {getActivePlan()?.name} - {getActivePlan()?.duration === 'monthly' ? 'Mensal' : 'Anual'}
            </div>
          </div>
        )}
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const isActive = activeSubscription === plan.id;
          const canAfford = balance >= plan.price;
          const isLoadingThis = isLoading === plan.id;

          return (
            <div
              key={plan.id}
              className={`card relative overflow-hidden ${
                plan.popular ? 'border-purple-500/50 bg-purple-500/10' : 
                isActive ? 'border-green-500/50 bg-green-500/10' :
                'border-gray-500/30'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && !isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-1 rounded-b-lg">
                  Mais Popular
                </div>
              )}

              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-b-lg">
                  Ativo
                </div>
              )}

              <div className="text-center pt-6">
                {/* Plan Icon */}
                <div className="text-4xl mb-4">{plan.icon}</div>

                {/* Plan Info */}
                <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                <p className="text-white/80 text-sm mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {plan.price} Tokens
                  </div>
                  <div className="text-white/60 text-sm">
                    {plan.duration === 'monthly' ? 'por mês' : 'por ano'}
                  </div>
                  {plan.duration === 'annual' && (
                    <div className="text-green-400 text-xs mt-1">
                      Economize 17%!
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="bg-black/20 rounded-lg p-4 mb-6 text-left">
                  <div className="text-sm text-purple-300 font-medium mb-3">Recursos inclusos:</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                        <span className="text-green-400 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subscribe Button */}
                {!activeSubscription ? (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!canAfford || isLoadingThis}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoadingThis ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processando...
                      </>
                    ) : !canAfford ? (
                      'Saldo Insuficiente'
                    ) : (
                      <>
                        💳 Assinar Agora
                      </>
                    )}
                  </button>
                ) : isActive ? (
                  <div className="w-full bg-green-600/20 text-green-400 font-medium py-3 px-6 rounded-lg text-center">
                    ✅ Plano Ativo
                  </div>
                ) : (
                  <div className="w-full bg-gray-600/20 text-gray-400 font-medium py-3 px-6 rounded-lg text-center">
                    Já possui assinatura
                  </div>
                )}

                {/* Validation Message */}
                {!canAfford && !activeSubscription && (
                  <div className="text-red-400 text-sm mt-2">
                    Saldo insuficiente. Você precisa de {plan.price - balance} tokens a mais.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="card">
        <h4 className="text-lg font-bold text-white mb-4">Por que assinar?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-white font-medium text-sm">Recursos Exclusivos</div>
            <div className="text-white/60 text-xs">Acesso a funcionalidades premium</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-white font-medium text-sm">Maiores Recompensas</div>
            <div className="text-white/60 text-xs">Bônus em staking e airdrops</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎨</div>
            <div className="text-white font-medium text-sm">NFTs Exclusivos</div>
            <div className="text-white/60 text-xs">Coleções limitadas para assinantes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🛠️</div>
            <div className="text-white font-medium text-sm">Suporte Premium</div>
            <div className="text-white/60 text-xs">Atendimento prioritário</div>
          </div>
        </div>
      </div>

      {/* Mission Status */}
      {isCompleted && (
        <div className="card">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-medium text-center">
              ✅ Missão de Assinatura Concluída! Você desbloqueou renda passiva.
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 