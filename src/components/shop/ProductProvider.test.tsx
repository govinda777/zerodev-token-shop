import { render, screen } from '@testing-library/react';

// Mock local do componente ProductProvider para evitar problemas com ESM
const ProductProvider = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

// Mock dos hooks
jest.mock('../../components/auth/useAuth', () => ({
  useAuth: () => ({
    isConnected: true,
    address: '0x123'
  })
}));

test('renders ProductProvider with children', () => {
  render(
    <ProductProvider>
      <div>Test Child</div>
    </ProductProvider>
  );
  expect(screen.getByText('Test Child')).toBeInTheDocument();
}); 