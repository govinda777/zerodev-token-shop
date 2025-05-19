import { useState, useCallback, useMemo } from 'react';
import { useTokens } from './useTokens';
import type { Product } from '@/types/product';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Produto Digital 1',
    description: 'Descrição do produto digital 1',
    price: 1,
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: '2',
    name: 'Produto Digital 2',
    description: 'Descrição do produto digital 2',
    price: 1,
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=500',
  },
  // Adicione mais produtos conforme necessário
];

export const useProducts = () => {
  const { balance, spendTokens } = useTokens();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<Product[]>([]);

  const products = useMemo(() => PRODUCTS, []);

  const getProducts = useCallback(() => {
    return PRODUCTS;
  }, []);

  const purchaseProduct = useCallback(async (product: Product): Promise<boolean> => {
    if (balance < product.price) {
      setError(new Error('Saldo insuficiente'));
      return false;
    }

    try {
      setIsLoading(true);
      const success = await spendTokens(product.price);
      if (success) {
        setPurchaseHistory(prev => [...prev, product]);
      }
      return !!success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao comprar produto'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [balance, spendTokens]);

  const getPurchaseHistory = useCallback(() => {
    return purchaseHistory;
  }, [purchaseHistory]);

  return {
    products,
    purchaseHistory: getPurchaseHistory(),
    isLoading,
    error,
    purchaseProduct,
  };
}; 