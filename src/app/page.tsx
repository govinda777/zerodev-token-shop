"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { SkipLinks } from "@/components/common/SkipLinks";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { LoginDemo } from "@/components/auth/LoginDemo";
import { NetworkGuard } from "@/components/common/NetworkGuard";
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { ProductProvider } from '@/components/shop/ProductProvider';
import { FaucetComponent } from '@/components/tools/FaucetComponent';
import { StakingComponent } from '@/components/investment/StakingComponent';
import { PassiveIncomeComponent } from '@/components/investment/PassiveIncomeComponent';
import { NFTMarketplace } from '@/components/nft/NFTMarketplace';
import { AirdropComponent } from '@/components/rewards/AirdropComponent';


// Componente interno simplificado
function HomeContent() {
  const { isConnected } = usePrivyAuth();

  return (
    <div className="flex flex-col min-h-screen gradient-background">
      <SkipLinks />
      <Header />
      
      <main id="main-content" className="flex-grow w-full">
        <ProductProvider>
          {/* Hero Section */}
          <section className="relative section-spacing" aria-labelledby="hero-title">
            <div className="container-responsive">
              <div className="text-center space-content">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-8">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span className="text-purple-200 text-body-sm font-medium">Marketplace Ativo - Apenas Sepolia Testnet</span>
                </div>
                
                {/* Main Title */}
                <h1 id="hero-title" className="text-display font-bold mb-6 font-heading text-white neon-text leading-tight">
                  ZeroDev
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                    Token Shop
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-body-lg text-white/90 max-w-3xl mx-auto leading-relaxed space-elements">
                  Explore e adquira tokens únicos usando sua carteira digital. 
                  <span className="text-purple-300 font-medium"> Conecte-se na rede Sepolia</span> e descubra um mundo de possibilidades.
                </p>

                {/* Welcome Section - só mostra se conectado */}
                {isConnected && (
                  <div className="bg-black/20 border border-white/20 rounded-lg p-6 max-w-2xl mx-auto space-elements">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="text-green-400 font-medium">Bem-vindo ao Marketplace!</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="text-white font-medium">Todas as funcionalidades estão liberadas!</div>
                      <div className="text-white/70 text-sm">Explore todos os produtos e recursos disponíveis</div>
                    </div>
                  </div>
                )}

                {/* Network Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 max-w-2xl mx-auto space-elements">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-blue-400 font-medium text-sm">Projeto em Fase de Teste</span>
                  </div>
                  <p className="text-blue-300 text-sm">
                    Este marketplace funciona exclusivamente na <strong>Sepolia Testnet</strong>. 
                    Certifique-se de estar conectado à rede correta para acessar todas as funcionalidades.
                  </p>
                </div>

                {/* Features */}
                <section aria-labelledby="features-title" className="grid-features max-w-6xl mx-auto">
                  <h2 id="features-title" className="sr-only">Características da plataforma</h2>
                  
                  <article className="card card-hover text-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                      <svg className="icon-lg text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-h3 font-bold text-white mb-3">Seguro & Confiável</h3>
                    <p className="text-white/80 text-body leading-relaxed">Transações protegidas por smart contracts auditados</p>
                  </article>

                  <article className="card card-hover text-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                      <svg className="icon-lg text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-h3 font-bold text-white mb-3">Super Rápido</h3>
                    <p className="text-white/80 text-body leading-relaxed">Transações instantâneas com baixas taxas de gas</p>
                  </article>

                  <article className="card card-hover text-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                      <svg className="icon-lg text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-h3 font-bold text-white mb-3">Verificado</h3>
                    <p className="text-white/80 text-body leading-relaxed">Todos os tokens são verificados e autenticados</p>
                  </article>
                </section>
              </div>
            </div>
          </section>

          {/* Conditional Rendering for Login or Tools/Products */}
          {!isConnected ? (
            <section className="section-spacing bg-black/10" aria-labelledby="auth-demo-title">
              <div className="container-responsive">
                <h2 id="auth-demo-title" className="sr-only">Demonstração de autenticação</h2>
                <LoginDemo />
              </div>
            </section>
          ) : (
            <>
              {/* Tools Section */}
              <section id="tools" className="section-spacing bg-black/10" aria-labelledby="tools-title">
                <div className="container-responsive">
                  <div className="text-center mb-8">
                    <h2 id="tools-title" className="text-h2 font-bold text-white mb-4">
                      Ferramentas e Recursos
                    </h2>
                    <p className="text-white/80 text-body-lg mb-8">
                      Acesse ferramentas úteis para gerenciar seus tokens e interagir com a plataforma
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Faucet */}
                    <div className="bg-black/20 border border-white/20 rounded-lg p-6">
                      <NetworkGuard>
                        <FaucetComponent />
                      </NetworkGuard>
                    </div>
                    
                    {/* Placeholder para outras ferramentas */}
                    <div className="card text-center">
                      <div className="text-4xl mb-4">🔧</div>
                      <h3 className="text-h3 font-bold text-white mb-2">Mais Ferramentas</h3>
                      <p className="text-white/80 mb-4">
                        Novas funcionalidades em breve!
                      </p>
                      <button
                        disabled
                        className="w-full bg-gray-600 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        Em Desenvolvimento
                      </button>
                    </div>
                    
                    <div className="card text-center">
                      <div className="text-4xl mb-4">⚡</div>
                      <h3 className="text-h3 font-bold text-white mb-2">Recursos Avançados</h3>
                      <p className="text-white/80 mb-4">
                        Funcionalidades especiais chegando em breve
                      </p>
                      <button
                        disabled
                        className="w-full bg-gray-600 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        Em Breve
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Investimentos e Recursos Avançados */}
              <section id="investments" className="section-spacing bg-black/10" aria-labelledby="investments-title">
                <div className="container-responsive">
                  <div className="text-center mb-8">
                    <h2 id="investments-title" className="text-h2 font-bold text-white mb-4">
                      Investimentos e Recursos Avançados
                    </h2>
                    <p className="text-white/80 text-body-lg mb-8">
                      Explore todas as funcionalidades de investimento e recursos especiais da plataforma
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {/* Staking */}
                    <div className="bg-black/20 border border-white/20 rounded-lg p-6">
                      <NetworkGuard>
                        <StakingComponent />
                      </NetworkGuard>
                    </div>
                    
                    {/* Passive Income */}
                    <div className="bg-black/20 border border-white/20 rounded-lg p-6">
                      <NetworkGuard>
                        <PassiveIncomeComponent />
                      </NetworkGuard>
                    </div>
                    
                    {/* NFT Marketplace */}
                    <div className="bg-black/20 border border-white/20 rounded-lg p-6">
                      <NetworkGuard>
                        <NFTMarketplace />
                      </NetworkGuard>
                    </div>
                    
                    {/* Airdrop */}
                    <div className="bg-black/20 border border-white/20 rounded-lg p-6">
                      <NetworkGuard>
                        <AirdropComponent />
                      </NetworkGuard>
                    </div>
                    
                    {/* Subscription Services - COMENTADO TEMPORARIAMENTE */}
                    {/*
                    <div className="col-span-1 lg:col-span-2">
                      <div className="bg-black/20 border border-white/20 rounded-lg p-6">
                        <NetworkGuard>
                          <SubscriptionComponent />
                        </NetworkGuard>
                      </div>
                    </div>
                    */}
                    
                    {/* Placeholder para subscription */}
                    <div className="col-span-1 lg:col-span-2">
                      <div className="bg-black/20 border border-white/20 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-4xl mb-4">⭐</div>
                          <h3 className="text-h3 font-bold text-white mb-2">Assinaturas Premium</h3>
                          <p className="text-white/80 mb-4">
                            Planos de assinatura premium em desenvolvimento
                          </p>
                          <button
                            disabled
                            className="w-full bg-gray-600 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
                          >
                            Em Breve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Products Section */}
              <section id="products" className="section-spacing bg-black/20" aria-labelledby="products-title">
                <div className="container-responsive">
                  <div className="text-center mb-8">
                    <h2 id="products-title" className="text-h2 font-bold text-white mb-4">
                      Nossos Produtos
                    </h2>
                    <p className="text-white/80 text-body-lg mb-8">
                      Explore nossa coleção de tokens e produtos digitais
                    </p>
                  </div>
                  <NetworkGuard>
                    <ProductGrid />
                  </NetworkGuard>
                </div>
              </section>
            </>
          )}
        </ProductProvider>
      </main>
      
      <Footer />
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
