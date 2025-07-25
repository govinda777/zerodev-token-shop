import { useProducts } from './ProductProvider';
import { ProductCard } from './ProductCard';
import { useTokens } from '@/hooks/useTokens';
import { useInvestment } from '@/components/investment/InvestmentProvider';
import { Product } from '@/types/product';
import { useState } from 'react';
import { IntegratedWallet } from './IntegratedWallet';
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notificationService';

export const ProductGrid = () => {
  const { products, buyProduct, buyProductInstallment } = useProducts();
  const { balance } = useTokens();
  const { stakePositions, createInstallmentPurchase, isLoading } = useInvestment();
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  // Check if user has sufficient stake for installment purchases
  const hasStakeForInstallments = stakePositions.some(p => p.status === 'active' && p.amount >= 50);

  const handleBuy = async (product: Product) => {
    // console.log('🛒 Tentando comprar produto:', product.name, 'Preço:', product.price, 'Saldo:', balance); // Dev log
    
    if (balance < product.price) {
      notifyWarning(`Saldo insuficiente! Você tem ${balance} tokens, mas precisa de ${product.price} tokens.`);
      return;
    }

    setPurchaseLoading(product.id);
    
    try {
      const success = await buyProduct(product.id); // Assuming buyProduct could become async
      
      if (success) {
        notifySuccess(`Compra realizada com sucesso! Você comprou ${product.name} por ${product.price} token${product.price !== 1 ? 's' : ''}.`);
        // console.log(`✅ Compra bem-sucedida: ${product.name}`); // Dev log
      } else {
        notifyError('Erro ao processar a compra. Tente novamente.');
        // console.error('❌ Falha na compra:', product.name); // Dev log
      }
    } catch (error) {
      // console.error('❌ Erro durante a compra:', error); // Dev log
      notifyError('Erro inesperado durante a compra. Tente novamente.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleBuyInstallment = async (product: Product, installments: number) => {
    if (!hasStakeForInstallments) {
      notifyWarning('Você precisa ter pelo menos 50 tokens em stake para fazer compras parceladas.');
      return;
    }

    setPurchaseLoading(product.id); // Consider separate loading state for installment button if needed
    try {
      const success = await createInstallmentPurchase(product.id, product.price, installments);
      if (success) {
        // Also add to product purchases for tracking
        buyProductInstallment(product.id, installments); // This should ideally also be async and return status
        notifySuccess(`Compra parcelada de ${product.name} iniciada com sucesso.`);
        // console.log(`Successfully created installment purchase for ${product.name}`); // Dev log
      } else {
        notifyError('Não foi possível criar a compra parcelada. Verifique se você tem stake suficiente ou tente novamente.');
      }
    } catch (error) {
      notifyError('Erro inesperado ao criar compra parcelada.');
    } finally {
      setPurchaseLoading(null);
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
            isLoading={purchaseLoading === product.id}
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

      {/* Debug Panel - only in development */}
      <IntegratedWallet />
    </div>
  );
};