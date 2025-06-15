"use client";

import { useNetworkValidation, getNetworkName } from '@/hooks/useNetworkValidation';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useState } from 'react';

export function NetworkStatusIndicator() {
  const { isConnected, isSmartWallet, isExternalWallet, user } = usePrivyAuth();
  const { isCorrectNetwork, currentChainId, isLoading, switchToSepolia, error } = useNetworkValidation();
  const [showDebug, setShowDebug] = useState(false);

  // Não mostrar se não estiver conectado
  if (!isConnected) {
    return null;
  }

  // Status para smart wallets
  if (isSmartWallet) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <div className="text-green-400 font-medium text-sm">Smart Wallet Ativa</div>
              <div className="text-green-300 text-xs">Configuração automática para Sepolia</div>
            </div>
          </div>
          
          {/* Debug info */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="mt-2 text-xs text-green-400/70 hover:text-green-400 underline"
          >
            {showDebug ? 'Ocultar' : 'Mostrar'} detalhes
          </button>
          
          {showDebug && (
            <div className="mt-2 p-2 bg-black/20 rounded text-xs text-green-300">
              <div>Tipo: Smart Wallet</div>
              <div>Rede: Sepolia (configuração automática)</div>
              <div>Usuário: {user?.id}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Status para carteiras externas
  if (isExternalWallet) {
    if (isCorrectNetwork) {
      return (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div>
                <div className="text-green-400 font-medium text-sm">Rede Correta</div>
                <div className="text-green-300 text-xs">Conectado à {getNetworkName(currentChainId)}</div>
              </div>
            </div>
            
            {showDebug && (
              <div className="mt-2 p-2 bg-black/20 rounded text-xs text-green-300">
                <div>Rede: {currentChainId} - {getNetworkName(currentChainId)}</div>
                <div>Tipo: Carteira Externa</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Rede incorreta - mostrar opção de troca
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <div>
              <div className="text-yellow-400 font-medium text-sm">Rede Incorreta</div>
              <div className="text-yellow-300 text-xs">
                Atual: {getNetworkName(currentChainId)} • Necessário: Sepolia
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-yellow-200 text-xs">
              Para usar todas as funcionalidades, conecte-se à rede Sepolia.
            </div>
            
            <button
              onClick={switchToSepolia}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  Alterando...
                </>
              ) : (
                <>
                  🔄 Trocar para Sepolia
                </>
              )}
            </button>

            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 p-2 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Debug info */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="mt-2 text-xs text-yellow-400/70 hover:text-yellow-400 underline"
          >
            {showDebug ? 'Ocultar' : 'Mostrar'} detalhes técnicos
          </button>

          {showDebug && (
            <div className="mt-2 p-2 bg-black/20 rounded text-xs text-yellow-300">
              <div>Chain ID atual: {currentChainId}</div>
              <div>Chain ID necessário: 11155111</div>
              <div>Tipo: Carteira Externa</div>
              <div>Connector: {user?.wallet?.connectorType}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback para outros casos
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <div>
            <div className="text-blue-400 font-medium text-sm">Verificando Rede...</div>
            <div className="text-blue-300 text-xs">Aguardando informações da carteira</div>
          </div>
        </div>
        
        {showDebug && (
          <div className="mt-2 p-2 bg-black/20 rounded text-xs text-blue-300">
            <div>Conectado: {isConnected ? 'Sim' : 'Não'}</div>
            <div>Smart Wallet: {isSmartWallet ? 'Sim' : 'Não'}</div>
            <div>Carteira Externa: {isExternalWallet ? 'Sim' : 'Não'}</div>
            <div>Chain ID: {currentChainId || 'Desconhecido'}</div>
          </div>
        )}
      </div>
    </div>
  );
} 