"use client";

import Image from "next/image";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => void;
}

export function ProductCard({ product, onPurchase }: ProductCardProps) {
  return (
    <div className="glass-card group rounded-xl overflow-hidden relative">
      {/* Trending Badge */}
      <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
        Trending
      </div>

      {/* Image container with position relative */}
      <div className="relative h-64 w-full overflow-hidden" style={{ position: 'relative' }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-all duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/30 to-transparent opacity-60 group-hover:opacity-70 transition-all duration-500"></div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-black/80 backdrop-blur-sm border border-purple-500/50 px-4 py-2 rounded-full">
            <div className="text-purple-300 text-xs font-medium">Preço</div>
            <div className="text-white font-bold text-lg">{product.price} ETH</div>
          </div>
        </div>

        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="text-center">
            <button
              onClick={() => onPurchase(product)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] mb-4"
            >
              Comprar Agora
            </button>
            <div className="flex justify-center space-x-4">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 relative">
        {/* Linha decorativa animada */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-24 transition-all duration-300"></div>
        
        <div className="pt-3">
          {/* Categoria e Rating */}
          <div className="flex items-center justify-between mb-3">
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
              Digital Asset
            </span>
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-white/60 text-xs">4.9</span>
            </div>
          </div>

          <h3 className="text-xl font-bold font-heading text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
            {product.name}
          </h3>
          
          <p className="text-white/70 text-sm leading-relaxed min-h-[60px] mb-4">
            {product.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-purple-400 font-bold text-lg">127</div>
              <div className="text-white/60 text-xs">Owners</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold text-lg">2.4K</div>
              <div className="text-white/60 text-xs">Views</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold text-lg">15</div>
              <div className="text-white/60 text-xs">Likes</div>
            </div>
          </div>
        
          <div className="flex space-x-3">
            <button
              onClick={() => onPurchase(product)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 uppercase tracking-wider"
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6 0L18 18m-3 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Comprar
              </span>
            </button>
            
            <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-purple-500/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none -z-10 blur-xl"></div>
    </div>
  );
}
