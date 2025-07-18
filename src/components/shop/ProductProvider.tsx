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
    image: '/products/premium.svg',
    type: 'service',
    installments: true,
    requiredStake: 20
  },
  {
    id: '2',
    name: 'API Access',
    description: 'Full API access for developers with unlimited requests',
    price: 3,
    image: '/products/api.svg',
    type: 'service'
  },
  {
    id: '3',
    name: 'NFT Collection Pack',
    description: 'Exclusive NFT collection with rare items',
    price: 12,
    image: '/products/nft-pack.svg',
    type: 'product',
    installments: true,
    requiredStake: 50
  },
  {
    id: '4',
    name: 'Governance Rights',
    description: 'Extended voting rights in DAO decisions',
    price: 8,
    image: '/products/governance.svg',
    type: 'service',
    installments: true
  },
  {
    id: '5',
    name: 'Trading Bot Access',
    description: 'Access to automated trading bot with AI features',
    price: 15,
    image: '/products/trading-bot.svg',
    type: 'service',
    installments: true,
    requiredStake: 100
  },
  {
    id: '6',
    name: 'Private Pool Access',
    description: 'Access to exclusive high-yield liquidity pools',
    price: 6,
    image: '/products/private-pool.svg',
    type: 'service'
  },
  {
    id: '7',
    name: 'Educational Course',
    description: 'Complete DeFi and blockchain development course',
    price: 4,
    image: '/products/course.svg',
    type: 'service',
    installments: true
  },
  {
    id: '8',
    name: 'VIP Membership',
    description: 'VIP membership with exclusive benefits and rewards',
    price: 20,
    image: '/products/vip.svg',
    type: 'service',
    installments: true,
    requiredStake: 200
  }
];

interface ProductContextType {
  products: Product[];
  purchases: Purchase[];
  buyProduct: (productId: string, installments?: number) => Promise<boolean>;
  buyProductInstallment: (productId: string, installments: number) => Promise<boolean>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { balance, removeTokens } = useTokens(); // removeTokens is now async
  const { address } = usePrivyAuth();

  const buyProduct = async (productId: string, installments = 1): Promise<boolean> => {
    // console.log('🔍 ProductProvider.buyProduct chamado:', { productId, installments, balance, address }); // Dev log
    
    const product = PRODUCTS.find(p => p.id === productId);
    // console.log('🔍 Produto encontrado:', product); // Dev log
    
    if (!product) {
      // console.error('❌ Produto não encontrado:', productId); // Dev log
      return false;
    }
    
    if (balance < product.price) {
      // console.error('❌ Saldo insuficiente:', { balance, price: product.price }); // Dev log
      return false;
    }
    
    if (!address) {
      // console.error('❌ Endereço não conectado'); // Dev log
      return false;
    }

    // console.log('✅ Removendo tokens:', product.price); // Dev log
    const removeSuccess = await removeTokens(product.price); // removeTokens is async and returns boolean
    if (!removeSuccess) {
      // console.error('❌ Falha ao remover tokens para compra direta:', product.name); // Dev log
      return false;
    }
    
    const newPurchase: Purchase = { // Added type for newPurchase
      productId,
      timestamp: Date.now(),
      price: product.price,
      installments: installments > 1 ? installments : undefined
    };
    
    // console.log('✅ Adicionando compra:', newPurchase); // Dev log
    setPurchases(prev => [...prev, newPurchase]);
    
    JourneyLogger.logPurchase(address, productId, product.price, installments > 1 ? installments : undefined);
    
    // console.log('✅ Compra finalizada com sucesso'); // Dev log
    return true;
  };

  const buyProductInstallment = async (productId: string, installments: number): Promise<boolean> => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !product.installments || !address) {
      return false;
    }

    // For installment purchases, we don't charge immediately via ProductProvider's removeTokens.
    // This is handled by the InvestmentProvider's installment system, which will call removeTokens for each installment.
    // Here, we just record the intent/initiation of an installment purchase.
    const newPurchase: Purchase = { // Added type for newPurchase
      productId,
      timestamp: Date.now(),
      price: product.price,
      installments
    };
    
    setPurchases(prev => [...prev, newPurchase]);
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