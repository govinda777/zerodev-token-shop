import { useProducts } from './ProductProvider';
import { ProductCard } from './ProductCard';
import { useTokens } from '@/hooks/useTokens';
import { Product } from '@/types/product';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Access',
    description: 'Get exclusive access to premium content',
    price: 1,
    image: '/products/premium.jpg',
    type: 'product',
  },
  {
    id: '2',
    name: 'Pro Support',
    description: '24/7 priority support from our team',
    price: 1,
    image: '/products/support.jpg',
    type: 'product',
  },
  {
    id: '3',
    name: 'Custom Badge',
    description: 'Unique profile badge for your account',
    price: 1,
    image: '/products/badge.jpg',
    type: 'product',
  },
  {
    id: '4',
    name: 'Analytics Dashboard',
    description: 'Advanced analytics and reporting tools',
    price: 1,
    image: '/products/analytics.jpg',
    type: 'product',
  },
  {
    id: '5',
    name: 'API Access',
    description: 'Full access to our API endpoints',
    price: 1,
    image: '/products/api.jpg',
    type: 'product',
  }
];

export const ProductGrid = () => {
  const { buyProduct } = useProducts();
  const { balance } = useTokens();

  const handleBuy = (product: Product) => {
    if (balance >= product.price) {
      buyProduct(product.id);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {PRODUCTS.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onBuy={handleBuy}
          disabled={balance < product.price}
        />
      ))}
    </div>
  );
};