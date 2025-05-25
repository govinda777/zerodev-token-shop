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
    <article className="card card-hover group">
      {/* Product Image */}
      <div className="aspect-card relative mb-4 overflow-hidden rounded-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.installments && (
          <div className="absolute top-3 right-3 bg-info/90 backdrop-blur-sm text-white text-caption px-2 py-1 rounded-md font-medium">
            Parcelável
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="space-items">
        <h3 className="text-h3 font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
          {product.name}
        </h3>
        <p className="text-white/80 text-body mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price */}
        <div className="mb-4">
          <span className="text-h2 font-bold text-purple-400">
            {product.price}
          </span>
          <span className="text-body text-white/60 ml-1">
            Token{product.price !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-items mt-auto">
        {/* Regular Purchase Button */}
        <button
          onClick={() => onBuy(product)}
          disabled={disabled}
          className="btn btn-primary w-full focus-ring"
          aria-label={`Comprar ${product.name} por ${product.price} token${product.price !== 1 ? 's' : ''}`}
        >
          {disabled ? (
            <>
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Saldo Insuficiente
            </>
          ) : (
            <>
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Comprar Agora
            </>
          )}
        </button>

        {/* Installment Purchase Option */}
        {product.installments && hasStakeForInstallments && (
          <>
            {!showInstallmentOptions ? (
              <button
                onClick={() => setShowInstallmentOptions(true)}
                className="btn btn-secondary w-full focus-ring"
                aria-label={`Opções de parcelamento para ${product.name}`}
              >
                <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Comprar Parcelado
              </button>
            ) : (
              <div className="space-items">
                {/* Installment Options */}
                <div className="bg-black/20 rounded-lg p-3">
                  <label htmlFor={`installments-${product.id}`} className="block text-body-sm text-white/80 mb-2">
                    Escolha o parcelamento:
                  </label>
                  <select
                    id={`installments-${product.id}`}
                    value={selectedInstallments}
                    onChange={(e) => setSelectedInstallments(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white text-body focus-ring"
                  >
                    {installmentOptions.map((option) => (
                      <option key={option} value={option} className="bg-black">
                        {option}x de {(product.price / option).toFixed(1)} tokens
                      </option>
                    ))}
                  </select>
                </div>

                {/* Installment Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowInstallmentOptions(false)}
                    className="btn btn-secondary btn-sm focus-ring"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleInstallmentPurchase}
                    className="btn btn-primary btn-sm focus-ring"
                    aria-label={`Confirmar parcelamento em ${selectedInstallments}x`}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Required Stake Info */}
      {product.requiredStake && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-info text-caption text-center flex items-center justify-center gap-1">
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Requer {product.requiredStake} tokens em stake
          </p>
        </div>
      )}
    </article>
  );
};