import { Product } from '@/types/product';
import { useState } from 'react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  onBuyInstallment?: (product: Product, installments: number) => void;
  disabled?: boolean;
  hasStakeForInstallments?: boolean;
}

export const ProductCard = ({ 
  product, 
  onBuy, 
  onBuyInstallment,
  disabled,
  hasStakeForInstallments = false
}: ProductCardProps) => {
  const [showInstallmentOptions, setShowInstallmentOptions] = useState(false);
  const [selectedInstallments, setSelectedInstallments] = useState(2);

  const installmentOptions = [2, 3, 4, 6];
  const installmentAmount = product.price / selectedInstallments;

  const handleInstallmentPurchase = () => {
    if (onBuyInstallment) {
      onBuyInstallment(product, selectedInstallments);
      setShowInstallmentOptions(false);
    }
  };

  return (
    <div className="card padding-card hover-lift">
      <div className="aspect-card relative mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
        {product.installments && (
          <div className="absolute top-2 right-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded">
            Parcelável
          </div>
        )}
      </div>
      
      <h3 className="text-responsive-lg font-bold text-white mb-2">{product.name}</h3>
      <p className="text-white/80 text-responsive-sm mb-4">{product.description}</p>
      
      <div className="space-y-2">
        {/* Regular Purchase Button */}
        <button
          onClick={() => onBuy(product)}
          disabled={disabled}
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed focus-ring transition-colors"
        >
          Comprar por {product.price} Token{product.price !== 1 ? 's' : ''}
        </button>

        {/* Installment Purchase Option */}
        {product.installments && hasStakeForInstallments && (
          <>
            {!showInstallmentOptions ? (
              <button
                onClick={() => setShowInstallmentOptions(true)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                💳 Comprar Parcelado
              </button>
            ) : (
              <div className="bg-white/5 p-3 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Parcelas:</span>
                  <select
                    value={selectedInstallments}
                    onChange={(e) => setSelectedInstallments(Number(e.target.value))}
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                  >
                    {installmentOptions.map(option => (
                      <option key={option} value={option} className="text-black">
                        {option}x de {(product.price / option).toFixed(1)} tokens
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowInstallmentOptions(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleInstallmentPurchase}
                    disabled={disabled}
                    className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    Parcelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Installment requirement message */}
        {product.installments && !hasStakeForInstallments && (
          <p className="text-yellow-400 text-xs text-center">
            💡 Faça stake de 50+ tokens para habilitar parcelamento
          </p>
        )}
      </div>

      {product.requiredStake && (
        <p className="text-blue-400 text-xs mt-2 text-center">
          ⚡ Requer {product.requiredStake} tokens em stake
        </p>
      )}
    </div>
  );
};