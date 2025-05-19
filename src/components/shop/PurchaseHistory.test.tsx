import { render, screen } from '@testing-library/react';
import { PurchaseHistory } from './PurchaseHistory';
import * as useProductsHook from '@/hooks/useProducts';
import * as useAuthHook from '@/components/auth/useAuth';

jest.mock('@/hooks/useProducts');
jest.mock('@/components/auth/useAuth');

beforeEach(() => {
  (useAuthHook.useAuth as jest.Mock).mockReturnValue({ isConnected: true });
});

test('shows no purchases message', () => {
  (useProductsHook.useProducts as jest.Mock).mockReturnValue({ purchaseHistory: [] });
  render(<PurchaseHistory />);
  expect(screen.getByText(/No purchases yet/)).toBeInTheDocument();
}); 