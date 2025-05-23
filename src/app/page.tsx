"use client";

import { Header } from "@/components/common/Header";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { useAuth } from '@/components/auth/useAuth';


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontSize: '30px', margin: '16px 0' }}>Teste ProductGrid</h1>
          <ProductGrid />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} ZeroDev Token Shop. Built with ZeroDev, Next.js and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
