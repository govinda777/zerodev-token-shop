"use client";

import Image from "next/image";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => void;
}

export function ProductCard({ product, onPurchase }: ProductCardProps) {
  return (
    <div className="glass-card group rounded-xl overflow-hidden">
      {/* Image container with position relative */}
      <div className="relative h-56 w-full overflow-hidden" style={{ position: 'relative' }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-all duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-purple-900/40 to-transparent opacity-60 group-hover:opacity-70 transition-all duration-500"></div>
        
        {/* Badge no canto superior direito */}
        <div className="absolute top-3 right-3 bg-purple-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
          {product.price} ETH
        </div>
      </div>
      
      <div className="p-6 relative">
        {/* Linha decorativa */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-purple-500/50 rounded-full"></div>
        
        <h3 className="text-xl font-bold font-heading text-white mt-3 group-hover:text-purple-300 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-white/70 mt-3 text-sm leading-relaxed min-h-[60px]">
          {product.description}
        </p>
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onPurchase(product)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] active:scale-95 uppercase tracking-wider"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
