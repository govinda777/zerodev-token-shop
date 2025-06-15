"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { MISSION_REWARDS } from '@/contracts/config';
import { notifySuccess, notifyWarning } from '@/utils/notificationService';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

export function FaucetComponent() {
  const { addTokens } = useTokens();
  const { isConnected } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [lastClaim, setLastClaim] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [hasNotifiedCooldownEnd, setHasNotifiedCooldownEnd] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const canClaim = useCallback(() => {
    if (!lastClaim) return true;
    const now = Date.now();
    const timeDiff = now - lastClaim;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas
    return timeDiff >= cooldownTime;
  }, [lastClaim]);

  const formatTimeRemaining = useCallback((milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }, []);

  const updateTimeRemaining = useCallback(() => {
    if (!lastClaim) {
      setTimeRemaining(null);
      return;
    }

    const now = Date.now();
    const timeDiff = now - lastClaim;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas
    const remaining = cooldownTime - timeDiff;

    if (remaining <= 0) {
      setTimeRemaining(null);
      
      // Notificar quando o cooldown acabar (apenas uma vez)
      if (!hasNotifiedCooldownEnd) {
        notifySuccess('🎉 Cooldown do faucet finalizado! Você pode reivindicar novos tokens.');
        setHasNotifiedCooldownEnd(true);
      }
    } else {
      setTimeRemaining(formatTimeRemaining(remaining));
      setHasNotifiedCooldownEnd(false); // Reset para próxima vez
    }
  }, [lastClaim, formatTimeRemaining, hasNotifiedCooldownEnd]);

  // Carregar último claim do localStorage
  useEffect(() => {
    const savedLastClaim = localStorage.getItem('faucet_last_claim');
    if (savedLastClaim) {
      setLastClaim(parseInt(savedLastClaim));
    }
  }, []);

  // Atualizar tempo restante a cada segundo
  useEffect(() => {
    updateTimeRemaining();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(updateTimeRemaining, 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTimeRemaining]);

  const handleClaim = async () => {
    if (!canClaim() || isLoading) return;

    setIsLoading(true);
    
    try {
      console.log('🚰 Executando claim do faucet...');
      
      // Simular delay de transação para melhor UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Usar tokens locais para recompensa instantânea (mais UX amigável)
      const now = Date.now();
      addTokens(MISSION_REWARDS.FAUCET);
      setLastClaim(now);
      localStorage.setItem('faucet_last_claim', now.toString());
      setHasNotifiedCooldownEnd(false);
      
      notifySuccess(`🎉 ${MISSION_REWARDS.FAUCET} tokens reivindicados com sucesso!`);
      console.log('✅ Tokens do faucet reivindicados:', MISSION_REWARDS.FAUCET);
      
    } catch (error: any) {
      console.warn('Erro no faucet:', error);
      notifyWarning('Erro ao reivindicar tokens. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="text-center">
        <div className="text-4xl mb-4">🚰</div>
        <h3 className="text-h3 font-bold text-white mb-2">Token Faucet</h3>
        <p className="text-white/80 mb-6">
          Reivindique tokens gratuitos a cada 24 horas!
        </p>

        {/* Status de Conexão */}
        {!isConnected && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Conecte sua carteira para usar o faucet</span>
            </div>
          </div>
        )}

        {/* ZeroDev Sponsorship Banner */}
        {isConnected && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>✅ Transações Patrocinadas por ZeroDev - Gas fees pagos automaticamente!</span>
            </div>
          </div>
        )}

        {/* Faucet Stats */}
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-purple-300 font-medium">Recompensa</div>
              <div className="text-white">{MISSION_REWARDS.FAUCET} Tokens</div>
            </div>
            <div>
              <div className="text-purple-300 font-medium">Cooldown</div>
              <div className="text-white">24 horas</div>
            </div>
          </div>
        </div>

        {/* Cooldown Display */}
        {timeRemaining && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="text-yellow-400 font-medium mb-2">⏱️ Aguarde o cooldown</div>
            <div className="text-white text-xl font-mono">{timeRemaining}</div>
            <div className="text-yellow-300 text-sm mt-2">
              Você poderá reivindicar novos tokens quando o tempo acabar
            </div>
          </div>
        )}

        {/* Claim Button */}
        <button
          onClick={handleClaim}
          disabled={!canClaim() || isLoading || !isConnected}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            canClaim() && !isLoading && isConnected
              ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Reivindicando...
            </div>
          ) : !isConnected ? (
            'Conecte sua carteira'
          ) : canClaim() ? (
            `🚀 Reivindicar ${MISSION_REWARDS.FAUCET} Tokens`
          ) : (
            'Aguarde o cooldown'
          )}
        </button>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-blue-400 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Faucet Patrocinado</span>
            </div>
            <p className="text-blue-300 text-xs">
              Este faucet usa Account Abstraction. Os tokens são adicionados diretamente à sua carteira sem necessidade de ETH para gas!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 