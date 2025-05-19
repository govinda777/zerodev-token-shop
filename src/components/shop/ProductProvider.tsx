"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/useAuth";
import { useTokens } from "@/components/auth/TokenProvider";
import type { Product } from "@/types/product";
import { addTransaction } from "@/utils/storage";
import { Transaction } from "@/types/transaction";

// Mock products data - in a real app this would come from an API
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Digital Art #1",
    description: "A unique piece of digital art",
    price: 10,
    image: "/images/art1.jpg",
  },
  {
    id: "2",
    name: "Digital Art #2",
    description: "Another unique piece of digital art",
    price: 15,
    image: "/images/art2.jpg",
  },
  {
    id: "3",
    name: "Digital Art #3",
    description: "A third unique piece of digital art",
    price: 20,
    image: "/images/art3.jpg",
  },
];

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  purchaseHistory: Product[];
  purchaseProduct: (product: Product) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

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

  const purchaseProduct = async (product: Product): Promise<boolean> => {
    if (!isConnected || !address) {
      setError(new Error("Not connected"));
      return false;
    }

    if (balance < product.price) {
      setError(new Error("Insufficient balance"));
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Spend tokens
      spendTokens(product.price);

      // Add to purchase history
      setPurchaseHistory(prev => [...prev, product]);

      // Record transaction
      addTransaction(address, {
        hash: '', // ou gere um hash real se disponível
        from: address,
        to: '', // preencha se houver destinatário
        value: product.price.toString(),
        timestamp: Date.now(),
        status: 'success',
        type: 'purchase',
        metadata: {
          productId: product.id,
          productName: product.name,
          amount: product.price,
        },
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to purchase product"));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        purchaseHistory,
        purchaseProduct,
      }}
    >
      {!mounted ? <div>Carregando produtos...</div> : children}
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