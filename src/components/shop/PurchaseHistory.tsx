"use client";

import { useProducts } from '@/hooks/useProducts';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import type { Purchase } from '@/types/product';
import Image from 'next/image';

// Verificar se estamos em ambiente de teste
const isTesting = typeof jest !== 'undefined';

// Exportar um único componente PurchaseHistory
export function PurchaseHistory() {
  const { purchases, products } = useProducts(); // Also get products list
  const { isConnected } = usePrivyAuth();
  
  // Se estiver em ambiente de teste, retornar mock simplificado
  // if (isTesting) { // Removed isTesting block
  //   return (
  //     <div>
  //       <h2>Histórico de Compras</h2>
  //       <div>
  //         <div>Produto Teste</div>
  //         <div>10 ETH</div>
  //       </div>
  //     </div>
  //   );
  // }
  
  if (!isConnected) {
    return null;
  }

  if (purchases.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
        <p className="text-gray-500">No purchases yet. Buy something from the shop!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map((purchase: Purchase, index: number) => {
              const product = products.find(p => p.id === purchase.productId);
              const productName = product ? product.name : purchase.productId;
              const productImage = product ? product.image : '/placeholder.png';

              return (
                <tr key={purchase.timestamp + purchase.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image className="h-10 w-10 rounded-md object-cover" src={productImage} alt={productName} width={40} height={40} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {productName}
                        </div>
                        <div className="text-xs text-gray-500">ID: {purchase.productId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(purchase.timestamp).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.price} Token{purchase.price !== 1 ? 's' : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}