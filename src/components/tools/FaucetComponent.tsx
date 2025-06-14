"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useBlockchain } from '@/hooks/useBlockchain';
import { MISSION_REWARDS } from '@/contracts/config';
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notificationService';

export function FaucetComponent() {
  const { addTokens } = useTokens();
  const { faucetOperations, isLoading: blockchainLoading } = useBlockchain();
  const [isLoading, setIsLoading] = useState(false);
  const [lastClaim, setLastClaim] = useState<number | null>(null);
  const [canClaimFromContract, setCanClaimFromContract] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [hasNotifiedCooldownEnd, setHasNotifiedCooldownEnd] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [lastClaim, hasNotifiedCooldownEnd]);

  // Timer para atualizar o countdown a cada segundo - OTIMIZADO
  useEffect(() => {
    // Limpar interval anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!lastClaim || canClaim()) {
      setTimeRemaining(null);
      return;
    }

    // Atualizar imediatamente
    updateTimeRemaining();

    // Configurar interval para atualizar a cada segundo
    intervalRef.current = setInterval(updateTimeRemaining, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [lastClaim, updateTimeRemaining]); // Removido canClaim das dependências para evitar loop

  // Verificar se pode reivindicar do contrato - OTIMIZADO
  useEffect(() => {
    let isMounted = true;

    const checkCanClaim = async () => {
      try {
        const canClaimResult = await faucetOperations.canClaim();
        if (isMounted) {
          setCanClaimFromContract(canClaimResult);
        }
        
        // Obter último claim do contrato
        const lastClaimTime = await faucetOperations.getLastClaim();
        if (isMounted && lastClaimTime > 0) {
          setLastClaim(lastClaimTime);
        }
      } catch (error) {
        // Fallback para lógica local se contrato não estiver disponível
        if (isMounted) {
          setCanClaimFromContract(canClaim());
        }
      }
    };

    // Só executa se faucetOperations estiver disponível
    if (faucetOperations) {
      checkCanClaim();
    }

    return () => {
      isMounted = false;
    };
  }, []); // Array vazio - executa apenas uma vez na montagem

  const handleClaim = async () => {
    if (!canClaim() || isLoading || blockchainLoading) return;

    setIsLoading(true);
    
    try {
      // Tentar usar o contrato real primeiro
      const result = await faucetOperations.requestTokens();
      
      if (result.success) {
        addTokens(MISSION_REWARDS.FAUCET);
        setLastClaim(Date.now());
        setCanClaimFromContract(false);
        setHasNotifiedCooldownEnd(false);
        notifySuccess(`${MISSION_REWARDS.FAUCET} tokens reivindicados com sucesso!`);
      } else {
        notifyWarning('Interação com contrato falhou. Usando simulação para conceder tokens do faucet.');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        addTokens(MISSION_REWARDS.FAUCET);
        setLastClaim(Date.now());
        setHasNotifiedCooldownEnd(false);
      }
    } catch (error) {
      notifyWarning('Ocorreu um erro. Usando simulação para conceder tokens do faucet.');
      // Fallback to simulation
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        addTokens(MISSION_REWARDS.FAUCET);
        setLastClaim(Date.now());
        setHasNotifiedCooldownEnd(false);
      } catch (fallbackError) {
        notifyError('Falha ao reivindicar tokens do faucet mesmo com simulação.');
      }
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
          disabled={!canClaim() || isLoading || blockchainLoading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            canClaim() && !isLoading && !blockchainLoading
              ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading || blockchainLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Reivindicando...
            </div>
          ) : canClaim() ? (
            `Reivindicar ${MISSION_REWARDS.FAUCET} Tokens`
          ) : (
            'Aguarde o cooldown'
          )}
        </button>

        {/* Instructions */}
        <div className="mt-6 text-xs text-white/60 text-left">
          <h4 className="font-medium mb-2">Como funciona:</h4>
          <ul className="space-y-1 list-disc list-inside">
            <li>Reivindique tokens gratuitos a cada 24 horas</li>
            <li>Tokens são adicionados à sua carteira automaticamente</li>
            <li>Use os tokens para comprar produtos no marketplace</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 