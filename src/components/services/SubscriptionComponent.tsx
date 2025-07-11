"use client";

import React, { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useBlockchain } from '@/hooks/useBlockchain';
import { SUBSCRIPTION_PLANS } from '@/contracts/config';
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notificationService';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // em dias
  features: string[];
  icon: string;
  popular?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: SUBSCRIPTION_PLANS.MONTHLY.name,
    description: 'Acesso a funcionalidades essenciais premium',
    price: SUBSCRIPTION_PLANS.MONTHLY.price,
    duration: SUBSCRIPTION_PLANS.MONTHLY.duration,
    features: [
      'Acesso básico à plataforma',
      'Suporte por email',
      'Dashboard básico',
      'Até 5 transações por dia'
    ],
    icon: '📱'
  },
  {
    id: 'annual',
    name: SUBSCRIPTION_PLANS.ANNUAL.name,
    description: 'Melhor valor com desconto anual',
    price: SUBSCRIPTION_PLANS.ANNUAL.price,
    duration: SUBSCRIPTION_PLANS.ANNUAL.duration,
    features: [...SUBSCRIPTION_PLANS.ANNUAL.benefits],
    icon: '🚀',
    popular: true
  }
];

export function SubscriptionComponent() {
  const { balance, removeTokens } = useTokens();
  const { subscriptionOperations, tokenOperations, isLoading: blockchainLoading } = useBlockchain();
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Carregar assinatura ativa - OTIMIZADO
  useEffect(() => {
    let isMounted = true;

    const loadActiveSubscription = async () => {
      try {
        const subscription = await subscriptionOperations.getSubscription();
        if (isMounted) {
          setActiveSubscription(subscription);
        }
      } catch (error) {
        console.warn('Erro ao carregar assinatura ativa:', error);
      }
    };

    loadActiveSubscription();

    return () => {
      isMounted = false;
    };
  }, [subscriptionOperations]); // Added subscriptionOperations to dependencies

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (balance < plan.price || isLoading || activeSubscription || blockchainLoading) return;

    setIsLoading(plan.id);

    try {
      // Mapear ID local para planId do contrato
      const contractPlanId = plan.id === 'monthly' ? 1 : 2;
      
      // Primeiro aprovar tokens para o contrato de assinatura
      const approveResult = await tokenOperations.approve(
        "0x7890123456789012345678901234567890123456", // SUBSCRIPTION contract address
        plan.price.toString()
      );

      if (approveResult.success) {
        // Fazer assinatura no contrato
        const subscribeResult = await subscriptionOperations.subscribe(contractPlanId);
        
        if (subscribeResult.success) {
          // console.log('✅ Assinatura realizada via contrato:', subscribeResult.hash); // Dev log
          await removeTokens(plan.price); // removeTokens is async
          setActiveSubscription(plan.id);
          notifySuccess(`Assinatura do plano "${plan.name}" realizada com sucesso!`);
        } else {
          notifyError(`Falha na assinatura: ${subscribeResult.error?.message || 'Erro desconhecido'}`);
          throw new Error(subscribeResult.error?.message || 'Falha na assinatura');
        }
      } else {
        notifyError(`Falha ao aprovar tokens para assinatura: ${approveResult.error?.message || 'Erro desconhecido'}`);
        throw new Error(approveResult.error?.message || 'Falha na aprovação');
      }
    } catch (error) {
      // console.error('Erro ao assinar plano:', error); // Original error
      notifyWarning(`Ocorreu um erro ao assinar o plano "${plan.name}". Usando simulação.`);
      // Fallback to simulation
      try {
        // console.warn('⚠️ Usando simulação de assinatura'); // Dev log
        await new Promise(resolve => setTimeout(resolve, 2000));

        await removeTokens(plan.price); // removeTokens is async
        setActiveSubscription(plan.id);
        notifySuccess(`Assinatura do plano "${plan.name}" (simulada) realizada com sucesso!`);
      } catch (fallbackError) {
        // console.error('Erro no fallback da assinatura:', fallbackError); // Dev log
        notifyError(`Falha ao assinar o plano "${plan.name}" mesmo com simulação.`);
      }
    } finally {
      setIsLoading(null);
    }
  };

  const getActivePlan = () => {
    return subscriptionPlans.find(plan => plan.id === activeSubscription);
  };

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
              {getActivePlan()?.name} - {getActivePlan()?.id === 'monthly' ? 'Mensal' : 'Anual'}
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
                    {plan.id === 'monthly' ? 'por mês' : 'por ano'}
                  </div>
                  {plan.id === 'annual' && (
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
    </div>
  );
} 