"use client";

import { useTokens } from "@/hooks/useTokens";

export function TokenBalance() {
  const { balance, isLoading } = useTokens();

  if (isLoading) {
    return <div className="text-sm text-gray-500">Carregando...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Saldo:</span>
      <span className="text-sm font-bold">{balance} tokens</span>
    </div>
  );
} 