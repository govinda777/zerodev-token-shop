"use client";

import { usePrivyAuth } from "@/hooks/usePrivyAuth";
import { useTokens } from "@/hooks/useTokens";
import { useState } from "react";

export function UserMenu() {
  const { 
    isAuthenticated, 
    address, 
    userInfo, 
    disconnect 
  } = usePrivyAuth();
  
  const { balance } = useTokens();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="text-left">
          <p className="text-white text-sm font-medium">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Usuário"}
          </p>
          <p className="text-gray-400 text-xs">{balance} tokens</p>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4">
            {/* User Info Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">
                  {userInfo?.email || (address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "Usuário")}
                </p>
                <p className="text-gray-400 text-sm">
                  {userInfo?.id ? `ID: ${userInfo.id.slice(0, 8)}...` : "Conta conectada"}
                </p>
              </div>
            </div>

            {/* Token Balance */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-blue-400 font-medium text-sm">Saldo</span>
                </div>
                <span className="text-blue-300 font-bold">{balance} tokens</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 mb-4">
              {address && (
                <button
                  onClick={() => {
                    window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-sm">Ver no Etherscan</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(address || '');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Copiar Endereço</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  disconnect();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Desconectar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 