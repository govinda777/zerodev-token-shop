"use client";

import { useNetworkValidation, getNetworkName } from '@/hooks/useNetworkValidation';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

interface NetworkGuardProps {
  children: React.ReactNode;
  showWarningOnly?: boolean;
}

export function NetworkGuard({ children, showWarningOnly = false }: NetworkGuardProps) {
  const { isConnected } = usePrivyAuth();
  const { 
    isCorrectNetwork, 
    currentChainId, 
    isLoading, 
    switchToSepolia, 
    error 
  } = useNetworkValidation();

  // Se não estiver conectado, não mostrar nada
  if (!isConnected) {
    return <>{children}</>;
  }

  // Se estiver carregando, mostrar spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-white">Verificando rede...</span>
      </div>
    );
  }

  // Se estiver na rede correta, mostrar o conteúdo
  if (isCorrectNetwork) {
    return <>{children}</>;
  }

  // Se for apenas aviso, mostrar warning mas permitir acesso
  if (showWarningOnly) {
    return (
      <>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 mb-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-yellow-400 font-medium">Rede incorreta detectada</p>
                <p className="text-yellow-300 text-sm">
                  Você está conectado à {getNetworkName(currentChainId)}. 
                  Para melhor experiência, conecte-se à Sepolia Testnet.
                </p>
              </div>
            </div>
            <button
              onClick={switchToSepolia}
              disabled={isLoading}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
            >
              {isLoading ? 'Trocando...' : 'Trocar para Sepolia'}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2">
              Erro: {error}
            </p>
          )}
        </div>
        {children}
      </>
    );
  }

  // Bloquear acesso completamente
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md w-full">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">
            Rede Não Suportada
          </h2>
          
          <p className="text-gray-300 mb-4">
            Este projeto está em fase de teste e funciona apenas na rede <strong>Sepolia Testnet</strong>.
          </p>
          
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-400 mb-1">Rede atual:</p>
            <p className="text-white font-medium">{getNetworkName(currentChainId)}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={switchToSepolia}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Trocando para Sepolia...
                </span>
              ) : (
                'Trocar para Sepolia Testnet'
              )}
            </button>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">
                  <strong>Erro:</strong> {error}
                </p>
                <p className="text-red-300 text-xs mt-1">
                  Tente trocar manualmente no MetaMask ou recarregue a página.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500">
              💡 <strong>Dica:</strong> Você pode adicionar Sepolia manualmente no MetaMask usando o Chain ID: 11155111
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 