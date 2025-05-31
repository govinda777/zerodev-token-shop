"use client";

import React, { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useJourney } from './JourneyProvider';
import { useBlockchain } from '@/hooks/useBlockchain';
import { STAKING_POOLS } from '@/contracts/config';
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notificationService';

interface StakePool {
  id: string;
  name: string;
  apy: number;
  minStake: number;
  description: string;
  icon: string;
}

interface StakeInfo {
  poolId: number;
  amount?: number;
  timestamp?: number;
  rewards?: number;
  [key: string]: unknown;
}

const stakePools: StakePool[] = [
  {
    id: STAKING_POOLS.BASIC.id,
    name: STAKING_POOLS.BASIC.name,
    apy: STAKING_POOLS.BASIC.apy,
    minStake: STAKING_POOLS.BASIC.minStake,
    description: 'Pool de entrada com baixo risco',
    icon: '🟢'
  },
  {
    id: STAKING_POOLS.PREMIUM.id,
    name: STAKING_POOLS.PREMIUM.name,
    apy: STAKING_POOLS.PREMIUM.apy,
    minStake: STAKING_POOLS.PREMIUM.minStake,
    description: 'Pool avançado com maiores retornos',
    icon: '🟡'
  },
  {
    id: STAKING_POOLS.ELITE.id,
    name: STAKING_POOLS.ELITE.name,
    apy: STAKING_POOLS.ELITE.apy,
    minStake: STAKING_POOLS.ELITE.minStake,
    description: 'Pool exclusivo para grandes investidores',
    icon: '🔴'
  }
];

export function StakingComponent() {
  const { balance, removeTokens } = useTokens();
  const { journey, completeMission } = useJourney();
  const { stakingOperations, tokenOperations, isLoading: blockchainLoading } = useBlockchain();
  const [selectedPool, setSelectedPool] = useState<StakePool | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stakedAmount, setStakedAmount] = useState(0);

  const stakeMission = journey.missions.find(m => m.id === 'stake');
  const isUnlocked = stakeMission?.unlocked || false;
  const isCompleted = stakeMission?.completed || false;

  // Carregar dados de staking do usuário
  useEffect(() => {
    const loadUserStakes = async () => {
      try {
        // Carregar stakes do usuário para cada pool
        const stakes = await Promise.all(
          stakePools.map(async (pool, index) => {
            try {
              const userAddress = await tokenOperations.getBalance(); // Usar para obter endereço
              const stakeInfo = await stakingOperations.getUserStake(userAddress, index);
              return typeof stakeInfo === 'object' && stakeInfo !== null ? { poolId: index, ...stakeInfo } : { poolId: index };
            } catch (error) {
              console.warn(`Erro ao carregar stake do pool ${pool.id}:`, error);
              return { poolId: index, amount: 0, timestamp: 0, rewards: 0 };
            }
          })
        );
        
        // Calcular total em stake
        const total = stakes.reduce((sum: number, stake: StakeInfo) => sum + Number(stake.amount || 0), 0);
        setStakedAmount(total);
      } catch (error) {
        // console.error('Erro ao carregar stakes do usuário:', error);
        // Potentially notifyError("Não foi possível carregar seus stakes anteriores.");
      }
    };

    if (isUnlocked) {
      loadUserStakes();
    }
  }, [isUnlocked, stakingOperations, tokenOperations]);

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount || isLoading || blockchainLoading) return;

    const amount = parseInt(stakeAmount);
    if (amount < selectedPool.minStake || amount > balance) return;

    setIsLoading(true);

    try {
      // Encontrar o índice do pool selecionado
      const poolIndex = stakePools.findIndex(p => p.id === selectedPool.id);
      
      // Primeiro aprovar tokens para o contrato de staking
      const approveResult = await tokenOperations.approve(
        "0x3456789012345678901234567890123456789012", // STAKING contract address
        stakeAmount
      );

      if (approveResult.success) {
        // Fazer stake no contrato
        const tx: unknown = await stakingOperations.stake(poolIndex, stakeAmount);
        
        if (tx) {
          // console.log('✅ Stake realizado via contrato:', tx); // Dev log
          await removeTokens(amount); // removeTokens is now async
          setStakedAmount(prev => prev + amount);
          setStakeAmount('');
          notifySuccess(`${amount} tokens investidos com sucesso em ${selectedPool.name}!`);
          
          if (!isCompleted) {
            completeMission('stake');
          }
        } else {
          // This path might not be hit if stakingOperations.stake itself throws an error that's caught by the outer catch.
          notifyError('Falha ao registrar o stake no contrato.');
          throw new Error('Falha no stake (transação não confirmada ou tx é null/undefined)');
        }
      } else {
        notifyError(`Falha ao aprovar tokens para stake: ${approveResult.error?.message || 'Erro desconhecido'}`);
        throw new Error(approveResult.error?.message || 'Falha na aprovação');
      }
    } catch (error) {
      // console.error('Erro ao fazer stake:', error); // Original error
      notifyWarning('Ocorreu um erro ao fazer stake. Usando simulação.');
      // Fallback to simulation
      try {
        // console.warn('⚠️ Usando simulação de stake'); // Dev log
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await removeTokens(amount); // removeTokens is now async
        setStakedAmount(prev => prev + amount);
        setStakeAmount('');
        notifySuccess(`${amount} tokens (simulados) investidos em ${selectedPool.name}!`);
        
        if (!isCompleted) {
          completeMission('stake');
        }
      } catch (fallbackError) {
        // console.error('Erro no fallback do stake:', fallbackError); // Dev log
        notifyError('Falha ao fazer stake mesmo com simulação.');
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
          <h3 className="text-h3 font-bold text-white mb-2">Staking Bloqueado</h3>
          <p className="text-white/80">Complete a missão do faucet para desbloquear o staking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card text-center">
        <div className="text-4xl mb-4">📈</div>
        <h3 className="text-h3 font-bold text-white mb-2">Staking de Tokens</h3>
        <p className="text-white/80 mb-4">
          Invista seus tokens e ganhe recompensas passivas!
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 bg-black/20 rounded-lg p-4">
          <div>
            <div className="text-purple-300 font-medium text-sm">Saldo Disponível</div>
            <div className="text-white text-lg font-bold">{balance} Tokens</div>
          </div>
          <div>
            <div className="text-purple-300 font-medium text-sm">Total em Stake</div>
            <div className="text-white text-lg font-bold">{stakedAmount} Tokens</div>
          </div>
        </div>
      </div>

      {/* Stake Pools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stakePools.map((pool) => (
          <div
            key={pool.id}
            className={`card card-hover cursor-pointer transition-all ${
              selectedPool?.id === pool.id 
                ? 'border-purple-500/50 bg-purple-500/10' 
                : 'border-gray-500/30'
            }`}
            onClick={() => setSelectedPool(pool)}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">{pool.icon}</div>
              <h4 className="text-lg font-bold text-white mb-2">{pool.name}</h4>
              <div className="text-2xl font-bold text-purple-400 mb-2">{pool.apy}% APY</div>
              <p className="text-white/80 text-sm mb-3">{pool.description}</p>
              <div className="text-xs text-white/60">
                Mínimo: {pool.minStake} tokens
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stake Form */}
      {selectedPool && (
        <div className="card">
          <h4 className="text-lg font-bold text-white mb-4">
            Fazer Stake - {selectedPool.name}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Quantidade de Tokens
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                min={selectedPool.minStake}
                max={balance}
                className="w-full bg-black/20 border border-gray-500/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500/50 focus:outline-none"
                placeholder={`Mínimo: ${selectedPool.minStake} tokens`}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setStakeAmount(selectedPool.minStake.toString())}
                className="flex-1 bg-gray-600/20 hover:bg-gray-600/30 text-white text-sm py-2 px-3 rounded-lg transition-colors"
              >
                Mínimo
              </button>
              <button
                onClick={() => setStakeAmount(Math.floor(balance * 0.25).toString())}
                className="flex-1 bg-gray-600/20 hover:bg-gray-600/30 text-white text-sm py-2 px-3 rounded-lg transition-colors"
              >
                25%
              </button>
              <button
                onClick={() => setStakeAmount(Math.floor(balance * 0.5).toString())}
                className="flex-1 bg-gray-600/20 hover:bg-gray-600/30 text-white text-sm py-2 px-3 rounded-lg transition-colors"
              >
                50%
              </button>
              <button
                onClick={() => setStakeAmount(balance.toString())}
                className="flex-1 bg-gray-600/20 hover:bg-gray-600/30 text-white text-sm py-2 px-3 rounded-lg transition-colors"
              >
                Máximo
              </button>
            </div>

            {/* Stake Button */}
            <button
              onClick={handleStake}
              disabled={
                isLoading || 
                !stakeAmount || 
                parseInt(stakeAmount) < selectedPool.minStake || 
                parseInt(stakeAmount) > balance
              }
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processando Stake...
                </>
              ) : (
                <>
                  📈 Fazer Stake
                </>
              )}
            </button>

            {/* Validation Messages */}
            {stakeAmount && parseInt(stakeAmount) < selectedPool.minStake && (
              <div className="text-red-400 text-sm">
                Quantidade mínima: {selectedPool.minStake} tokens
              </div>
            )}
            {stakeAmount && parseInt(stakeAmount) > balance && (
              <div className="text-red-400 text-sm">
                Saldo insuficiente
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mission Status */}
      {isCompleted && (
        <div className="card">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-medium text-center">
              ✅ Missão de Staking Concluída! Você desbloqueou investimentos avançados.
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 