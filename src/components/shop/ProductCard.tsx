import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  disabled?: boolean;
}

export const ProductCard = ({ product, onBuy, disabled }: ProductCardProps) => {
  return (
    <div className="card padding-card hover-lift">
      <div className="aspect-card relative mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <h3 className="text-responsive-lg font-bold text-white mb-2">{product.name}</h3>
      <p className="text-white/80 text-responsive-sm mb-4">{product.description}</p>
      <button
        onClick={() => onBuy(product)}
        disabled={disabled}
        className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
      >
        Buy for {product.price} Token
      </button>
    </div>
  );
};