"use client";

import { useState } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { TokenBalance } from "@/components/common/TokenBalance";
import { useAuth } from "@/components/auth/useAuth";
import { useTokens } from "@/hooks/useTokens";

export function Header() {
  const { displayAddress, isConnected, login, logout, tokens, isFirstLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold my-2">ZeroDev Token Shop</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <div className="bg-blue-50 px-3 py-1.5 rounded-full text-blue-700 text-sm font-medium">
                  {tokens} Tokens
                </div>
                
                <div className="text-sm text-gray-600">
                  {displayAddress}
                </div>
                
                <button
                  onClick={logout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Disconnect
                </button>
                
                {isFirstLogin && (
                  <div className="bg-green-100 text-green-800 text-sm px-3 py-1.5 rounded-md">
                    +10 Welcome Tokens!
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:bg-blue-400"
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