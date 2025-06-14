"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useBlockchain } from '@/hooks/useBlockchain';
import { MISSION_REWARDS } from '@/contracts/config';
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notificationService';

export function FaucetComponent() {
  const { addTokens } = useTokens();
  const { faucetOperations, isLoading: blockchainLoading, isConnected } = useBlockchain();
  const [isLoading, setIsLoading] = useState(false);
  const [lastClaim, setLastClaim] = useState<number | null>(null);
  const [canClaimFromContract, setCanClaimFromContract] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [hasNotifiedCooldownEnd, setHasNotifiedCooldownEnd] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const canClaim = useCallback(() => {
    // Se há erro de rede, usar lógica local
    if (networkError) {
      if (!lastClaim) return true;
      const now = Date.now();
      const timeDiff = now - lastClaim;
      const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas
      return timeDiff >= cooldownTime;
    }
    
    // Usar verificação do contrato se disponível
    if (canClaimFromContract !== undefined) {
      return canClaimFromContract;
    }
    
    // Fallback para lógica local
    if (!lastClaim) return true;
    const now = Date.now();
    const timeDiff = now - lastClaim;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas
    return timeDiff >= cooldownTime;
  }, [canClaimFromContract, lastClaim, networkError]);

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
      setCanClaimFromContract(true);
      
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

  // Timer para atualizar o countdown a cada segundo
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!lastClaim || canClaim()) {
      setTimeRemaining(null);
      return;
    }

    updateTimeRemaining();
    intervalRef.current = setInterval(updateTimeRemaining, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [lastClaim, updateTimeRemaining]);

  // Verificar se pode reivindicar do contrato com melhor tratamento de erro
  useEffect(() => {
    let isMounted = true;

    const checkCanClaim = async () => {
      // Se não estiver conectado, não tentar verificar o contrato
      if (!isConnected) {
        if (isMounted) {
          setNetworkError(false);
          setCanClaimFromContract(true);
        }
        return;
      }

      try {
        setNetworkError(false);
        
        // Timeout para evitar travamento
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        
        const canClaimPromise = faucetOperations.canClaim();
        const lastClaimPromise = faucetOperations.getLastClaim();
        
        const [canClaimResult, lastClaimTime] = await Promise.race([
          Promise.all([canClaimPromise, lastClaimPromise]),
          timeoutPromise
        ]) as [boolean, number];
        
        if (isMounted) {
          setCanClaimFromContract(canClaimResult);
          if (lastClaimTime > 0) {
            setLastClaim(lastClaimTime);
          }
        }
      } catch (error) {
        console.warn('Faucet: Erro ao verificar contrato, usando modo local:', error);
        if (isMounted) {
          // Detectar diferentes tipos de erro de rede
          const errorMessage = (error as Error).message?.toLowerCase() || '';
          const errorName = (error as Error).name?.toLowerCase() || '';
          const errorStack = (error as Error).stack?.toLowerCase() || '';
          
          const isNetworkError = errorMessage.includes('network') || 
                                errorMessage.includes('fetch') || 
                                errorMessage.includes('timeout') ||
                                errorMessage.includes('http request failed') ||
                                errorMessage.includes('connection') ||
                                errorName.includes('httprequesterror') ||
                                errorName.includes('networkerror') ||
                                errorStack.includes('httprequesterror') ||
                                errorStack.includes('fetch resource');
          
          setNetworkError(isNetworkError);
          
          // Usar dados do localStorage como fallback
          const localLastClaim = localStorage.getItem('faucet_last_claim');
          if (localLastClaim) {
            setLastClaim(parseInt(localLastClaim));
          }
        }
      }
    };

    if (faucetOperations) {
      checkCanClaim();
    }

    return () => {
      isMounted = false;
    };
  }, [faucetOperations, isConnected]);

  const handleClaim = async () => {
    if (!canClaim() || isLoading || blockchainLoading) return;

    setIsLoading(true);
    
    try {
      // Se há erro de rede ou não está conectado, usar simulação diretamente
      if (networkError || !isConnected) {
        notifyWarning('Usando modo offline. Tokens serão adicionados localmente.');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const now = Date.now();
        addTokens(MISSION_REWARDS.FAUCET);
        setLastClaim(now);
        localStorage.setItem('faucet_last_claim', now.toString());
        setCanClaimFromContract(false);
        setHasNotifiedCooldownEnd(false);
        notifySuccess(`${MISSION_REWARDS.FAUCET} tokens adicionados com sucesso!`);
        return;
      }

      // Tentar usar o contrato real com timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na transação')), 10000)
      );
      
      const result = await Promise.race([
        faucetOperations.requestTokens(),
        timeoutPromise
      ]) as any;
      
      // Verificar se a transação foi bem-sucedida
      if (result.success) {
        addTokens(MISSION_REWARDS.FAUCET);
        setLastClaim(Date.now());
        setCanClaimFromContract(false);
        setHasNotifiedCooldownEnd(false);
        
        // Verificar se foi usado fallback
        if (result.error?.code === 'FALLBACK_USED') {
          notifySuccess(`${MISSION_REWARDS.FAUCET} tokens adicionados localmente (blockchain indisponível)!`);
        } else {
          notifySuccess(`${MISSION_REWARDS.FAUCET} tokens reivindicados da blockchain!`);
        }
      } else {
        // Se falhou, verificar o tipo de erro
        if (result.error?.code === 'EMBEDDED_WALLET_ERROR') {
          console.warn('Faucet: Embedded wallet error detected, using local fallback');
          notifyWarning('Carteira embarcada com problemas. Usando modo local.');
          
          const now = Date.now();
          addTokens(MISSION_REWARDS.FAUCET);
          setLastClaim(now);
          localStorage.setItem('faucet_last_claim', now.toString());
          setCanClaimFromContract(false);
          setHasNotifiedCooldownEnd(false);
          notifySuccess(`${MISSION_REWARDS.FAUCET} tokens adicionados localmente!`);
        } else {
          throw new Error(result.error?.message || 'Transação falhou');
        }
      }
    } catch (error) {
      console.warn('Faucet: Erro na transação blockchain, usando fallback:', error);
      notifyWarning('Blockchain indisponível. Usando modo local para conceder tokens.');
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const now = Date.now();
        addTokens(MISSION_REWARDS.FAUCET);
        setLastClaim(now);
        localStorage.setItem('faucet_last_claim', now.toString());
        setHasNotifiedCooldownEnd(false);
        notifySuccess(`${MISSION_REWARDS.FAUCET} tokens adicionados localmente!`);
      } catch (fallbackError) {
        notifyError('Falha ao reivindicar tokens do faucet.');
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

        {/* Network Status */}
        {networkError && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Modo offline ativo - Blockchain indisponível</span>
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
            <li>{networkError ? 'Modo offline: tokens salvos localmente' : 'Conectado à blockchain Sepolia'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 