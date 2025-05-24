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
        <section className="relative py-16 md:py-24 lg:py-32" aria-labelledby="hero-title">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="text-purple-200 text-sm font-medium">Marketplace Ativo</span>
              </div>
              
              <h1 id="hero-title" className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading text-white neon-text leading-tight">
                ZeroDev
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                  Token Shop
                </span>
              </h1>
              
              <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12">
                Explore e adquira tokens únicos usando sua carteira digital. 
                <span className="text-purple-300 font-medium"> Conecte-se agora</span> e descubra um mundo de possibilidades.
              </p>

              {/* Stats Section */}
              <section aria-labelledby="stats-title" className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-16">
                <h2 id="stats-title" className="sr-only">Estatísticas da plataforma</h2>
                <div className="glass-card p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">500+</div>
                  <div className="text-white/80 text-xs md:text-sm">Tokens Únicos</div>
                </div>
                <div className="glass-card p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">24/7</div>
                  <div className="text-white/80 text-xs md:text-sm">Disponível</div>
                </div>
                <div className="glass-card p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">1.2K</div>
                  <div className="text-white/80 text-xs md:text-sm">Usuários Ativos</div>
                </div>
                <div className="glass-card p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">98%</div>
                  <div className="text-white/80 text-xs md:text-sm">Satisfação</div>
                </div>
              </section>

              {/* Features */}
              <section aria-labelledby="features-title" className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                <h2 id="features-title" className="sr-only">Características da plataforma</h2>
                <article className="glass-card p-6 md:p-8 text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3">Seguro & Confiável</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">Transações protegidas por smart contracts auditados</p>
                </article>

                <article className="glass-card p-6 md:p-8 text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3">Super Rápido</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">Transações instantâneas com baixas taxas de gas</p>
                </article>

                <article className="glass-card p-6 md:p-8 text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3">Verificado</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">Todos os tokens são verificados e autenticados</p>
                </article>
              </section>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 md:py-24" aria-labelledby="products-title">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="products-title" className="sr-only">Produtos disponíveis</h2>
            <ProductGrid />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
