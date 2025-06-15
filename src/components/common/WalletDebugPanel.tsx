"use client";

import { useState } from 'react';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useTokens } from '@/hooks/useTokens';
import { useInvestment } from '@/components/investment/InvestmentProvider';
import { debugWalletData, forceSyncWalletData } from '@/utils/storage';
import { notifySuccess, notifyError, notifyInfo } from '@/utils/notificationService';

export function WalletDebugPanel() {
  const { address, isConnected } = usePrivyAuth();
  const { balance } = useTokens();
  const { stakePositions } = useInvestment();
  const [isVisible, setIsVisible] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isConnected || !address) {
    return null;
  }

  const handleDebugData = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const data = await debugWalletData(address);
      setDebugData(data);
      notifyInfo('🔍 Dados da carteira carregados para debug');
    } catch (error) {
      notifyError('❌ Erro ao carregar dados de debug');
      console.error('Debug error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceSync = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const success = await forceSyncWalletData(address);
      if (success) {
        notifySuccess('✅ Sincronização forçada realizada com sucesso!');
        // Recarregar dados de debug
        await handleDebugData();
      } else {
        notifyError('❌ Falha na sincronização forçada');
      }
    } catch (error) {
      notifyError('❌ Erro na sincronização forçada');
      console.error('Sync error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    if (!address) return;
    
    const keys = [
      `token_balance_${address}`,
      `transactions_${address}`,
      `welcome_reward_${address}`,
      `stake_positions_${address}`,
      `last_sync_${address}`
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    notifyInfo('🗑️ Dados locais limpos. Recarregue a página.');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Debug Wallet"
      >
        🔧
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Wallet Debug Panel</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Current State */}
          <div className="space-y-3 mb-4">
            <div className="bg-gray-800 rounded p-3">
              <h4 className="text-gray-300 text-sm font-medium mb-2">Estado Atual</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Endereço:</span>
                  <span className="text-white font-mono">{address.slice(0, 8)}...{address.slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tokens:</span>
                  <span className="text-green-400 font-bold">{balance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Staking:</span>
                  <span className="text-blue-400">{stakePositions.length} posições</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Navegador:</span>
                  <span className="text-yellow-400">{navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Firefox'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 mb-4">
            <button
              onClick={handleDebugData}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              {isLoading ? '🔄 Carregando...' : '🔍 Verificar Dados'}
            </button>
            
            <button
              onClick={handleForceSync}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              {isLoading ? '🔄 Sincronizando...' : '🔄 Forçar Sincronização'}
            </button>
            
            <button
              onClick={handleClearData}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              🗑️ Limpar Dados Locais
            </button>
          </div>

          {/* Debug Data Display */}
          {debugData && (
            <div className="bg-gray-800 rounded p-3">
              <h4 className="text-gray-300 text-sm font-medium mb-2">Dados de Debug</h4>
              <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
                <div className="flex justify-between">
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-green-400">{debugData.balance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transactions:</span>
                  <span className="text-blue-400">{debugData.transactions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Welcome Reward:</span>
                  <span className="text-yellow-400">{debugData.welcomeReward ? 'Sim' : 'Não'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stake Positions:</span>
                  <span className="text-purple-400">{debugData.stakePositions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-gray-300">{new Date(debugData.lastUpdated).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs">
            <p className="text-yellow-400 font-medium mb-1">💡 Para resolver o problema:</p>
            <ol className="text-yellow-300 space-y-1 list-decimal list-inside">
              <li>Clique em "Verificar Dados"</li>
              <li>Clique em "Forçar Sincronização"</li>
              <li>Recarregue a página no outro navegador</li>
              <li>Se não funcionar, use "Limpar Dados" e recarregue</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
} 