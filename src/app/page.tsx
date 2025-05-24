"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { SkipLinks } from "@/components/common/SkipLinks";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { useAuth } from '@/components/auth/useAuth';

export default function Home() {
  const { isConnected } = useAuth();

  return (
    <div className="flex flex-col min-h-screen gradient-background">
      <SkipLinks />
      <Header />
      
      <main id="main-content" className="flex-grow w-full">
        {/* Hero Section */}
        <section className="relative section-spacing" aria-labelledby="hero-title">
          <div className="container-responsive">
            <div className="text-center space-content">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="text-purple-200 text-sm font-medium">Marketplace Ativo</span>
              </div>
              
              <h1 id="hero-title" className="text-responsive-3xl lg:text-7xl font-bold mb-6 font-heading text-white neon-text leading-tight">
                ZeroDev
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                  Token Shop
                </span>
              </h1>
              
              <p className="text-responsive-base lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12">
                Explore e adquira tokens únicos usando sua carteira digital. 
                <span className="text-purple-300 font-medium"> Conecte-se agora</span> e descubra um mundo de possibilidades.
              </p>

              {/* Stats Section */}
              <section aria-labelledby="stats-title" className="card-grid-auto max-w-5xl mx-auto mb-16">
                <h2 id="stats-title" className="sr-only">Estatísticas da plataforma</h2>
                <div className="card text-center hover-lift">
                  <div className="text-responsive-2xl font-bold text-purple-400 mb-2">500+</div>
                  <div className="text-white/80 text-responsive-xs">Tokens Únicos</div>
                </div>
                <div className="card text-center hover-lift">
                  <div className="text-responsive-2xl font-bold text-purple-400 mb-2">24/7</div>
                  <div className="text-white/80 text-responsive-xs">Disponível</div>
                </div>
                <div className="card text-center hover-lift">
                  <div className="text-responsive-2xl font-bold text-purple-400 mb-2">1.2K</div>
                  <div className="text-white/80 text-responsive-xs">Usuários Ativos</div>
                </div>
                <div className="card text-center hover-lift">
                  <div className="text-responsive-2xl font-bold text-purple-400 mb-2">98%</div>
                  <div className="text-white/80 text-responsive-xs">Satisfação</div>
                </div>
              </section>

              {/* Features */}
              <section aria-labelledby="features-title" className="card-grid-auto max-w-6xl mx-auto">
                <h2 id="features-title" className="sr-only">Características da plataforma</h2>
                <article className="card text-center group hover-lift">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-responsive-lg font-bold text-white mb-3">Seguro & Confiável</h3>
                  <p className="text-white/80 text-responsive-sm leading-relaxed">Transações protegidas por smart contracts auditados</p>
                </article>

                <article className="card text-center group hover-lift">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-responsive-lg font-bold text-white mb-3">Super Rápido</h3>
                  <p className="text-white/80 text-responsive-sm leading-relaxed">Transações instantâneas com baixas taxas de gas</p>
                </article>

                <article className="card text-center group hover-lift">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-responsive-lg font-bold text-white mb-3">Verificado</h3>
                  <p className="text-white/80 text-responsive-sm leading-relaxed">Todos os tokens são verificados e autenticados</p>
                </article>
              </section>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="section-spacing" aria-labelledby="products-title">
          <div className="container-responsive">
            <h2 id="products-title" className="sr-only">Produtos disponíveis</h2>
            <ProductGrid />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
