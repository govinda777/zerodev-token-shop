"use client";

import { useTokens } from '@/hooks/useTokens';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useProducts } from './ProductProvider';

export const DebugPanel = () => {
  const { balance, addTokens } = useTokens();
  const { address, isConnected } = usePrivyAuth();
  const { products, purchases, buyProduct } = useProducts();

  const testPurchase = () => {
    console.log('🧪 Teste de compra iniciado');
    console.log('Estado atual:', { balance, address, isConnected, products: products.length });
    
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log('Tentando comprar:', firstProduct);
      const result = buyProduct(firstProduct.id);
      console.log('Resultado da compra:', result);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg border border-purple-500/30 max-w-sm">
      <h3 className="text-lg font-bold mb-2">🔧 Debug Panel</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Conectado:</strong> {isConnected ? '✅' : '❌'}
        </div>
        <div>
          <strong>Endereço:</strong> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A'}
        </div>
        <div>
          <strong>Saldo:</strong> {balance} tokens
        </div>
        <div>
          <strong>Produtos:</strong> {products.length}
        </div>
        <div>
          <strong>Compras:</strong> {purchases.length}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => addTokens(10)}
          className="btn btn-secondary btn-sm w-full"
        >
          + 10 Tokens
        </button>
        
        <button
          onClick={testPurchase}
          className="btn btn-primary btn-sm w-full"
        >
          🧪 Teste de Compra
        </button>
        
        <button
          onClick={() => {
            console.clear();
            console.log('🧹 Console limpo');
          }}
          className="btn btn-secondary btn-sm w-full"
        >
          🧹 Limpar Console
        </button>
      </div>
    </div>
  );
}; 