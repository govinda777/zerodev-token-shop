"use client";

import { Header } from "@/components/common/Header";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { useAuth } from '@/components/auth/useAuth';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow w-full">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-5 font-heading text-white neon-text">
              ZeroDev Token Shop
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Explore and purchase unique tokens using your wallet. Connect your wallet to get started.
            </p>
          </div>
          
          <ProductGrid />
        </div>
      </main>
      
      <footer className="glass py-8 mt-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ZeroDev Token Shop
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-white/60 hover:text-purple-300 transition-colors">
                Terms
              </a>
              <a href="#" className="text-white/60 hover:text-purple-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-white/60 hover:text-purple-300 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
