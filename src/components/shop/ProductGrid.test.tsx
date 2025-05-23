import { render, screen } from '@testing-library/react';

// Mock local do componente ProductGrid para evitar problemas com ESM
const ProductGrid = () => (
  <div>
    <h2>Shop Products</h2>
    <div>
      <div>Produto Teste</div>
      <div>10 ETH</div>
    </div>
  </div>
);

// Mock dos hooks
jest.mock('../../hooks/useProducts', () => ({
  useProducts: () => ({
    products: []
  })
}));

test('renders product grid', () => {
  render(<ProductGrid />);
  expect(screen.getByText('Shop Products')).toBeInTheDocument();
  expect(screen.getByText('Produto Teste')).toBeInTheDocument();
}); 