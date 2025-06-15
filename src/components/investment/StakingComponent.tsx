"use client";

import React, { useState, useCallback } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useInvestment } from '@/components/investment/InvestmentProvider';
import { notifySuccess, notifyWarning } from '@/utils/notificationService';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

export function StakingComponent() {
  const { addTokens } = useTokens();
  const { stakeOptions, stakePositions, stakeTokens, unstakeTokens } = useInvestment();
  const { isConnected } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('stake-1');

  const selectedStakeOption = stakeOptions.find(option => option.id === selectedOption);
  
  // Calcular total em staking
  const totalStaked = stakePositions.reduce((total, position) => total + position.amount, 0);

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0 || isLoading || !selectedStakeOption) return;

    setIsLoading(true);
    
    try {
      console.log('🏦 Executando staking...');
      
      const stakeAmount = parseFloat(amount);
      
      // Usar a função real do InvestmentProvider
      const success = await stakeTokens(selectedOption, stakeAmount);
      
      if (success) {
        // Calcular recompensa instantânea
        const reward = Math.floor(stakeAmount * 0.1); // 10% bonus imediato
        addTokens(reward);
        
        notifySuccess(`🎉 ${stakeAmount} tokens em staking! Bônus imediato: ${reward} tokens!`);
        console.log('✅ Staking realizado:', { amount: stakeAmount, option: selectedStakeOption.name, bonus: reward });
        
        setAmount('');
      } else {
        notifyWarning('Erro ao fazer staking. Verifique se você tem tokens suficientes.');
      }
      
    } catch (error: any) {
      console.warn('Erro no staking:', error);
      notifyWarning('Erro ao fazer staking. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async (positionId: string) => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      console.log('💰 Executando unstake...');
      
      const success = await unstakeTokens(positionId);
      
      if (success) {
        notifySuccess('🎉 Tokens retirados com sucesso!');
        console.log('✅ Unstake realizado:', { positionId });
      } else {
        notifyWarning('Erro ao retirar tokens. Tente novamente.');
      }
      
    } catch (error: any) {
      console.warn('Erro no unstake:', error);
      notifyWarning('Erro ao retirar tokens. Tente novamente.');
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
        <div className="text-4xl mb-4">🏦</div>
        <h3 className="text-h3 font-bold text-white mb-2">Staking de Tokens</h3>
        <p className="text-white/80 mb-6">
          Faça staking dos seus tokens e ganhe recompensas!
        </p>

        {/* Status de Conexão */}
        {!isConnected && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Conecte sua carteira para fazer staking</span>
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
              <span>✅ Staking Patrocinado - Sem gas fees!</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-purple-300 font-medium">Total em Staking</div>
              <div className="text-white">{formatCurrency(totalStaked)} Tokens</div>
            </div>
            <div>
              <div className="text-purple-300 font-medium">Posições Ativas</div>
              <div className="text-white">{stakePositions.length}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Opção de Staking
            </label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              disabled={!isConnected}
            >
              {stakeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} - {option.apy}% APY ({option.duration} dias)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Quantidade de Tokens
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
              placeholder={selectedStakeOption ? `Mínimo: ${selectedStakeOption.minTokens}` : "Ex: 100"}
              min={selectedStakeOption?.minTokens || 1}
              disabled={!isConnected}
            />
          </div>
        </div>

        {/* Preview */}
        {amount && parseFloat(amount) > 0 && selectedStakeOption && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="text-blue-400 text-sm">
              <div className="font-medium mb-1">Informações do Staking</div>
              <div className="text-blue-300 space-y-1">
                <div>APY: {selectedStakeOption.apy}%</div>
                <div>Duração: {selectedStakeOption.duration} dias</div>
                <div>Bônus imediato: {Math.floor(parseFloat(amount) * 0.1)} tokens</div>
              </div>
            </div>
          </div>
        )}

        {/* Stake Button */}
        <button
          onClick={handleStake}
          disabled={!amount || parseFloat(amount) <= 0 || isLoading || !isConnected || (selectedStakeOption && parseFloat(amount) < selectedStakeOption.minTokens)}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            amount && parseFloat(amount) > 0 && !isLoading && isConnected && selectedStakeOption && parseFloat(amount) >= selectedStakeOption.minTokens
              ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Fazendo Staking...
            </div>
          ) : !isConnected ? (
            'Conecte sua carteira'
          ) : !amount || parseFloat(amount) <= 0 ? (
            'Digite uma quantidade'
          ) : selectedStakeOption && parseFloat(amount) < selectedStakeOption.minTokens ? (
            `Mínimo: ${selectedStakeOption.minTokens} tokens`
          ) : (
            `🚀 Fazer Staking de ${amount} Tokens`
          )}
        </button>

        {/* Current Positions */}
        {stakePositions.length > 0 && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="text-blue-400 text-sm mb-3">
              <div className="font-medium">Suas Posições de Staking</div>
            </div>
            <div className="space-y-3">
              {stakePositions
                .filter(position => position.status === 'active')
                .map((position) => {
                const option = stakeOptions.find(opt => opt.id === position.stakeOptionId);
                const endDate = new Date(position.endDate);
                const now = new Date();
                const isMatured = now >= endDate;
                const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                
                return (
                  <div key={position.id} className="bg-black/20 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-blue-300 text-sm font-medium">
                          {option?.name || position.optionName}
                        </div>
                        <div className="text-blue-400 text-xs">
                          APY: {position.apy}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm font-medium">
                          {formatCurrency(position.amount)} tokens
                        </div>
                        <div className="text-green-400 text-xs">
                          +{formatCurrency(Math.floor(position.rewards))} recompensa
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <div className="text-blue-300">
                        {isMatured ? (
                          <span className="text-green-400">✅ Disponível para retirada</span>
                        ) : (
                          <span>{daysLeft} dias restantes</span>
                        )}
                      </div>
                      
                      {isMatured && (
                        <button
                          onClick={() => handleUnstake(position.id)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                        >
                          {isLoading ? 'Retirando...' : 'Retirar'}
                        </button>
                      )}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="bg-blue-900/50 rounded-full h-1">
                        <div 
                          className="bg-blue-500 rounded-full h-1 transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, ((Date.now() - position.startDate) / (position.endDate - position.startDate)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Withdrawn positions */}
            {stakePositions.filter(p => p.status === 'withdrawn').length > 0 && (
              <div className="mt-4 pt-3 border-t border-blue-500/20">
                <div className="text-blue-400 text-xs mb-2">Posições Retiradas</div>
                <div className="space-y-2">
                  {stakePositions
                    .filter(position => position.status === 'withdrawn')
                    .slice(-3) // Show only last 3
                    .map((position) => (
                    <div key={position.id} className="flex justify-between text-xs text-blue-300/70">
                      <span>{position.optionName}</span>
                      <span>✅ {formatCurrency(position.amount + Math.floor(position.rewards))} retirados</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-blue-400 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Staking Automatizado</span>
            </div>
            <p className="text-blue-300 text-xs">
              As recompensas são calculadas automaticamente e creditadas instantaneamente com Account Abstraction!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 