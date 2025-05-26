"use client";

import { useState } from "react";
import Link from "next/link";
import { TokenBalance } from "@/components/common/TokenBalance";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";
import { useNetworkValidation, getNetworkName } from "@/hooks/useNetworkValidation";

export function Header() {
  const { address, isConnected, isConnecting, connect, disconnect } = usePrivyAuth();
  const { isCorrectNetwork, currentChainId, switchToSepolia } = useNetworkValidation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Criar um displayAddress a partir do address
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const handleLogin = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Erro ao desconectar:', error);
    }
  };

  return (
    <header id="navigation" className="card z-20 sticky top-0 backdrop-blur-md border-b border-white/10 rounded-none">
      <div className="container-responsive">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 focus-ring rounded-lg p-2 -m-2" aria-label="Página inicial do ZeroDev Token Shop">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="icon-lg text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-h3 font-bold font-heading text-white neon-subtle">
                  ZeroDev
                </h1>
                <p className="text-caption text-purple-300 -mt-1 hidden sm:block">Token Shop</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6" aria-label="Navegação principal">
            <Link href="/" className="text-white/90 hover:text-white transition-colors duration-300 flex items-center text-body font-medium focus-ring rounded-lg px-3 py-2">
              <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Início
            </Link>
            <Link href="#products" className="text-white/90 hover:text-white transition-colors duration-300 flex items-center text-body font-medium focus-ring rounded-lg px-3 py-2">
              <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Marketplace
            </Link>
            <Link href="/wallet" className="text-white/90 hover:text-white transition-colors duration-300 flex items-center text-body font-medium focus-ring rounded-lg px-3 py-2">
              <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
              Carteira
            </Link>
          </nav>
          
          {/* User Section */}
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                {/* Network Indicator */}
                <div className={`hidden md:flex items-center px-3 py-2 rounded-full text-xs font-medium ${
                  isCorrectNetwork 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    isCorrectNetwork ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <span className="hidden lg:inline">
                    {isCorrectNetwork ? 'Sepolia' : getNetworkName(currentChainId)}
                  </span>
                  {!isCorrectNetwork && (
                    <button
                      onClick={switchToSepolia}
                      className="ml-2 text-xs underline hover:no-underline"
                    >
                      Trocar
                    </button>
                  )}
                </div>

                {/* Balance Display */}
                <div className="hidden lg:block">
                  <TokenBalance address={address} />
                </div>

                {/* Address Display */}
                <div className="card px-3 py-2 rounded-full border border-purple-500/30 neon-subtle">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" aria-hidden="true"></div>
                    <span className="text-white font-medium text-body-sm">{displayAddress}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isConnecting}
                  className="hidden md:flex btn btn-secondary text-error border-error/30 hover:bg-error/10 focus-ring"
                  aria-label="Desconectar carteira"
                >
                  {isConnecting ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span className="hidden lg:inline">Desconectando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="hidden lg:inline">Sair</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isConnecting}
                className="btn btn-primary focus-ring"
                aria-label="Conectar carteira digital"
              >
                {isConnecting ? (
                  <span className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    <span className="hidden sm:inline">Conectando...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                    </svg>
                    <span className="hidden sm:inline">Conectar</span>
                    <span className="sm:hidden">Login</span>
                  </span>
                )}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden btn btn-secondary p-2 focus-ring"
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="icon-lg text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4">
            <nav className="space-y-2" aria-label="Navegação mobile">
              <Link 
                href="/" 
                className="block text-white/90 hover:text-white transition-colors duration-300 flex items-center py-3 px-3 rounded-lg hover:bg-white/5 text-body font-medium focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="icon-sm mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Início
              </Link>
              <Link 
                href="#products" 
                className="block text-white/90 hover:text-white transition-colors duration-300 flex items-center py-3 px-3 rounded-lg hover:bg-white/5 text-body font-medium focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="icon-sm mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Marketplace
              </Link>
              <Link 
                href="/wallet" 
                className="block text-white/90 hover:text-white transition-colors duration-300 flex items-center py-3 px-3 rounded-lg hover:bg-white/5 text-body font-medium focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="icon-sm mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
                Carteira
              </Link>
              
              {isConnected && (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  {/* Network Status Mobile */}
                  <div className={`mx-3 px-3 py-2 rounded-lg text-sm ${
                    isCorrectNetwork 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          isCorrectNetwork ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <span>
                          Rede: {isCorrectNetwork ? 'Sepolia' : getNetworkName(currentChainId)}
                        </span>
                      </div>
                      {!isCorrectNetwork && (
                        <button
                          onClick={switchToSepolia}
                          className="text-xs underline hover:no-underline"
                        >
                          Trocar
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-3">
                    <TokenBalance address={address} />
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={isConnecting}
                    className="w-full btn btn-secondary text-error border-error/30 hover:bg-error/10 focus-ring"
                  >
                    {isConnecting ? (
                      <>
                        <div className="loading-spinner mr-2"></div>
                        Desconectando...
                      </>
                    ) : (
                      <>
                        <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Desconectar
                      </>
                    )}
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 