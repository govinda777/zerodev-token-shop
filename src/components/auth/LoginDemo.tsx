"use client";

import { usePrivyAuth } from "@/hooks/usePrivyAuth";
import { useTokens } from "@/hooks/useTokens";
import { AuthLogs } from "./AuthLogs";

export function LoginDemo() {
  const { 
    isReady, 
    isAuthenticated, 
    isConnecting, 
    user, 
    address, 
    userInfo, 
    hasWallet,
    connect, 
    disconnect,
    connectWallet
  } = usePrivyAuth();
  
  const { balance, isFirstLogin, welcomeReward } = useTokens();

  if (!isReady) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando Privy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-h2 font-bold text-white mb-6">Demonstração do Privy</h2>
      
      {!isAuthenticated ? (
        <div className="text-center">
          <p className="text-gray-400 mb-6">Faça login para acessar o marketplace</p>
          <button
            onClick={connect}
            disabled={isConnecting}
            className="btn btn-primary"
          >
            {isConnecting ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Conectando...
              </>
            ) : (
              <>
                <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
                Conectar Carteira
              </>
            )}
          </button>
          <p className="text-caption text-gray-500 mt-4">
            Suporta MetaMask, WalletConnect e outras carteiras Web3
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status do usuário */}
          <div className="bg-success/10 border border-success/30 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
              <span className="text-success font-medium">
                {isFirstLogin ? '🎉 Primeiro login realizado!' : 'Conectado com sucesso!'}
              </span>
            </div>
            
            {/* Welcome message for first login */}
            {isFirstLogin && welcomeReward && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-3">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-purple-400 font-medium text-sm">Recompensa de Boas-vindas</span>
                </div>
                <p className="text-purple-300 text-sm">
                  Você recebeu <span className="font-bold text-yellow-300">{welcomeReward} tokens</span> como bônus de primeiro login!
                </p>
              </div>
            )}
            
            {/* Token balance display */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-medium text-sm">Saldo de Tokens:</span>
                <span className="text-blue-300 font-bold">{balance} tokens</span>
              </div>
            </div>
            
            {userInfo && (
              <div className="space-y-2 text-body-sm">
                <p><span className="text-gray-400">ID:</span> <span className="text-white">{userInfo.id}</span></p>
                {"email" in userInfo && userInfo.email && (
                  <p><span className="text-gray-400">Email:</span> <span className="text-white">{userInfo.email}</span></p>
                )}
                {userInfo.wallet && (
                  <p><span className="text-gray-400">Carteira:</span> <span className="text-white font-mono">{userInfo.wallet}</span></p>
                )}
                <p><span className="text-gray-400">Criado em:</span> <span className="text-white">{userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A'}</span></p>
              </div>
            )}
          </div>

          {/* Informações da carteira */}
          <div className="card p-4">
            <div className="flex items-center mb-3">
              <svg className="icon-sm mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
              <span className="font-medium text-white">Carteira Digital</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-gray-400">Status:</span>
                <span className={`text-body-sm ${hasWallet ? 'text-success' : 'text-gray-400'}`}>
                  {hasWallet ? 'Conectada' : 'Não conectada'}
                </span>
              </div>
              {address && (
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-gray-400">Endereço:</span>
                  <span className="text-body-sm text-white font-mono">
                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                  </span>
                </div>
              )}
              {!hasWallet && (
                <button
                  onClick={connectWallet}
                  className="btn btn-secondary btn-sm w-full"
                >
                  Conectar Carteira Adicional
                </button>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={disconnect}
              className="btn btn-secondary text-error border-error/30 hover:bg-error/10"
            >
              <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Desconectar
            </button>
            
            {hasWallet && address && (
              <button
                onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
                className="btn btn-secondary"
              >
                <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver no Etherscan
              </button>
            )}
          </div>

          {/* Informações sobre funcionalidades futuras */}
          <div className="bg-info/10 border border-info/30 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="icon-sm mr-2 text-info mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-info font-medium mb-1">Funcionalidades Futuras</h4>
                <p className="text-body-sm text-gray-400">
                  Login com Google e outras redes sociais serão habilitados quando o App ID do Privy for configurado com essas opções.
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Logs */}
          <AuthLogs />
        </div>
      )}
    </div>
  );
} 