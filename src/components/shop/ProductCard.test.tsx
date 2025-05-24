import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

// Mock do next/image para evitar o erro de fetchPriority
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, sizes, style, priority }: any) => {
    return <img src={src} alt={alt} style={style} data-testid="next-image" />;
  },
}));

const product = {
  id: '1',
  name: 'Produto Teste',
  description: 'Descrição teste',
  price: 10,
  type: 'product' as const,
  image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=500',
};

test('renders ProductCard with product info', () => {
  render(<ProductCard product={product} onBuy={jest.fn()} />);
  expect(screen.getByText('Produto Teste')).toBeInTheDocument();
  expect(screen.getByText('Descrição teste')).toBeInTheDocument();
  expect(screen.getByText(/Comprar por 10 Tokens?/)).toBeInTheDocument();
}); 