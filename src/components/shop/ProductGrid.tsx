import { useProducts } from './ProductProvider';
import { ProductCard } from './ProductCard';
import { useAuth } from '@/components/auth/useAuth';
import { Product } from '@/types/product';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Access',
    description: 'Get exclusive access to premium content',
    price: 1,
    image: '/products/premium.jpg'
  },
  {
    id: '2',
    name: 'Pro Support',
    description: '24/7 priority support from our team',
    price: 1,
    image: '/products/support.jpg'
  },
  {
    id: '3',
    name: 'Custom Badge',
    description: 'Unique profile badge for your account',
    price: 1,
    image: '/products/badge.jpg'
  },
  {
    id: '4',
    name: 'Analytics Dashboard',
    description: 'Advanced analytics and reporting tools',
    price: 1,
    image: '/products/analytics.jpg'
  },
  {
    id: '5',
    name: 'API Access',
    description: 'Full access to our API endpoints',
    price: 1,
    image: '/products/api.jpg'
  }
];

export const ProductGrid = () => {
  const { addPurchase } = useProducts();
  const { tokens = 0 } = useAuth();

  const handleBuy = (product: Product) => {
    if (tokens >= product.price) {
      addPurchase({
        productId: product.id,
        price: product.price,
        timestamp: Date.now()
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {PRODUCTS.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onBuy={handleBuy}
          disabled={tokens < product.price}
        />
      ))}
    </div>
  );
};