"use client";

import { useEffect, useState } from 'react';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import JourneyLogger from '@/utils/journeyLogger';

interface UserStats {
  totalPurchases: number;
  totalStaked: number;
  totalRewards: number;
  airdropsClaimed: number;
  joinDate: number | null;
}

interface JourneyEvent {
  id: string;
  event: string;
  walletAddress: string;
  timestamp: number;
  amount?: number;
  details?: Record<string, unknown>;
}

export function UserAnalytics() {
  const { address, isConnected } = usePrivyAuth();
  const [stats, setStats] = useState<UserStats>({
    totalPurchases: 0,
    totalStaked: 0,
    totalRewards: 0,
    airdropsClaimed: 0,
    joinDate: null
  });
  const [recentEvents, setRecentEvents] = useState<JourneyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      loadUserAnalytics();
    }
  }, [isConnected, address]);

  const loadUserAnalytics = () => {
    if (!address) return;

    setLoading(true);
    try {
      // Load user statistics
      const userStats = JourneyLogger.getUserStats(address);
      setStats(userStats);

      // Load recent events (last 10)
      const userLogs = JourneyLogger.getLogsForUser(address);
      setRecentEvents(userLogs.slice(0, 10));
    } catch (error) {
      console.error('Error loading user analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventName = (event: string): string => {
    const eventNames: Record<string, string> = {
      'FIRST_LOGIN': 'Primeiro Login',
      'TOKEN_REWARD': 'Recompensa de Tokens',
      'PURCHASE': 'Compra',
      'STAKE': 'Staking',
      'UNSTAKE': 'Unstaking',
      'AIRDROP_CLAIM': 'Airdrop Coletado',
      'GOVERNANCE_VOTE': 'Governança',
      'POOL_JOIN': 'Pool',
      'INSTALLMENT_CREATE': 'Parcelamento Criado',
      'INSTALLMENT_PAYMENT': 'Pagamento Parcela',
      'NFT_RECEIVED': 'NFT Recebido'
    };
    return eventNames[event] || event;
  };

  const getEventIcon = (event: string): string => {
    const eventIcons: Record<string, string> = {
      'FIRST_LOGIN': '🎉',
      'TOKEN_REWARD': '💰',
      'PURCHASE': '🛒',
      'STAKE': '🔒',
      'UNSTAKE': '🔓',
      'AIRDROP_CLAIM': '🪂',
      'GOVERNANCE_VOTE': '🗳️',
      'POOL_JOIN': '🏊',
      'INSTALLMENT_CREATE': '💳',
      'INSTALLMENT_PAYMENT': '💸',
      'NFT_RECEIVED': '🎨'
    };
    return eventIcons[event] || '📝';
  };

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/60">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">📊 Suas Estatísticas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.totalPurchases}</div>
            <div className="text-white/60 text-sm">Compras</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalStaked.toFixed(1)}</div>
            <div className="text-white/60 text-sm">Tokens em Stake</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{stats.totalRewards.toFixed(1)}</div>
            <div className="text-white/60 text-sm">Recompensas</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.airdropsClaimed}</div>
            <div className="text-white/60 text-sm">Airdrops</div>
          </div>
        </div>
        
        {stats.joinDate && (
          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-purple-300 text-sm">
              🎯 Membro desde: {new Date(stats.joinDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">🔄 Atividade Recente</h3>
        {recentEvents.length === 0 ? (
          <p className="text-white/60 text-center py-8">Nenhuma atividade ainda</p>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div key={event.id} className="bg-white/5 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{getEventIcon(event.event)}</span>
                    <div>
                      <h4 className="text-white font-medium">{formatEventName(event.event)}</h4>
                      <p className="text-white/60 text-sm">
                        {new Date(event.timestamp).toLocaleString('pt-BR')}
                      </p>
                      {event.details && (
                        <div className="mt-2 text-xs text-white/50">
                          {typeof event.details.source === 'string' && (
                            <span className="mr-3">Fonte: {event.details.source}</span>
                          )}
                          {typeof event.details.productId === 'string' && (
                            <span className="mr-3">Produto: {event.details.productId}</span>
                          )}
                          {typeof event.details.stakeOptionId === 'string' && (
                            <span className="mr-3">Opção: {event.details.stakeOptionId}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {event.amount && (
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {event.amount > 0 ? '+' : ''}{event.amount} tokens
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Journey Progress */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">🎯 Progresso da Jornada</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80">✅ Primeiro Login</span>
            <span className="text-green-400">Concluído</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80">🛒 Primeira Compra</span>
            <span className={stats.totalPurchases > 0 ? 'text-green-400' : 'text-yellow-400'}>
              {stats.totalPurchases > 0 ? 'Concluído' : 'Pendente'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80">🔒 Primeiro Stake</span>
            <span className={stats.totalStaked > 0 ? 'text-green-400' : 'text-yellow-400'}>
              {stats.totalStaked > 0 ? 'Concluído' : 'Pendente'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80">🪂 Primeiro Airdrop</span>
            <span className={stats.airdropsClaimed > 0 ? 'text-green-400' : 'text-yellow-400'}>
              {stats.airdropsClaimed > 0 ? 'Concluído' : 'Pendente'}
            </span>
          </div>
        </div>
      </div>

      {/* Debug Section (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="card border border-red-500/20">
          <h3 className="text-xl font-bold text-red-400 mb-4">🔧 Debug (Dev Only)</h3>
          <div className="flex gap-2">
            <button
              onClick={() => loadUserAnalytics()}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Recarregar Dados
            </button>
            <button
              onClick={() => {
                JourneyLogger.clearLogs();
                loadUserAnalytics();
              }}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Limpar Logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 