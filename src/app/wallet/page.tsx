"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { SkipLinks } from "@/components/common/SkipLinks";
import { TokenBalance } from "@/components/common/TokenBalance";
import { PurchaseHistory } from "@/components/shop/PurchaseHistory";
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useTokens } from '@/components/auth/TokenProvider';
import { useInvestment } from '@/components/investment/InvestmentProvider';
import { UserAnalytics } from '@/components/analytics/UserAnalytics';

export default function WalletPage() {
  const { isConnected, address } = usePrivyAuth();
  const { balance } = useTokens();
  const {
    stakeOptions,
    stakePositions,
    stakeTokens,
    unstakeTokens,
    governanceTokens,
    buyGovernanceToken,
    tokenPools,
    joinPool,
    nfts,
    ownedNFTs,
    airdrops,
    claimAirdrop,
    installmentPurchases,
    payInstallment,
    isLoading
  } = useInvestment();

  const [activeTab, setActiveTab] = useState<'overview' | 'staking' | 'governance' | 'pools' | 'nfts' | 'airdrops' | 'installments' | 'history' | 'analytics'>('overview');
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [selectedStakeOption, setSelectedStakeOption] = useState<string>('');

  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen gradient-background">
        <SkipLinks />
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Carteira Digital</h1>
            <p className="text-white/80 mb-6">Conecte sua carteira para acessar esta página</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleStake = async () => {
    if (selectedStakeOption && stakeAmount > 0) {
      const success = await stakeTokens(selectedStakeOption, stakeAmount);
      if (success) {
        setStakeAmount(0);
        setSelectedStakeOption('');
      }
    }
  };

  const handleClaimAirdrop = async (airdropId: string) => {
    await claimAirdrop(airdropId);
  };

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: '📊' },
    { id: 'staking', name: 'Staking', icon: '🔒' },
    { id: 'governance', name: 'Governança', icon: '🗳️' },
    { id: 'pools', name: 'Pools', icon: '🏊' },
    { id: 'nfts', name: 'NFTs', icon: '🎨' },
    { id: 'airdrops', name: 'Airdrops', icon: '🪂' },
    { id: 'installments', name: 'Parcelados', icon: '💳' },
    { id: 'history', name: 'Histórico', icon: '📝' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ];

  return (
    <div className="flex flex-col min-h-screen gradient-background">
      <SkipLinks />
      <Header />
      
      <main className="flex-grow w-full">
        <div className="container-responsive section-spacing">
          {/* Wallet Header */}
          <div className="mb-8">
            <h1 className="text-responsive-3xl font-bold text-white mb-4">Minha Carteira</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Saldo Total</h3>
                <p className="text-2xl font-bold text-purple-400">{balance} Tokens</p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Endereço</h3>
                <p className="text-sm text-white/80 font-mono">
                  {address ? `${address.slice(0, 8)}...${address.slice(-8)}` : ''}
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-white/80">Conectado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">Posições de Staking</h3>
                  {stakePositions.length === 0 ? (
                    <p className="text-white/60">Nenhuma posição ativa</p>
                  ) : (
                    <div className="space-y-3">
                      {stakePositions.slice(0, 3).map((position) => (
                        <div key={position.id} className="bg-white/5 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{position.amount} Tokens</span>
                            <span className="text-purple-400 text-sm">{position.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">Airdrops Disponíveis</h3>
                  {airdrops.filter(a => !a.claimed).length === 0 ? (
                    <p className="text-white/60">Nenhum airdrop disponível</p>
                  ) : (
                    <div className="space-y-3">
                      {airdrops.filter(a => !a.claimed).slice(0, 3).map((airdrop) => (
                        <div key={airdrop.id} className="bg-white/5 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-sm">{airdrop.description}</span>
                            <span className="text-green-400 font-medium">{airdrop.amount} Tokens</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Staking Tab */}
            {activeTab === 'staking' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">Opções de Staking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {stakeOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedStakeOption === option.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/20 hover:border-purple-400'
                        }`}
                        onClick={() => setSelectedStakeOption(option.id)}
                      >
                        <h4 className="font-bold text-white mb-2">{option.name}</h4>
                        <p className="text-white/80 text-sm mb-3">{option.description}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">APY:</span>
                            <span className="text-green-400">{option.apy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Duração:</span>
                            <span className="text-white">{option.duration} dias</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Mínimo:</span>
                            <span className="text-white">{option.minTokens} tokens</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedStakeOption && (
                    <div className="border border-white/20 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-3">Fazer Stake</h4>
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-white/80 text-sm mb-2">Quantidade de Tokens</label>
                          <input
                            type="number"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                            placeholder="0"
                            min="0"
                            max={balance}
                          />
                        </div>
                        <button
                          onClick={handleStake}
                          disabled={isLoading || stakeAmount <= 0 || stakeAmount > balance}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                        >
                          {isLoading ? 'Processando...' : 'Stake'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Stakes */}
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">Minhas Posições</h3>
                  {stakePositions.length === 0 ? (
                    <p className="text-white/60">Nenhuma posição ativa</p>
                  ) : (
                    <div className="space-y-4">
                      {stakePositions.map((position) => {
                        const option = stakeOptions.find(o => o.id === position.stakeOptionId);
                        return (
                          <div key={position.id} className="border border-white/20 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-white">{option?.name}</h4>
                                <p className="text-white/60 text-sm">
                                  {position.amount} tokens • {position.rewards.toFixed(2)} recompensa
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                position.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                position.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {position.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-white/60">
                                Fim: {new Date(position.endDate).toLocaleDateString()}
                              </div>
                              {position.status === 'active' && Date.now() >= position.endDate && (
                                <button
                                  onClick={() => unstakeTokens(position.id)}
                                  disabled={isLoading}
                                  className="px-4 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                                >
                                  Retirar
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Governance Tab */}
            {activeTab === 'governance' && (
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Tokens de Governança</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {governanceTokens.map((token) => (
                    <div key={token.id} className="border border-white/20 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-2">{token.name} ({token.symbol})</h4>
                      <p className="text-white/80 text-sm mb-3">{token.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-400 font-medium">{token.price} Tokens</span>
                        <button
                          onClick={() => buyGovernanceToken(token.id, 1)}
                          disabled={isLoading || balance < token.price}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Token Pools Tab */}
            {activeTab === 'pools' && (
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Pools de Liquidez</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tokenPools.map((pool) => (
                    <div key={pool.id} className="border border-white/20 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-2">{pool.name}</h4>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-white/60">APY:</span>
                          <span className="text-green-400">{pool.apy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Liquidez Total:</span>
                          <span className="text-white">${pool.totalLiquidity.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Mín. Contribuição:</span>
                          <span className="text-white">{pool.minContribution} tokens</span>
                        </div>
                      </div>
                      <button
                        onClick={() => joinPool(pool.id, pool.minContribution)}
                        disabled={isLoading || balance < pool.minContribution}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                      >
                        Participar do Pool
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NFTs Tab */}
            {activeTab === 'nfts' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">NFTs Disponíveis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nfts.map((nft) => (
                      <div key={nft.id} className="border border-white/20 rounded-lg p-4">
                        <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-4xl">🎨</span>
                        </div>
                        <h4 className="font-bold text-white mb-2">{nft.name}</h4>
                        <p className="text-white/80 text-sm mb-3">{nft.description}</p>
                        <div className="space-y-1 text-xs">
                          {nft.benefits.map((benefit, index) => (
                            <div key={index} className="text-white/60">• {benefit}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Airdrops Tab */}
            {activeTab === 'airdrops' && (
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Airdrops</h3>
                <div className="space-y-4">
                  {airdrops.map((airdrop) => (
                    <div key={airdrop.id} className="border border-white/20 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white mb-1">{airdrop.description}</h4>
                          <p className="text-white/60 text-sm">
                            {new Date(airdrop.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold">{airdrop.amount} Tokens</div>
                          {airdrop.claimed ? (
                            <span className="text-gray-400 text-sm">Coletado</span>
                          ) : (
                            <button
                              onClick={() => handleClaimAirdrop(airdrop.id)}
                              disabled={isLoading}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors mt-1"
                            >
                              Coletar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Installments Tab */}
            {activeTab === 'installments' && (
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Compras Parceladas</h3>
                {installmentPurchases.length === 0 ? (
                  <p className="text-white/60">Nenhuma compra parcelada ativa</p>
                ) : (
                  <div className="space-y-4">
                    {installmentPurchases.map((purchase) => (
                      <div key={purchase.id} className="border border-white/20 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-white">Produto #{purchase.productId}</h4>
                            <p className="text-white/60 text-sm">
                              {purchase.paidInstallments}/{purchase.installments} parcelas pagas
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            purchase.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' :
                            purchase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {purchase.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-white/60">
                            Próximo pagamento: {new Date(purchase.nextPaymentDate).toLocaleDateString()}
                          </div>
                          {purchase.status === 'active' && (
                            <button
                              onClick={() => payInstallment(purchase.id)}
                              disabled={isLoading || balance < purchase.installmentAmount}
                              className="px-4 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                            >
                              Pagar ({purchase.installmentAmount} tokens)
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="card">
                <PurchaseHistory />
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <UserAnalytics />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 