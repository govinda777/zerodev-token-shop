"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useJourney } from './JourneyProvider';
import { useBlockchain } from '@/hooks/useBlockchain';
import { MISSION_REWARDS } from '@/contracts/config';
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notificationService';

export function FaucetComponent() {
  const { addTokens } = useTokens();
  const { journey, completeMission } = useJourney();
  const { faucetOperations, isLoading: blockchainLoading } = useBlockchain();
  const [isLoading, setIsLoading] = useState(false);
  const [lastClaim, setLastClaim] = useState<number | null>(null);
  const [canClaimFromContract, setCanClaimFromContract] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [hasNotifiedCooldownEnd, setHasNotifiedCooldownEnd] = useState(false);

  const faucetMission = journey.missions.find(m => m.id === 'faucet');
  const isUnlocked = faucetMission?.unlocked || false;
  const isCompleted = faucetMission?.completed || false;

  const canClaim = useCallback(() => {
    // Usar verificação do contrato se disponível, senão usar lógica local
    if (canClaimFromContract !== undefined) {
      return canClaimFromContract;
    }
    if (!lastClaim) return true;
    const now = Date.now();
    const timeDiff = now - lastClaim;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas
    return timeDiff >= cooldownTime;
  }, [canClaimFromContract, lastClaim]);

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
      // Quando o cooldown acabar, atualizar o estado para permitir novo claim
      setCanClaimFromContract(true);
      
      // Notificar apenas uma vez que o cooldown acabou
      if (!hasNotifiedCooldownEnd) {
        notifySuccess('🎉 Faucet liberado! Você pode reivindicar novos tokens agora.');
        setHasNotifiedCooldownEnd(true);
      }
      return;
    }
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }, [lastClaim]);

  // Timer para atualizar o countdown a cada segundo
  useEffect(() => {
    if (!lastClaim || canClaim()) {
      setTimeRemaining(null);
      return;
    }

    // Atualizar imediatamente
    updateTimeRemaining();

    // Configurar interval para atualizar a cada segundo
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [lastClaim, canClaim, updateTimeRemaining]);

  // Verificar se pode reivindicar do contrato e se já usou o faucet antes
  useEffect(() => {
    const checkCanClaim = async () => {
      try {
        const canClaimResult = await faucetOperations.canClaim();
        setCanClaimFromContract(canClaimResult);
        
        // Obter último claim do contrato
        const lastClaimTime = await faucetOperations.getLastClaim();
        if (lastClaimTime > 0) {
          // useBlockchain.getLastClaim() já retorna em milliseconds para consistência
          setLastClaim(lastClaimTime);
          
          // Se o usuário já usou o faucet antes E a missão não está completa, marcar como completa
          if (!isCompleted) {
            console.log('🎯 Usuário já usou o faucet antes, completando missão...');
            completeMission('faucet');
          }
        }
      } catch (error) {
        // console.error('Erro ao verificar faucet:', error);
        // Fallback para lógica local se contrato não estiver disponível
        // Potentially notifyError("Não foi possível verificar o estado do faucet no contrato.") if this check is critical for UX
        setCanClaimFromContract(canClaim());
      }
    };

    if (isUnlocked) {
      checkCanClaim();
    }
  }, [isUnlocked, faucetOperations, canClaim, isCompleted, completeMission]);

  const handleClaim = async () => {
    if (!canClaim() || isLoading || blockchainLoading) return;

    setIsLoading(true);
    
    try {
      // Tentar usar o contrato real primeiro
      const result = await faucetOperations.requestTokens();
      
      if (result.success) {
        // console.log('✅ Tokens reivindicados via contrato:', result.hash); // Dev log
        addTokens(MISSION_REWARDS.FAUCET);
        setLastClaim(Date.now());
        setCanClaimFromContract(false);
        setHasNotifiedCooldownEnd(false); // Reset notification flag
        notifySuccess(`${MISSION_REWARDS.FAUCET} tokens reivindicados com sucesso!`);
        
        if (!isCompleted) {
          completeMission('faucet');
        }
      } else {
        // console.warn('⚠️ Contrato falhou, usando simulação:', result.error); // Dev log
        notifyWarning('Interação com contrato falhou. Usando simulação para conceder tokens do faucet.');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        
        addTokens(MISSION_REWARDS.FAUCET);
        setLastClaim(Date.now());
        setHasNotifiedCooldownEnd(false); // Reset notification flag
        
        if (!isCompleted) {
          completeMission('faucet');
        }
      }
    } catch (error) {
      // console.error('Erro ao reivindicar tokens:', error); // Original error
      notifyWarning('Ocorreu um erro. Usando simulação para conceder tokens do faucet.');
      // Fallback to simulation
      try {
        // console.warn('⚠️ Usando simulação de faucet devido a erro anterior.'); // Dev log
        await new Promise(resolve => setTimeout(resolve, 1000));
        addTokens(MISSION_REWARDS.FAUCET);
        setLastClaim(Date.now());
        setHasNotifiedCooldownEnd(false); // Reset notification flag
        
        if (!isCompleted) {
          completeMission('faucet');
        }
      } catch (fallbackError) {
        // console.error('Erro no fallback do faucet:', fallbackError); // Dev log
        notifyError('Falha ao reivindicar tokens do faucet mesmo com simulação.');
      }
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
              <div className="text-white">{MISSION_REWARDS.FAUCET} Tokens</div>
            </div>
            <div>
              <div className="text-purple-300 font-medium">Cooldown</div>
              <div className="text-white">24 horas</div>
            </div>
          </div>
        </div>

        {/* Claim Button or Countdown */}
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
          <div className="w-full">
            {/* Countdown Display */}
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 text-center">
              <div className="text-orange-300 text-sm font-medium mb-2">
                ⏰ Próximo claim disponível em:
              </div>
              <div className="text-orange-100 text-xl font-mono font-bold">
                {timeRemaining || '00:00:00'}
              </div>
              <div className="text-orange-300/70 text-xs mt-1">
                horas : minutos : segundos
              </div>
            </div>

            {/* Progress Bar */}
            {lastClaim && (
              <div className="mt-3">
                <div className="bg-gray-600/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.max(0, Math.min(100, ((Date.now() - lastClaim) / (24 * 60 * 60 * 1000)) * 100))}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Último claim</span>
                  <span>Disponível em 24h</span>
                </div>
              </div>
            )}
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