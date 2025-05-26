"use client";

import { useEthBalance } from "@/hooks/useEthBalance";
import { useTokens } from "@/hooks/useTokens";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

export function WalletInfo() {
  const { address, isConnected } = usePrivyAuth();
  const { balance: tokenBalance } = useTokens();
  const { ethBalance, isLoading, error, refetch } = useEthBalance();

  if (!isConnected || !address) {
    return (
      <div className="card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Informações da Carteira</h3>
        <p className="text-white/60">Conecte sua carteira para ver as informações</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Informações da Carteira</h3>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm rounded transition-colors"
        >
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white/80 text-sm mb-2">Tokens do Marketplace</h4>
            <div className="text-2xl font-bold text-white">{tokenBalance}</div>
            <div className="text-white/60 text-sm">Tokens simulados para compras</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white/80 text-sm mb-2">Saldo Real ETH</h4>
            <div className="text-2xl font-bold text-white">
              {error ? (
                <span className="text-red-400">Erro</span>
              ) : (
                `${parseFloat(ethBalance).toFixed(6)} ETH`
              )}
            </div>
            <div className="text-white/60 text-sm">
              {error ? 'Erro ao carregar saldo' : 'Saldo real na rede Sepolia'}
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white/80 text-sm mb-2">Endereço da Carteira</h4>
          <div className="flex items-center justify-between">
            <span className="text-white font-mono text-sm">{address}</span>
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors"
            >
              Copiar
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-400 text-sm">
                Não foi possível obter o saldo real de ETH. Verifique sua conexão com a rede Sepolia.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 