"use client";

import React, { createContext, useContext, useState } from 'react';
import { Product, Purchase } from '@/types/product';
import { useTokens } from '@/hooks/useTokens';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import JourneyLogger from '@/utils/journeyLogger';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Service',
    description: 'Access to premium features and priority support',
    price: 5,
    image: '/products/premium.jpg',
    type: 'service',
    installments: true,
    requiredStake: 20
  },
  {
    id: '2',
    name: 'API Access',
    description: 'Full API access for developers with unlimited requests',
    price: 3,
    image: '/products/api.jpg',
    type: 'service'
  },
  {
    id: '3',
    name: 'NFT Collection Pack',
    description: 'Exclusive NFT collection with rare items',
    price: 12,
    image: '/products/nft-pack.jpg',
    type: 'product',
    installments: true,
    requiredStake: 50
  },
  {
    id: '4',
    name: 'Governance Rights',
    description: 'Extended voting rights in DAO decisions',
    price: 8,
    image: '/products/governance.jpg',
    type: 'service',
    installments: true
  },
  {
    id: '5',
    name: 'Trading Bot Access',
    description: 'Access to automated trading bot with AI features',
    price: 15,
    image: '/products/trading-bot.jpg',
    type: 'service',
    installments: true,
    requiredStake: 100
  },
  {
    id: '6',
    name: 'Private Pool Access',
    description: 'Access to exclusive high-yield liquidity pools',
    price: 6,
    image: '/products/private-pool.jpg',
    type: 'service'
  },
  {
    id: '7',
    name: 'Educational Course',
    description: 'Complete DeFi and blockchain development course',
    price: 4,
    image: '/products/course.jpg',
    type: 'service',
    installments: true
  },
  {
    id: '8',
    name: 'VIP Membership',
    description: 'VIP membership with exclusive benefits and rewards',
    price: 20,
    image: '/products/vip.jpg',
    type: 'service',
    installments: true,
    requiredStake: 200
  }
];

interface ProductContextType {
  products: Product[];
  purchases: Purchase[];
  buyProduct: (productId: string, installments?: number) => boolean;
  buyProductInstallment: (productId: string, installments: number) => boolean;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { balance, removeTokens } = useTokens();
  const { address } = usePrivyAuth();

  const buyProduct = (productId: string, installments = 1) => {
    console.log('🔍 ProductProvider.buyProduct chamado:', { productId, installments, balance, address });
    
    const product = PRODUCTS.find(p => p.id === productId);
    console.log('🔍 Produto encontrado:', product);
    
    if (!product) {
      console.error('❌ Produto não encontrado:', productId);
      return false;
    }
    
    if (balance < product.price) {
      console.error('❌ Saldo insuficiente:', { balance, price: product.price });
      return false;
    }
    
    if (!address) {
      console.error('❌ Endereço não conectado');
      return false;
    }

    console.log('✅ Removendo tokens:', product.price);
    removeTokens(product.price);
    
    const newPurchase = {
      productId,
      timestamp: Date.now(),
      price: product.price,
      installments: installments > 1 ? installments : undefined
    };
    
    console.log('✅ Adicionando compra:', newPurchase);
    setPurchases(prev => [...prev, newPurchase]);
    
    // Log purchase
    JourneyLogger.logPurchase(address, productId, product.price, installments > 1 ? installments : undefined);
    
    console.log('✅ Compra finalizada com sucesso');
    return true;
  };

  const buyProductInstallment = (productId: string, installments: number) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !product.installments || !address) return false;

    // For installment purchases, we don't charge immediately
    // This would be handled by the investment provider's installment system
    const newPurchase = {
      productId,
      timestamp: Date.now(),
      price: product.price,
      installments
    };
    
    setPurchases(prev => [...prev, newPurchase]);
    
    // Log installment purchase initiation
    JourneyLogger.logPurchase(address, productId, product.price, installments);
    
    return true;
  };

  return (
    <ProductContext.Provider value={{ 
      products: PRODUCTS, 
      purchases, 
      buyProduct,
      buyProductInstallment 
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}