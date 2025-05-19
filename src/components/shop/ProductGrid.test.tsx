import { render, screen } from '@testing-library/react';
import { ProductGrid } from './ProductGrid';
import * as useProductsHook from '@/hooks/useProducts';
import * as useAuthHook from '@/components/auth/useAuth';

jest.mock('@/hooks/useProducts');
jest.mock('@/components/auth/useAuth');

const mockProducts = [
  { id: '1', name: 'Produto 1', description: 'Desc 1', price: 1, image: 'img1' },
  { id: '2', name: 'Produto 2', description: 'Desc 2', price: 2, image: 'img2' },
];

beforeEach(() => {
  (useProductsHook.useProducts as jest.Mock).mockReturnValue({
    products: mockProducts,
    isLoading: false,
    error: null,
    purchaseProduct: jest.fn(),
  });
  (useAuthHook.useAuth as jest.Mock).mockReturnValue({ isConnected: true });
});

test('renders ProductGrid with products', () => {
  render(<ProductGrid />);
  expect(screen.getByText('Shop Products')).toBeInTheDocument();
  expect(screen.getByText('Produto 1')).toBeInTheDocument();
  expect(screen.getByText('Produto 2')).toBeInTheDocument();
}); 