"use client";

import { useState } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useProducts } from './ProductProvider';

export const IntegratedWallet = () => {
  const { balance, addTokens } = useTokens();
  const { address, isConnected, user } = usePrivyAuth();
  const { products, purchases, buyProduct } = useProducts();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'tools'>('overview');

  // Calcular estatísticas
  const totalSpent = purchases.reduce((total, purchase) => total + purchase.price, 0);
  const totalPurchases = purchases.length;
  const averageSpent = totalPurchases > 0 ? totalSpent / totalPurchases : 0;

  // Simular histórico de transações (incluindo compras e adições de tokens)
  const getTransactionHistory = () => {
    const transactions = [
      ...purchases.map(purchase => ({
        id: `purchase-${purchase.timestamp}`,
        type: 'purchase' as const,
        amount: -purchase.price,
        description: `Compra do produto ${purchase.productId}`,
        timestamp: purchase.timestamp,
      })),
      // Simular algumas adições de tokens
      { id: 'welcome-1', type: 'reward' as const, amount: 10, description: 'Bônus de boas-vindas', timestamp: Date.now() - 86400000 },
      { id: 'faucet-1', type: 'faucet' as const, amount: 25, description: 'Tokens do faucet', timestamp: Date.now() - 43200000 },
    ].sort((a, b) => b.timestamp - a.timestamp);

    return transactions;
  };

  const transactions = getTransactionHistory();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return '🛒';
      case 'reward': return '🎁';
      case 'faucet': return '🚰';
      default: return '💰';
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-400' : 'text-red-400';
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-xl shadow-2xl transition-all duration-300 ${
      isExpanded ? 'w-96 h-[600px]' : 'w-80 h-auto'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Carteira Digital</h3>
              <p className="text-gray-400 text-xs">ZeroDev Wallet</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Wallet Status */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-gray-300 text-sm">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>

        {isConnected && address && (
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
            <div className="text-gray-400 text-xs mb-1">Endereço</div>
            <div className="text-white font-mono text-sm">{address.slice(0, 6)}...{address.slice(-4)}</div>
          </div>
        )}

        {/* Balance */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 mb-4">
          <div className="text-gray-300 text-sm mb-1">Saldo Total</div>
          <div className="text-2xl font-bold text-white">{balance}</div>
          <div className="text-purple-300 text-sm">Tokens</div>
        </div>

        {!isExpanded && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addTokens(10)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-lg transition-colors"
            >
              + 10 Tokens
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-lg transition-colors"
            >
              Ver Mais
            </button>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {[
              { id: 'overview', label: 'Visão Geral', icon: '📊' },
              { id: 'transactions', label: 'Histórico', icon: '📋' },
              { id: 'tools', label: 'Ferramentas', icon: '🔧' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs">Total Gasto</div>
                    <div className="text-white font-bold">{totalSpent}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs">Compras</div>
                    <div className="text-white font-bold">{totalPurchases}</div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Produtos Disponíveis</div>
                  <div className="text-white font-bold text-lg">{products.length}</div>
                  <div className="text-gray-400 text-xs">Itens no marketplace</div>
                </div>

                {averageSpent > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Gasto Médio</div>
                    <div className="text-white font-bold">{averageSpent.toFixed(1)} tokens</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-2">
                <div className="text-gray-300 text-sm font-medium mb-3">Transações Recentes</div>
                {transactions.length > 0 ? (
                  transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                          <div>
                            <div className="text-white text-sm font-medium">
                              {transaction.description}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {new Date(transaction.timestamp).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold text-sm ${getTransactionColor(transaction.amount)}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-4xl mb-2">📋</div>
                    <div className="text-sm">Nenhuma transação ainda</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-3">
                <div className="text-gray-300 text-sm font-medium mb-3">Utilitários</div>
                
                <button
                  onClick={() => addTokens(10)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>💰</span>
                  <span>Adicionar 10 Tokens</span>
                </button>

                <button
                  onClick={() => addTokens(50)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>🎁</span>
                  <span>Adicionar 50 Tokens</span>
                </button>

                <button
                  onClick={() => {
                    if (products.length > 0) {
                      const firstProduct = products[0];
                      buyProduct(firstProduct.id);
                    }
                  }}
                  disabled={products.length === 0 || balance < (products[0]?.price || 0)}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>🛒</span>
                  <span>Teste de Compra</span>
                </button>

                <button
                  onClick={() => {
                    console.clear();
                    console.log('🧹 Console limpo - Carteira Digital ZeroDev');
                    console.log('📊 Estado atual:', {
                      balance,
                      address,
                      isConnected,
                      purchases: purchases.length,
                      products: products.length
                    });
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>🧹</span>
                  <span>Limpar Console</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Manter compatibilidade com o nome antigo
export const DebugPanel = IntegratedWallet; 