"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { SkipLinks } from "@/components/common/SkipLinks";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { LoginDemo } from "@/components/auth/LoginDemo";
import { NetworkGuard } from "@/components/common/NetworkGuard";
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { ProductProvider } from '@/components/shop/ProductProvider';
import { JourneyProvider, useJourney } from '@/components/journey/JourneyProvider';
import { JourneyDashboard } from '@/components/journey/JourneyDashboard'; // Import JourneyDashboard


// Componente interno que usa o hook useJourney
function HomeContent() {
  const { isConnected } = usePrivyAuth();
  const { journey, getNextAvailableMission } = useJourney(); // getNextAvailableMission might still be needed for isJourneyComplete logic

  const progressPercentage = (journey.completedMissions.length / journey.missions.length) * 100;
  // Journey is complete if there are no more available missions OR if all missions are in completedMissions
  const isJourneyComplete = !getNextAvailableMission() || (journey.missions.length > 0 && journey.completedMissions.length === journey.missions.length);
  const nextMissionInfo = getNextAvailableMission(); // For hero section display

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

                {/* Progress Section - só mostra se conectado */}
                {isConnected && (
                  <div className="bg-black/20 border border-white/20 rounded-lg p-6 max-w-2xl mx-auto space-elements">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="text-purple-400 font-medium">Progresso da Jornada</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-white/60 text-sm mt-2">
                        {journey.completedMissions.length} de {journey.missions.length} etapas concluídas
                      </div>
                    </div>

                    {/* Next Mission Info */}
                    {nextMissionInfo && !isJourneyComplete && (
                      <div className="text-center">
                        <div className="text-2xl mb-2">{nextMissionInfo.icon}</div>
                        <div className="text-white font-medium">Próxima Etapa: {nextMissionInfo.title}</div>
                        <div className="text-white/70 text-sm">{nextMissionInfo.description}</div>
                      </div>
                    )}

                    {isJourneyComplete && (
                      <div className="text-center">
                        <div className="text-4xl mb-2">🏆</div>
                        <div className="text-green-400 font-medium">Jornada Completa!</div>
                        <div className="text-white/70 text-sm">Todas as funcionalidades desbloqueadas</div>
                      </div>
                    )}
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

          {/* Conditional Rendering for Login or Journey/Products */}
          {!isConnected ? (
            <section className="section-spacing bg-black/10" aria-labelledby="auth-demo-title">
              <div className="container-responsive">
                <h2 id="auth-demo-title" className="sr-only">Demonstração de autenticação</h2>
                <LoginDemo />
              </div>
            </section>
          ) : (
            <>

              <JourneyDashboard />
              {isJourneyComplete && (
                <section id="products" className="section-spacing bg-black/20" aria-labelledby="products-title">
                  <div className="container-responsive">
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-4">🎉</div>
                      <h2 id="products-title" className="text-h2 font-bold text-white mb-4">
                        Parabéns! Jornada Completa!
                      </h2>
                      <p className="text-white/80 text-body-lg mb-8">
                        Você desbloqueou todas as funcionalidades. Agora explore nossos produtos!
                      </p>
                    </div>
                    <NetworkGuard>
                      <ProductGrid />
                    </NetworkGuard>
                  </div>
                </section>
              )}
            </>
          )}
        </ProductProvider>
      </main>
      
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <JourneyProvider>
      <HomeContent />
    </JourneyProvider>
  );
}
