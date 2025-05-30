"use client";

import { useTokens } from "@/hooks/useTokens";
import { useEthBalance } from "@/hooks/useEthBalance";
import { useEffect, useState } from "react";

interface TokenBalanceProps {
  className?: string;
}

export function TokenBalance({ className = "" }: TokenBalanceProps) {
  const { balance: tokenBalance, isLoading: tokensLoading, isFirstLogin } = useTokens();
  const { ethBalance, isLoading: ethLoading, error } = useEthBalance();
  const [previousBalance, setPreviousBalance] = useState(tokenBalance);
  const [isBalanceUpdated, setIsBalanceUpdated] = useState(false);

  const isLoading = tokensLoading || ethLoading;

  useEffect(() => {
    if (tokenBalance !== previousBalance && previousBalance !== 0) {
      setIsBalanceUpdated(true);
      const timer = setTimeout(() => setIsBalanceUpdated(false), 2000);
      return () => clearTimeout(timer);
    }
    setPreviousBalance(tokenBalance);
  }, [tokenBalance, previousBalance]);

  if (isLoading) {
    return (
      <div className={`text-sm bg-purple-900/30 text-white px-4 py-2 rounded-full font-medium border border-purple-500/30 ${className}`}>
        <span className="text-purple-300">Balance:</span> 
        <span className="ml-1 font-bold animate-pulse">...</span>
      </div>
    );
  }

  return (
    <div className={`text-sm bg-purple-900/30 text-white px-4 py-2 rounded-full font-medium border border-purple-500/30 ${className} ${isBalanceUpdated ? 'ring-2 ring-green-400 ring-opacity-50' : ''} transition-all duration-500`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <div className="flex items-center">
          <span className="text-purple-300">Tokens:</span> 
          <span className={`ml-1 font-bold transition-all duration-300 ${isBalanceUpdated ? 'text-green-400 scale-110' : ''} ${isFirstLogin ? 'text-yellow-300' : ''}`}>
            {tokenBalance || "0"}
          </span>
          {isFirstLogin && (
            <span className="ml-1 text-xs text-yellow-300 animate-pulse">🎉</span>
          )}
        </div>
        <div>
          <span className="text-purple-300">ETH:</span> 
          <span className="ml-1 font-bold">
            {error ? "Error" : `${parseFloat(ethBalance).toFixed(4)}`}
          </span>
        </div>
      </div>
    </div>
  );
} 