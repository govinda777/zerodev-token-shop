"use client";

import React, { createContext, useContext, useState } from 'react';
import { Product, Purchase } from '@/types/product';
import { useTokens } from '@/hooks/useTokens';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Service',
    description: 'Access to premium features',
    price: 5,
    image: '/products/premium.jpg',
    type: 'service',
    installments: true,
    requiredStake: 20
  },
  {
    id: '2',
    name: 'API Access',
    description: 'Full API access for developers',
    price: 3,
    image: '/products/api.jpg',
    type: 'service'
  },
  // Add more products as needed
];

interface ProductContextType {
  products: Product[];
  purchases: Purchase[];
  buyProduct: (productId: string, installments?: number) => boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { balance, removeTokens } = useTokens();

  const buyProduct = (productId: string, installments = 1) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || balance < product.price) return false;

    removeTokens(product.price);
    setPurchases(prev => [...prev, {
      productId,
      timestamp: Date.now(),
      price: product.price,
      installments
    }]);
    return true;
  };

  return (
    <ProductContext.Provider value={{ products: PRODUCTS, purchases, buyProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}