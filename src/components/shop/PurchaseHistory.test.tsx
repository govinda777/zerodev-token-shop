import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PurchaseHistory } from './PurchaseHistory';
import { useProducts } from '@/hooks/useProducts'; // Adjusted path
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { Purchase } from '@/types/product';

// Mock dependencies
jest.mock('@/hooks/useProducts');
jest.mock('@/hooks/usePrivyAuth');

const mockUseProducts = useProducts as jest.Mock;
const mockUsePrivyAuth = usePrivyAuth as jest.Mock;

// Helper to ensure the component does not use its internal 'isTesting' mock
const renderActualComponent = () => {
  // The component has `if (isTesting)` check.
  // In a Jest environment, `typeof jest` is 'object'.
  // We want to test the actual component logic.
  // One way is to temporarily undefine jest for the scope of this render,
  // but that can be tricky.
  // A simpler way for this specific component structure might be to ensure
  // the mocks for hooks are set correctly, and the component proceeds.
  // The component's own mock seems to be a simple static return, so if our
  // hook mocks are in place, it should try to render normally.
  // If `isTesting` was a prop, it would be easier.
  // For now, we assume the test setup correctly bypasses or makes this internal check irrelevant.
  return render(<PurchaseHistory />);
};


describe('PurchaseHistory', () => {
  beforeEach(() => {
    mockUseProducts.mockReturnValue({ purchases: [] });
    mockUsePrivyAuth.mockReturnValue({ isConnected: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders null if user is not connected', () => {
    mockUsePrivyAuth.mockReturnValue({ isConnected: false });
    const { container } = renderActualComponent();
    // Expect the component to render nothing, or a specific null-like state
    // Based on the component logic: `if (!isConnected) { return null; }`
    expect(container.firstChild).toBeNull();
  });

  it('renders "No purchases yet" message when connected and history is empty', () => {
    renderActualComponent();
    expect(screen.getByText('Purchase History')).toBeInTheDocument();
    expect(screen.getByText('No purchases yet. Buy something from the shop!')).toBeInTheDocument();
  });

  it('renders purchase history items correctly', () => {
    const mockPurchases: Purchase[] = [
      { productId: 'prod1', productName: 'Product One', timestamp: new Date('2023-01-15').getTime(), price: 10 },
      { productId: 'prod2', productName: 'Product Two', timestamp: new Date('2023-02-20').getTime(), price: 1, installments: 3 },
    ];
    mockUseProducts.mockReturnValue({ purchases: mockPurchases });
    renderActualComponent();

    expect(screen.getByText('Purchase History')).toBeInTheDocument();

    // Check table headers
    expect(screen.getByRole('columnheader', { name: 'Product' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Price' })).toBeInTheDocument();

    // Check first purchase item
    // Current component uses productId for display, not productName.
    expect(screen.getByText(mockPurchases[0].productId)).toBeInTheDocument();
    expect(screen.getByText(new Date(mockPurchases[0].timestamp).toLocaleDateString())).toBeInTheDocument();
    expect(screen.getByText(`${mockPurchases[0].price} Tokens`)).toBeInTheDocument(); // price = 10

    // Check second purchase item (price = 1)
    expect(screen.getByText(mockPurchases[1].productId)).toBeInTheDocument();
    expect(screen.getByText(new Date(mockPurchases[1].timestamp).toLocaleDateString())).toBeInTheDocument();
    // Price is 1, should be "Token" (singular)
    // The component currently displays price and then "Token(s)". It doesn't show installment info in the price column.
    expect(screen.getByText(`${mockPurchases[1].price} Token`)).toBeInTheDocument();
  });

  it('correctly displays "Token" for price 1 and "Tokens" for price > 1', () => {
    const mockPurchases: Purchase[] = [
      { productId: 'single', timestamp: Date.now(), price: 1 },
      { productId: 'multiple', timestamp: Date.now(), price: 5 },
    ];
    mockUseProducts.mockReturnValue({ purchases: mockPurchases });
    renderActualComponent();

    expect(screen.getByText('1 Token')).toBeInTheDocument();
    expect(screen.getByText('5 Tokens')).toBeInTheDocument();
  });

  // Test to ensure the component does not use its internal 'isTesting' block during tests
  it('does not render the hardcoded test version when jest is defined', () => {
    // This test verifies that our testing strategy for this component is working,
    // i.e., we are not seeing the "Produto Teste" and "10 ETH" from its internal mock.
    renderActualComponent(); // Will use mocked hooks for empty purchases by default

    expect(screen.queryByText('Produto Teste')).not.toBeInTheDocument();
    expect(screen.queryByText('10 ETH')).not.toBeInTheDocument();
    expect(screen.getByText('No purchases yet. Buy something from the shop!')).toBeInTheDocument();
  });
});