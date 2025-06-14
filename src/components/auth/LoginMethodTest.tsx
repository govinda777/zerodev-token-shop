"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';

export function LoginMethodTest() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);

  if (!ready) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Carregando métodos de login...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authenticated) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">✅ Login realizado com sucesso!</h3>
        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-white/60">ID do usuário:</span>
            <span className="text-white ml-2">{user?.id}</span>
          </div>
          {user?.email?.address && (
            <div className="text-sm">
              <span className="text-white/60">E-mail:</span>
              <span className="text-white ml-2">{user.email.address}</span>
            </div>
          )}
          {user?.wallet?.address && (
            <div className="text-sm">
              <span className="text-white/60">Carteira:</span>
              <span className="text-white ml-2 font-mono">{user.wallet.address}</span>
            </div>
          )}
          {user?.phone?.number && (
            <div className="text-sm">
              <span className="text-white/60">Telefone:</span>
              <span className="text-white ml-2">{user.phone.number}</span>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Fazer Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-white mb-4">🔐 Teste de Métodos de Login</h3>
      <div className="space-y-4">
        <div className="text-sm text-white/80">
          <p className="mb-2">Métodos de login configurados:</p>
          <ul className="list-disc list-inside space-y-1 text-white/60">
            <li>📧 E-mail (genérico com código)</li>
            <li>🔍 Google OAuth (login direto)</li>
            <li>👛 Carteira externa (MetaMask, WalletConnect)</li>
            <li>📱 SMS (telefone)</li>
          </ul>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">💡</span>
            <div>
              <p className="text-blue-300 text-sm">
                <strong>Dica:</strong> Se o e-mail não aparecer, pode ser uma configuração no dashboard do Privy.
              </p>
              <p className="text-blue-300/80 text-xs mt-1">
                Verifique se o OAuth está habilitado no painel de controle.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Carregando...</span>
            </span>
          ) : (
            'Abrir Modal de Login'
          )}
        </button>

        <div className="text-xs text-white/50 text-center">
          O modal do Privy deve mostrar opções para e-mail, carteira e SMS
        </div>
      </div>
    </div>
  );
} 