"use client";

import React, { useState } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useJourney } from './JourneyProvider';

export function FaucetComponent() {
  const { addTokens } = useTokens();
  const { journey, completeMission } = useJourney();
  const [isLoading, setIsLoading] = useState(false);
  const [lastClaim, setLastClaim] = useState<number | null>(null);

  const faucetMission = journey.missions.find(m => m.id === 'faucet');
  const isUnlocked = faucetMission?.unlocked || false;
  const isCompleted = faucetMission?.completed || false;

  const canClaim = () => {
    if (!lastClaim) return true;
    const now = Date.now();
    const timeDiff = now - lastClaim;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas
    return timeDiff >= cooldownTime;
  };

  const getTimeUntilNextClaim = () => {
    if (!lastClaim) return null;
    const now = Date.now();
    const timeDiff = now - lastClaim;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas
    const remaining = cooldownTime - timeDiff;
    
    if (remaining <= 0) return null;
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  const handleClaim = async () => {
    if (!canClaim() || isLoading) return;

    setIsLoading(true);
    
    try {
      // Simular delay da transação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Adicionar tokens
      addTokens(5);
      setLastClaim(Date.now());
      
      // Completar missão se for a primeira vez
      if (!isCompleted) {
        completeMission('faucet');
      }
    } catch (error) {
      console.error('Erro ao reivindicar tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-h3 font-bold text-white mb-2">Faucet Bloqueado</h3>
          <p className="text-white/80">Complete a missão de login para desbloquear o faucet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center">
        <div className="text-4xl mb-4">🚰</div>
        <h3 className="text-h3 font-bold text-white mb-2">Token Faucet</h3>
        <p className="text-white/80 mb-6">
          Reivindique tokens gratuitos a cada 24 horas!
        </p>

        {/* Faucet Stats */}
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-purple-300 font-medium">Recompensa</div>
              <div className="text-white">5 Tokens</div>
            </div>
            <div>
              <div className="text-purple-300 font-medium">Cooldown</div>
              <div className="text-white">24 horas</div>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        {canClaim() ? (
          <button
            onClick={handleClaim}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processando...
              </>
            ) : (
              <>
                🪙 Reivindicar Tokens
              </>
            )}
          </button>
        ) : (
          <div className="w-full bg-gray-600/20 text-gray-400 font-medium py-3 px-6 rounded-lg text-center">
            Próxima reivindicação em: {getTimeUntilNextClaim()}
          </div>
        )}

        {/* Mission Status */}
        {isCompleted && (
          <div className="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-3">
            <div className="text-green-400 text-sm font-medium">
              ✅ Missão Concluída! Você pode continuar usando o faucet diariamente.
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 