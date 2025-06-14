"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { SkipLinks } from "@/components/common/SkipLinks";
import { WalletInfo } from "@/components/common/WalletInfo";
import { PurchaseHistory } from "@/components/shop/PurchaseHistory";
import { NetworkGuard } from "@/components/common/NetworkGuard";
import { PaymasterSelector } from "@/components/common/PaymasterSelector";
import { LoginMethodTest } from "@/components/auth/LoginMethodTest";
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useTokens } from '@/components/auth/TokenProvider';
import { useInvestment } from '@/components/investment/InvestmentProvider';
import { useEthBalance } from '@/hooks/useEthBalance';
import { usePaymaster } from '@/hooks/usePaymaster';
import { UserAnalytics } from '@/components/analytics/UserAnalytics';

export default function WalletPage() {
  const { isConnected, address } = usePrivyAuth();
  const { balance } = useTokens();
  const { ethBalance } = useEthBalance();
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

  // Paymaster hook
  const {
    selectedPaymaster,
    changePaymaster,
    paymasterInfo,
    isPaymasterReady,
    error: paymasterError
  } = usePaymaster();

  const [activeTab, setActiveTab] = useState<'overview' | 'staking' | 'governance' | 'pools' | 'nfts' | 'airdrops' | 'installments' | 'history' | 'analytics' | 'paymaster' | 'logintest'>('overview');
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
    { id: 'logintest', name: 'Login Test', icon: '🔐' },
    { id: 'paymaster', name: 'Paymaster', icon: '🚀' },
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
      
      <main className="flex-grow">
        <NetworkGuard>
          <div className="container-responsive section-spacing">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-h1 font-bold text-white mb-4">Carteira Digital</h1>
              <p className="text-body text-white/80 max-w-2xl mx-auto">
                Gerencie seus tokens, investimentos e histórico de transações
              </p>
            </div>

            {/* Wallet Info Card */}
            <div className="mb-8">
              <WalletInfo />
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4">Resumo da Carteira</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Tokens:</span>
                        <span className="text-white font-bold">{balance} tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Saldo ETH:</span>
                        <span className="text-white font-bold">{parseFloat(ethBalance).toFixed(4)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Endereço:</span>
                        <span className="text-white font-mono text-sm">
                          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Posições Ativas:</span>
                        <span className="text-white">{stakePositions.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4">Staking Ativo</h3>
                    <div className="space-y-3">
                      {stakePositions.slice(0, 3).map((position) => (
                        <div key={position.id} className="flex justify-between items-center">
                          <div>
                            <div className="text-white text-sm">{position.optionName}</div>
                            <div className="text-white/60 text-xs">{position.amount} tokens</div>
                          </div>
                          <div className="text-green-400 text-sm">
                            +{position.rewards.toFixed(2)}
                          </div>
                        </div>
                      ))}
                      {stakePositions.length === 0 && (
                        <p className="text-white/60 text-sm">Nenhuma posição ativa</p>
                      )}
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4">Airdrops Disponíveis</h3>
                    <div className="space-y-3">
                      {airdrops.filter(a => a.isEligible && !a.claimed).slice(0, 3).map((airdrop) => (
                        <div key={airdrop.id} className="flex justify-between items-center">
                          <div>
                            <div className="text-white text-sm">{airdrop.name}</div>
                            <div className="text-white/60 text-xs">{airdrop.amount} tokens</div>
                          </div>
                          <button
                            onClick={() => handleClaimAirdrop(airdrop.id)}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                          >
                            Resgatar
                          </button>
                        </div>
                      ))}
                      {airdrops.filter(a => a.isEligible && !a.claimed).length === 0 && (
                        <p className="text-white/60 text-sm">Nenhum airdrop disponível</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Login Test Tab */}
              {activeTab === 'logintest' && (
                <div className="space-y-6">
                  <LoginMethodTest />
                  
                  <div className="card bg-yellow-500/5 border-yellow-500/20">
                    <div className="flex items-start space-x-3">
                      <span className="text-yellow-400 text-xl">⚠️</span>
                      <div>
                        <h4 className="text-yellow-400 font-medium mb-2">Problema com E-mail?</h4>
                                                 <div className="text-yellow-300 text-sm space-y-2">
                           <p>O que você deve ver no modal:</p>
                           <ul className="list-disc list-inside space-y-1 ml-4">
                             <li>📧 **Campo de e-mail** (parte superior) - E-mail genérico</li>
                             <li>🔍 **"Continue with Google"** - Se Google OAuth estiver configurado</li>
                             <li>📱 "Continue with SMS" - Login por telefone</li>
                             <li>👛 "Continue with a wallet" - Carteiras Web3</li>
                           </ul>
                           
                           <div className="bg-yellow-500/20 p-2 rounded mt-3">
                             <p><strong>Importante:</strong> O campo de e-mail no topo já é uma opção de login! Você pode digitar qualquer e-mail e receber um código de verificação.</p>
                           </div>
                           
                           <p className="mt-3">
                             <strong>Se não aparece "Continue with Google":</strong> Acesse o{' '}
                             <a 
                               href="https://dashboard.privy.io" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-yellow-200 underline hover:text-yellow-100"
                             >
                               dashboard do Privy
                             </a>{' '}
                             e habilite o Google OAuth nas configurações.
                           </p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paymaster Tab */}
              {activeTab === 'paymaster' && (
                <div className="space-y-6">
                  <PaymasterSelector
                    selectedPaymaster={selectedPaymaster}
                    onPaymasterChange={changePaymaster}
                  />
                  
                  {paymasterError && (
                    <div className="card border-red-500/50 bg-red-500/10">
                      <div className="flex items-start space-x-3">
                        <span className="text-red-400 text-xl">❌</span>
                        <div>
                          <h4 className="text-red-400 font-medium mb-1">Erro no Paymaster</h4>
                          <p className="text-red-300 text-sm">{paymasterError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Status da Configuração
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Paymaster Atual:</span>
                        <span className="text-white font-medium">{paymasterInfo.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Status:</span>
                        <span className={`font-medium ${isPaymasterReady ? 'text-green-400' : 'text-yellow-400'}`}>
                          {isPaymasterReady ? '✅ Pronto' : '⏳ Configurando...'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Endereço:</span>
                        <span className="text-white/60 text-sm font-mono">
                          {paymasterInfo.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-blue-500/5 border-blue-500/20">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-400 text-xl">ℹ️</span>
                      <div>
                        <h4 className="text-blue-400 font-medium mb-2">Como funciona?</h4>
                        <ul className="text-blue-300 text-sm space-y-1">
                          <li>• <strong>Default Paymaster:</strong> Usa o paymaster padrão do ZeroDev</li>
                          <li>• <strong>Verifying Paymaster:</strong> Patrocina transações com verificação adicional</li>
                          <li>• <strong>ERC20 Paymaster:</strong> Permite pagar gas com tokens ERC20</li>
                        </ul>
                        <div className="mt-3 p-2 bg-blue-500/10 rounded-lg">
                          <p className="text-blue-200 text-xs">
                            <strong>Importante:</strong> Com selfFunded=true, você não precisa se preocupar com fundos na Sepolia!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Staking Tab */}
              {activeTab === 'staking' && (
                <div className="space-y-6">
                  {/* Stake Form */}
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4">Fazer Staking</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Opção de Staking</label>
                        <select
                          value={selectedStakeOption}
                          onChange={(e) => setSelectedStakeOption(e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        >
                          <option value="">Selecione uma opção</option>
                          {stakeOptions.map((option) => (
                            <option key={option.id} value={option.id} className="bg-gray-800">
                              {option.name} - {option.apy}% APY
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Quantidade</label>
                        <input
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(Number(e.target.value))}
                          max={balance}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={handleStake}
                          disabled={!selectedStakeOption || stakeAmount <= 0 || stakeAmount > balance || isLoading}
                          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                          {isLoading ? 'Processando...' : 'Fazer Staking'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Stakes */}
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4">Posições Ativas</h3>
                    <div className="space-y-4">
                      {stakePositions.map((position) => (
                        <div key={position.id} className="border border-white/20 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-white">{position.optionName}</h4>
                              <p className="text-white/60 text-sm">
                                Staked: {position.amount} tokens | APY: {position.apy}%
                              </p>
                            </div>
                            <button
                              onClick={() => unstakeTokens(position.id)}
                              disabled={isLoading}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm rounded transition-colors"
                            >
                              Unstake
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-white/60">Rewards:</span>
                              <span className="text-green-400 ml-2">+{position.rewards.toFixed(4)} tokens</span>
                            </div>
                            <div>
                              <span className="text-white/60">Data de Início:</span>
                              <span className="text-white ml-2">{new Date(position.startDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {stakePositions.length === 0 && (
                        <p className="text-white/60 text-center py-8">Nenhuma posição de staking ativa</p>
                      )}
                    </div>
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
                        <h4 className="font-bold text-white mb-2">{token.name}</h4>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-white/60">Preço:</span>
                            <span className="text-white">{token.price} tokens</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Poder de Voto:</span>
                            <span className="text-white">{token.votingPower}x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Disponível:</span>
                            <span className="text-white">{token.available}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => buyGovernanceToken(token.id, 1)}
                          disabled={isLoading || balance < token.price}
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                        >
                          Comprar 1 Token
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pools Tab */}
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
                  {/* Owned NFTs */}
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4">Meus NFTs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {ownedNFTs.map((nft) => (
                        <div key={nft.id} className="border border-white/20 rounded-lg p-4">
                          <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                            <span className="text-white text-2xl">{nft.image}</span>
                          </div>
                          <h4 className="font-bold text-white mb-1">{nft.name}</h4>
                          <p className="text-white/60 text-sm mb-2">{nft.description}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Raridade:</span>
                            <span className="text-white">{nft.rarity}</span>
                          </div>
                        </div>
                      ))}
                      {ownedNFTs.length === 0 && (
                        <div className="col-span-full text-center py-8">
                          <p className="text-white/60">Você ainda não possui NFTs</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Available NFTs */}
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4">NFTs Disponíveis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {nfts.filter(nft => nft.available).map((nft) => (
                        <div key={nft.id} className="border border-white/20 rounded-lg p-4">
                          <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-3 flex items-center justify-center">
                            <span className="text-white text-2xl">{nft.image}</span>
                          </div>
                          <h4 className="font-bold text-white mb-1">{nft.name}</h4>
                          <p className="text-white/60 text-sm mb-2">{nft.description}</p>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-white text-sm">{nft.price} tokens</div>
                              <div className="text-white/60 text-xs">{nft.rarity}</div>
                            </div>
                            <button
                              disabled={isLoading || balance < nft.price}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm rounded transition-colors"
                            >
                              Comprar
                            </button>
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
                            <h4 className="font-bold text-white mb-1">{airdrop.name}</h4>
                            <p className="text-white/60 text-sm mb-2">{airdrop.description}</p>
                            <div className="flex gap-4 text-sm">
                              <span className="text-white/60">Quantidade: <span className="text-white">{airdrop.amount} tokens</span></span>
                              <span className="text-white/60">Expira: <span className="text-white">{new Date(airdrop.expiryDate).toLocaleDateString()}</span></span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              airdrop.claimed ? 'bg-gray-600 text-gray-300' :
                              airdrop.isEligible ? 'bg-green-600 text-white' :
                              'bg-red-600 text-white'
                            }`}>
                              {airdrop.claimed ? 'Resgatado' : airdrop.isEligible ? 'Elegível' : 'Não Elegível'}
                            </span>
                            {airdrop.isEligible && !airdrop.claimed && (
                              <button
                                onClick={() => handleClaimAirdrop(airdrop.id)}
                                disabled={isLoading}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm rounded transition-colors"
                              >
                                Resgatar
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
                  <div className="space-y-4">
                    {installmentPurchases.map((purchase) => (
                      <div key={purchase.id} className="border border-white/20 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-white">{purchase.productName}</h4>
                            <p className="text-white/60 text-sm">
                              {purchase.paidInstallments}/{purchase.totalInstallments} parcelas pagas
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            purchase.status === 'completed' ? 'bg-green-600' :
                            purchase.status === 'active' ? 'bg-blue-600' :
                            'bg-red-600'
                          } text-white`}>
                            {purchase.status === 'completed' ? 'Concluído' :
                             purchase.status === 'active' ? 'Ativo' : 'Atrasado'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-white/60">Valor Total:</span>
                            <span className="text-white ml-2">{purchase.totalAmount} tokens</span>
                          </div>
                          <div>
                            <span className="text-white/60">Próximo Pagamento:</span>
                            <span className="text-white ml-2">{new Date(purchase.nextPaymentDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {purchase.status === 'active' && (
                          <button
                            onClick={() => payInstallment(purchase.id)}
                            disabled={isLoading || balance < purchase.installmentAmount}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded transition-colors"
                          >
                            Pagar Parcela ({purchase.installmentAmount} tokens)
                          </button>
                        )}
                      </div>
                    ))}
                    {installmentPurchases.length === 0 && (
                      <p className="text-white/60 text-center py-8">Nenhuma compra parcelada</p>
                    )}
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">Histórico de Transações</h3>
                  <PurchaseHistory />
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">Analytics</h3>
                  <UserAnalytics />
                </div>
              )}
            </div>
          </div>
        </NetworkGuard>
      </main>
      
      <Footer />
    </div>
  );
} 