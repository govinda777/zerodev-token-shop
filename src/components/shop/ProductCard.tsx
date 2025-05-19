"use client";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useTokens } from "@/hooks/useTokens";

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => Promise<boolean>;
}

export function ProductCard({ product, onPurchase }: ProductCardProps) {
  console.log('[ProductCard] Renderizando com produto:', product);
  const [isLoading, setIsLoading] = useState(false);
  const { balance } = useTokens();
  const canPurchase = balance >= product.price;

  const handlePurchase = async () => {
    if (!canPurchase || isLoading) return;

    setIsLoading(true);
    try {
      await onPurchase(product);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{product.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            {product.price} Token{product.price !== 1 ? 's' : ''}
          </span>
          
          <button
            onClick={handlePurchase}
            disabled={!canPurchase || isLoading}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${canPurchase 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
              disabled:opacity-50
            `}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Comprando...
              </span>
            ) : canPurchase ? (
              'Comprar'
            ) : (
              'Saldo Insuficiente'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 