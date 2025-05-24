"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/components/auth/useAuth";
import type { Product } from "@/types/product";

export function ProductGrid() {
  const { products, isLoading, error, purchaseProduct } = useProducts();
  const { isConnected } = useAuth();

  if (!isConnected) {
    return (
      <div className="text-center py-16 md:py-20" role="alert" aria-live="polite">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 md:p-12 rounded-2xl border border-purple-500/20 neon-box relative overflow-hidden">
            {/* Background animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse" aria-hidden="true"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-purple-500/30 rounded-full mx-auto flex items-center justify-center mb-6 md:mb-8 bg-purple-500/10">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6 md:w-7 md:h-7 text-purple-400"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 neon-text">Conecte sua carteira</h3>
              <p className="text-white/80 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                Conecte-se para visualizar os produtos disponíveis e começar suas compras
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm text-white/80">
                <div className="flex items-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Seguro
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Rápido
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confiável
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-16 md:py-20" role="status" aria-live="polite">
        <div className="max-w-md mx-auto">
          <div className="relative">
            {/* Loading spinner with gradient */}
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 relative" aria-hidden="true">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 animate-spin animation-delay-150"></div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-white mb-4 neon-text">
              Carregando produtos...
            </h2>
            <p className="text-white/80 text-sm md:text-base">Buscando os melhores tokens para você</p>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-2 mt-6" aria-hidden="true">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        </div>
        <span className="sr-only">Carregando produtos disponíveis</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 md:py-20" role="alert" aria-live="assertive">
        <div className="max-w-lg mx-auto">
          <div className="glass-card p-8 md:p-12 rounded-2xl border border-red-500/30 relative overflow-hidden">
            {/* Error background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5" aria-hidden="true"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 rounded-full bg-red-500/20 flex items-center justify-center border-4 border-red-500/30">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-6 h-6 md:w-7 md:h-7 text-red-400"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Erro ao carregar produtos</h3>
              <p className="text-white/90 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">{error.message}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black min-h-[44px] text-sm md:text-base"
                  aria-label="Recarregar página para tentar novamente"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tentar Novamente
                </button>
                
                <button 
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black min-h-[44px] text-sm md:text-base"
                  aria-label="Reportar problema técnico"
                >
                  Reportar Problema
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section aria-labelledby="products-section-title">
      {/* Section Header */}
      <div className="text-center space-content">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-6">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" aria-hidden="true"></div>
          <span className="text-purple-200 text-sm font-medium">Marketplace</span>
        </div>
        
        <h2 id="products-section-title" className="text-responsive-3xl font-bold mb-4 md:mb-6 font-heading text-white neon-text">
          Produtos Disponíveis
        </h2>
        
        <p className="text-responsive-base text-white/80 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
          Descubra tokens únicos e exclusivos. Cada item é verificado e autenticado.
        </p>

        {/* Filter/Sort Bar - Melhorado para mobile */}
        <nav aria-label="Filtros de produtos" className="flex flex-wrap justify-center gap-3 md:gap-4 space-items">
          <button className="btn-secondary btn-sm focus-ring" aria-current="page">
            <span className="flex items-center">
              <svg className="w-3 h-3 md:w-4 md:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Todos
            </span>
          </button>
          <button className="btn-secondary btn-sm focus-ring text-white/80 hover:text-white">
            Trending
          </button>
          <button className="btn-secondary btn-sm focus-ring text-white/80 hover:text-white">
            Novos
          </button>
          <button className="btn-secondary btn-sm focus-ring text-white/80 hover:text-white">
            Preço ↑
          </button>
        </nav>
      </div>

      {/* Products Grid - Grid otimizado com melhor responsividade */}
      <div className="card-grid space-content" role="grid" aria-label="Grade de produtos">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onPurchase={purchaseProduct}
          />
        ))}
      </div>

      {/* Load More Section - Melhorado */}
      <div className="text-center space-items">
        <button className="btn-primary btn-lg hover-lift focus-ring">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Carregar Mais Produtos
          </span>
        </button>
        
        <p className="text-white/60 mt-4 text-responsive-sm">
          Mostrando {products.length} produtos disponíveis
        </p>
      </div>
    </section>
  );
} 