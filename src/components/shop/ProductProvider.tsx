"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/useAuth";
import { useTokens } from "@/hooks/useTokens";
import type { Product } from "@/types/product";

// Mock data for development
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Produto Digital 1",
    description: "Descrição do produto digital 1",
    price: 0.01,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
  },
  {
    id: "2", 
    name: "Produto Digital 2",
    description: "Descrição do produto digital 2",
    price: 0.02,
    image: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Produto Digital 3", 
    description: "Descrição do produto digital 3",
    price: 0.03,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
  },
];

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  purchaseProduct: (product: Product) => Promise<void>;
  purchaseHistory: Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Export the context so it can be used by the hook
export { ProductContext };

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<Product[]>([]);
  const { isConnected, address } = useAuth();
  const { balance, spendTokens } = useTokens();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      // In a real app, we would fetch purchase history from an API
      setPurchaseHistory([]);
    } else {
      setPurchaseHistory([]);
    }
  }, [isConnected, address]);

  const purchaseProduct = async (product: Product) => {
    if (!isConnected || !address) {
      setError(new Error("Conecte sua carteira primeiro"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const priceInTokens = Math.floor(product.price * 1000); // Convert ETH to tokens (1 ETH = 1000 tokens)
      
      if (balance < priceInTokens) {
        throw new Error("Saldo insuficiente");
      }

      const success = await spendTokens(priceInTokens);
      
      if (success) {
        setPurchaseHistory(prev => [product, ...prev]);
        console.log(`Purchased ${product.name} for ${priceInTokens} tokens`);
      } else {
        throw new Error("Falha na transação");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        purchaseProduct,
        purchaseHistory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
} 