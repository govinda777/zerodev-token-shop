"use client";

import { useTokens } from "@/hooks/useTokens";

interface TokenBalanceProps {
  address?: string;
  className?: string;
}

export function TokenBalance({ address, className = "" }: TokenBalanceProps) {
  const { balance, isLoading } = useTokens();

  if (isLoading) {
    return (
      <div className={`hidden sm:block text-sm bg-purple-900/30 text-white px-4 py-2 rounded-full font-medium border border-purple-500/30 ${className}`}>
        <span className="text-purple-300">Balance:</span> 
        <span className="ml-1 font-bold animate-pulse">...</span>
      </div>
    );
  }

  return (
    <div className={`hidden sm:block text-sm bg-purple-900/30 text-white px-4 py-2 rounded-full font-medium border border-purple-500/30 ${className}`}>
      <span className="text-purple-300">Balance:</span> 
      <span className="ml-1 font-bold">{balance || "0.00"} ETH</span>
    </div>
  );
} 