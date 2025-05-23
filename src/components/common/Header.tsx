"use client";

import { useState } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { TokenBalance } from "@/components/common/TokenBalance";
import { useAuth } from "@/components/auth/useAuth";
import { useTokens } from "@/hooks/useTokens";

export function Header() {
  const { address, isConnected, connect, disconnect } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Criar um displayAddress a partir do address
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await connect();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="glass z-10 sticky top-0 backdrop-blur-md py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold font-heading text-white neon-text">
              ZeroDev Token Shop
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm bg-purple-900/30 text-white px-4 py-2 rounded-full font-medium border border-purple-500/30 neon-box">
                  {displayAddress}
                </div>
                
                <button
                  onClick={disconnect}
                  className="btn-secondary text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 