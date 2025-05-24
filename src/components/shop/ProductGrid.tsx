import { useProducts } from './ProductProvider';
import { ProductCard } from './ProductCard';
import { useTokens } from '@/hooks/useTokens';
import { useInvestment } from '@/components/investment/InvestmentProvider';
import { Product } from '@/types/product';

export const ProductGrid = () => {
  const { products, buyProduct, buyProductInstallment } = useProducts();
  const { balance } = useTokens();
  const { stakePositions, createInstallmentPurchase, isLoading } = useInvestment();

  // Check if user has sufficient stake for installment purchases
  const hasStakeForInstallments = stakePositions.some(p => p.status === 'active' && p.amount >= 50);

  const handleBuy = (product: Product) => {
    if (balance >= product.price) {
      const success = buyProduct(product.id);
      if (success) {
        // Show success message or feedback
        console.log(`Successfully purchased ${product.name}`);
      }
    }
  };

  const handleBuyInstallment = async (product: Product, installments: number) => {
    if (!hasStakeForInstallments) {
      alert('Você precisa ter pelo menos 50 tokens em stake para fazer compras parceladas.');
      return;
    }

    const success = await createInstallmentPurchase(product.id, product.price, installments);
    if (success) {
      // Also add to product purchases for tracking
      buyProductInstallment(product.id, installments);
      console.log(`Successfully created installment purchase for ${product.name}`);
    } else {
      alert('Não foi possível criar a compra parcelada. Verifique se você tem stake suficiente.');
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-responsive-2xl font-bold text-white mb-4">
          Marketplace de Tokens
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">
          Explore nossa seleção de produtos e serviços exclusivos. 
          {hasStakeForInstallments ? (
            <span className="text-green-400"> ✅ Você tem acesso a compras parceladas!</span>
          ) : (
            <span className="text-yellow-400"> 💡 Faça stake de 50+ tokens para habilitar parcelamento.</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuy={handleBuy}
            onBuyInstallment={handleBuyInstallment}
            disabled={balance < product.price || isLoading}
            hasStakeForInstallments={hasStakeForInstallments}
          />
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-white font-bold mb-2">Compra Segura</h3>
          <p className="text-white/60 text-sm">Todas as transações são protegidas por smart contracts</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">💳</span>
          </div>
          <h3 className="text-white font-bold mb-2">Parcelamento</h3>
          <p className="text-white/60 text-sm">Compre parcelado com staking ativo</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-white font-bold mb-2">Instantâneo</h3>
          <p className="text-white/60 text-sm">Acesso imediato após a compra</p>
        </div>
      </div>
    </div>
  );
};