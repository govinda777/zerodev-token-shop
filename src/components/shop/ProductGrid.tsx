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
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-white/60 text-body-lg">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="space-content">
      {/* Header Section */}
      <div className="text-center space-elements">
        <h2 className="text-h1 font-bold text-white mb-4 neon-subtle">
          Marketplace de Tokens
        </h2>
        <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
          Explore nossa seleção de produtos e serviços exclusivos. 
          {hasStakeForInstallments ? (
            <span className="text-success font-medium"> ✅ Você tem acesso a compras parceladas!</span>
          ) : (
            <span className="text-warning font-medium"> 💡 Faça stake de 50+ tokens para habilitar parcelamento.</span>
          )}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid-responsive">
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
      <section className="grid-features space-elements" aria-labelledby="info-title">
        <h3 id="info-title" className="sr-only">Informações adicionais sobre compras</h3>
        
        <div className="card card-hover text-center">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl" role="img" aria-label="Escudo">🛡️</span>
          </div>
          <h4 className="text-h3 text-white font-bold mb-2">Compra Segura</h4>
          <p className="text-white/60 text-body-sm">Todas as transações são protegidas por smart contracts</p>
        </div>

        <div className="card card-hover text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl" role="img" aria-label="Cartão">💳</span>
          </div>
          <h4 className="text-h3 text-white font-bold mb-2">Parcelamento</h4>
          <p className="text-white/60 text-body-sm">Compre parcelado com staking ativo</p>
        </div>

        <div className="card card-hover text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl" role="img" aria-label="Raio">⚡</span>
          </div>
          <h4 className="text-h3 text-white font-bold mb-2">Instantâneo</h4>
          <p className="text-white/60 text-body-sm">Acesso imediato após a compra</p>
        </div>
      </section>
    </div>
  );
};