"use client";

import { usePrivyAuth } from "@/hooks/usePrivyAuth";
import { useState } from "react";

interface LoginScreenProps {
  onSuccess?: () => void;
}

export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const { 
    isReady, 
    isAuthenticated, 
    isConnecting, 
    connect, 
    address,
    userInfo
  } = usePrivyAuth();
  
  const [loginType, setLoginType] = useState<'wallet' | 'email' | null>(null);

  // Se já estiver conectado, não mostrar a tela de login
  if (isAuthenticated) {
    return null;
  }

  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (type: 'wallet' | 'email') => {
    setLoginType(type);
    try {
      await connect();
      onSuccess?.();
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setLoginType(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Faça seu Login</h1>
          <p className="text-gray-400">Acesse sua conta para continuar</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {/* Wallet Login */}
          <button
            onClick={() => handleLogin('wallet')}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting && loginType === 'wallet' ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
                <span>Conectar com Carteira</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">ou</span>
            </div>
          </div>

          {/* Email Login */}
          <button
            onClick={() => handleLogin('email')}
            disabled={isConnecting}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
          >
            {isConnecting && loginType === 'email' ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Entrar com E-mail</span>
              </>
            )}
          </button>
        </div>

        {/* Features */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Rápido</span>
            </div>
          </div>
        </div>

        {/* Supported Wallets Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Carteiras suportadas:</p>
          <div className="flex justify-center gap-2 opacity-60">
            <span className="text-xs bg-gray-800 px-2 py-1 rounded">MetaMask</span>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded">WalletConnect</span>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded">Coinbase</span>
          </div>
        </div>
      </div>
    </div>
  );
} 