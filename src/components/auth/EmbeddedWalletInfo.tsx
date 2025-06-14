"use client";

import { usePrivyAuth } from "@/hooks/usePrivyAuth";

export function EmbeddedWalletInfo() {
  const { isAuthenticated, user } = usePrivyAuth();

  // Só mostrar se estiver autenticado e tiver carteira
  if (!isAuthenticated || !user || !user.wallet?.address) {
    return null;
  }

  // Verificar se é login social (tem email)
  const hasEmail = !!(user as any)?.email?.address;
  
  // Verificar se não tem MetaMask disponível (indicativo de carteira embarcada)
  const isEmbeddedWallet = typeof window !== 'undefined' && !window?.ethereum;

  // Só mostrar para logins sociais ou quando não há MetaMask
  if (!hasEmail && !isEmbeddedWallet) {
    return null;
  }

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="text-blue-400 font-medium mb-2">Carteira Embarcada Ativa</h4>
          <p className="text-blue-300 text-sm mb-3">
            Você está usando uma carteira embarcada criada pelo Privy. Esta carteira permite:
          </p>
          <ul className="text-blue-300 text-sm space-y-1 mb-3">
            <li>• ✅ Receber tokens</li>
            <li>• ✅ Visualizar saldo</li>
            <li>• ✅ Participar do sistema de recompensas</li>
            <li>• ⚠️ Transações blockchain limitadas</li>
          </ul>
          <div className="bg-blue-500/20 rounded-lg p-3 mb-3">
            <p className="text-blue-200 text-xs">
              <strong>Informação técnica:</strong> Para transações blockchain completas, conecte uma carteira externa como MetaMask.
            </p>
          </div>
          <p className="text-blue-300 text-xs">
            Endereço da carteira: {user.wallet.address.slice(0, 10)}...{user.wallet.address.slice(-8)}
          </p>
        </div>
      </div>
    </div>
  );
} 