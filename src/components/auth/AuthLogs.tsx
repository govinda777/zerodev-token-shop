"use client";

import { usePrivyAuth } from "@/hooks/usePrivyAuth";
import JourneyLogger from "@/utils/journeyLogger";
import { useState, useEffect } from "react";

interface AuthLog {
  id: string;
  event: string;
  walletAddress: string;
  timestamp: number;
  amount?: number;
  details?: Record<string, unknown>;
}

export function AuthLogs() {
  const { address, isConnected } = usePrivyAuth();
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      // Get authentication-related logs for current user
      const userLogs = JourneyLogger.getLogsForUser(address).filter(
        log => log.event === 'FIRST_LOGIN' || log.event === 'TOKEN_REWARD'
      );
      setLogs(userLogs);
    }
  }, [isConnected, address]);

  if (!isConnected || logs.length === 0) {
    return null;
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'FIRST_LOGIN':
        return (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m0 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        );
      case 'TOKEN_REWARD':
        return (
          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getEventDescription = (log: AuthLog) => {
    switch (log.event) {
      case 'FIRST_LOGIN':
        return `Primeiro login realizado - ${log.amount} tokens concedidos`;
      case 'TOKEN_REWARD':
        const source = log.details?.source || 'unknown';
        return `Recompensa de tokens recebida (${source}) - ${log.amount} tokens`;
      default:
        return `Evento: ${log.event}`;
    }
  };

  return (
    <div className="card p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Logs de Autenticação
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-400 hover:text-purple-300 transition-colors"
          aria-label={isExpanded ? "Recolher logs" : "Expandir logs"}
        >
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getEventIcon(log.event)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">
                      {getEventDescription(log)}
                    </p>
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Endereço: {log.walletAddress.slice(0, 6)}...{log.walletAddress.slice(-4)}
                  </p>
                  {(() => {
                    const sessionId = log.details?.sessionId;
                    return sessionId && typeof sessionId === 'string' ? (
                      <p className="text-xs text-gray-500 mt-1">
                        Sessão: {sessionId}
                      </p>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          ))}
          
          {logs.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">Nenhum log de autenticação encontrado</p>
            </div>
          )}
        </div>
      )}
      
      {!isExpanded && (
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            {logs.length} evento{logs.length !== 1 ? 's' : ''} registrado{logs.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
} 