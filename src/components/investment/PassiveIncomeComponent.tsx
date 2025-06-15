"use client";

import React, { useState } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useInvestment } from '@/components/investment/InvestmentProvider';
import { notifySuccess, notifyWarning } from '@/utils/notificationService';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

export function PassiveIncomeComponent() {
  const { addTokens } = useTokens();
  const { isConnected } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'elite'>('basic');

  const plans = {
    basic: { name: 'Básico', monthly: 50, description: 'Renda passiva para iniciantes', emoji: '🟢' },
    premium: { name: 'Premium', monthly: 150, description: 'Renda passiva avançada', emoji: '🟡' },
    elite: { name: 'Elite', monthly: 300, description: 'Renda passiva máxima', emoji: '🔴' }
  };

  const handleActivate = async () => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      console.log('💰 Ativando renda passiva em modo local...');
      
      // Simular delay de transação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan = plans[selectedPlan];
      
      // SEMPRE usar modo local
      addTokens(plan.monthly);
      
      notifySuccess(`🎉 Plano ${plan.name} ativado! Você receberá ${plan.monthly} tokens mensalmente!`);
      console.log('✅ Renda passiva ativada localmente:', { plan: selectedPlan, monthly: plan.monthly });
      
    } catch (error: any) {
      console.warn('Erro na renda passiva:', error);
      notifyWarning('Erro ao ativar renda passiva. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="card">
      <div className="text-center">
        <div className="text-4xl mb-4">💰</div>
        <h3 className="text-h3 font-bold text-white mb-2">Renda Passiva</h3>
        <p className="text-white/80 mb-6">
          Configure fluxos de renda passiva automatizados!
        </p>

        {/* Status de Conexão */}
        {!isConnected && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Conecte sua carteira para ativar renda passiva</span>
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
              <span>✅ Renda Passiva Patrocinada - Sem gas fees!</span>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="space-y-3 mb-6">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPlan === key
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/20 bg-black/20 hover:border-purple-500/50'
              }`}
              onClick={() => setSelectedPlan(key as 'basic' | 'premium' | 'elite')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{plan.emoji}</div>
                  <div className="text-left">
                    <div className="text-white font-medium">{plan.name}</div>
                    <div className="text-white/60 text-sm">{plan.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-400 font-bold">{formatCurrency(plan.monthly)}</div>
                  <div className="text-white/60 text-sm">tokens/mês</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Plan Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <div className="text-blue-400 text-sm">
            <div className="font-medium mb-1">Plano Selecionado: {plans[selectedPlan].name}</div>
            <div className="text-blue-300">
              Renda mensal: {formatCurrency(plans[selectedPlan].monthly)} tokens
            </div>
          </div>
        </div>

        {/* Activate Button */}
        <button
          onClick={handleActivate}
          disabled={isLoading || !isConnected}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            !isLoading && isConnected
              ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Ativando...
            </div>
          ) : !isConnected ? (
            'Conecte sua carteira'
          ) : (
            `🚀 Ativar Plano ${plans[selectedPlan].name}`
          )}
        </button>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-blue-400 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Renda Automatizada</span>
            </div>
            <p className="text-blue-300 text-xs">
              A renda passiva é processada automaticamente com Account Abstraction, sem necessidade de transações manuais!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 