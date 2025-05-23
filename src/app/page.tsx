"use client";

import { Header } from "@/components/common/Header";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { useAuth } from '@/components/auth/useAuth';

export default function Home() {
  const { isConnected } = useAuth();

  return (
    <div className="flex flex-col min-h-screen gradient-background">
      <Header />
      
      <main className="flex-grow w-full">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-purple-200 text-sm font-medium">Marketplace Ativo</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 font-heading text-white neon-text leading-tight">
                ZeroDev
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                  Token Shop
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
                Explore e adquira tokens únicos usando sua carteira digital. 
                <span className="text-purple-300 font-medium"> Conecte-se agora</span> e descubra um mundo de possibilidades.
              </p>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
                  <div className="text-white/70 text-sm">Tokens Únicos</div>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                  <div className="text-white/70 text-sm">Disponível</div>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">1.2K</div>
                  <div className="text-white/70 text-sm">Usuários Ativos</div>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                  <div className="text-white/70 text-sm">Satisfação</div>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Seguro & Confiável</h3>
                  <p className="text-white/70">Transações protegidas por smart contracts auditados</p>
                </div>

                <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Super Rápido</h3>
                  <p className="text-white/70">Transações instantâneas com baixas taxas de gas</p>
                </div>

                <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Verificado</h3>
                  <p className="text-white/70">Todos os tokens são verificados e autenticados</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <ProductGrid />
          </div>
        </section>
      </main>
      
      <footer className="glass py-12 mt-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4 neon-text">ZeroDev Token Shop</h3>
              <p className="text-white/60 leading-relaxed">
                A plataforma líder em tokens digitais únicos. Conecte sua carteira e explore um universo de possibilidades.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/60 hover:text-purple-300 transition-colors">Marketplace</a>
                <a href="#" className="block text-white/60 hover:text-purple-300 transition-colors">Minha Carteira</a>
                <a href="#" className="block text-white/60 hover:text-purple-300 transition-colors">Histórico</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/60 hover:text-purple-300 transition-colors">Central de Ajuda</a>
                <a href="#" className="block text-white/60 hover:text-purple-300 transition-colors">FAQ</a>
                <a href="#" className="block text-white/60 hover:text-purple-300 transition-colors">Contato</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} ZeroDev Token Shop. Todos os direitos reservados.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-white/60 hover:text-purple-300 transition-colors text-sm">
                  Termos de Uso
                </a>
                <a href="#" className="text-white/60 hover:text-purple-300 transition-colors text-sm">
                  Política de Privacidade
                </a>
                <a href="#" className="text-white/60 hover:text-purple-300 transition-colors text-sm">
                  Suporte
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
