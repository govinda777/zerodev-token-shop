"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/components/auth/useAuth";
import type { Product } from "@/types/product";

export function ProductGrid() {
  const { products, isLoading, error, purchaseProduct } = useProducts();
  const { isConnected } = useAuth();

  if (!isConnected) {
    return <div>isConnected está falso</div>;
  }

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Shop Products</h2>
        <div className="text-gray-500">Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Shop Products</h2>
        <div className="text-red-500">Erro ao carregar produtos: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Shop Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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