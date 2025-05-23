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
      <div className="glass p-10 rounded-xl text-center border border-purple-500/20 mx-auto max-w-md neon-box">
        <h3 className="text-xl font-medium text-white mb-4 neon-text">Conecte sua carteira</h3>
        <p className="text-white/70 mb-6">Conecte-se para visualizar os produtos disponíveis</p>
        <div className="w-16 h-16 border-2 border-purple-500/50 rounded-full mx-auto flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-8 h-8 text-purple-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
          </svg>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-8"></div>
        <h2 className="text-2xl font-bold font-heading text-white">Carregando produtos...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-8 rounded-xl border border-red-500/30 max-w-md mx-auto">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-8 h-8 text-red-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-3 text-center">Erro ao carregar produtos</h3>
        <p className="text-white/80 text-center">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-10 font-heading text-center text-white neon-text">Produtos Disponíveis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onPurchase={purchaseProduct}
          />
        ))}
      </div>
    </div>
  );
} 