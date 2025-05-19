import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

const product = {
  id: '1',
  name: 'Produto Teste',
  description: 'Descrição teste',
  price: 10,
  image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=500',
};

test('renders ProductCard with product info', () => {
  render(<ProductCard product={product} onPurchase={jest.fn()} />);
  expect(screen.getByText('Produto Teste')).toBeInTheDocument();
  expect(screen.getByText('Descrição teste')).toBeInTheDocument();
  expect(screen.getByText(/10 Token/)).toBeInTheDocument();
}); 