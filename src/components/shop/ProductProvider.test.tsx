import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductProvider, useProducts, ProductContext } from './ProductProvider';
import { useTokens } from '@/hooks/useTokens';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import JourneyLogger from '@/utils/journeyLogger';
import { Product, Purchase } from '@/types/product';

// Mock dependencies
jest.mock('@/hooks/useTokens');
jest.mock('@/hooks/usePrivyAuth');
jest.mock('@/utils/journeyLogger');

const mockUseTokens = useTokens as jest.Mock;
const mockUsePrivyAuth = usePrivyAuth as jest.Mock;
const mockJourneyLogger = JourneyLogger as jest.Mocked<typeof JourneyLogger>;

// Test component to consume the context
const TestConsumerComponent = () => {
  const { products, purchases, buyProduct, buyProductInstallment } = useProducts();
  return (
    <div>
      <div data-testid="product-count">{products.length}</div>
      <div data-testid="purchase-count">{purchases.length}</div>
      <button onClick={() => buyProduct('1')}>Buy Product 1</button>
      <button onClick={() => buyProductInstallment('1', 3)}>Buy Product 1 Installment</button>
      <div data-testid="first-product-name">{products.length > 0 ? products[0].name : ''}</div>
      {purchases.map(p => (
        <div key={p.timestamp} data-testid={`purchase-${p.productId}`}>
          {p.productId} - {p.price} - Inst: {p.installments || 1}
        </div>
      ))}
    </div>
  );
};

describe('ProductProvider and useProducts', () => {
  let mockRemoveTokens: jest.Mock;

  beforeEach(() => {
    mockRemoveTokens = jest.fn();
    mockUseTokens.mockReturnValue({
      balance: 100,
      removeTokens: mockRemoveTokens,
    });
    mockUsePrivyAuth.mockReturnValue({
      address: '0x123TestAddress',
    });
    mockJourneyLogger.logPurchase.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <ProductProvider>
        <div data-testid="child-element">Hello</div>
      </ProductProvider>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });

  it('provides products from the static list defined in ProductProvider', () => {
    render(
      <ProductProvider>
        <TestConsumerComponent />
      </ProductProvider>
    );
    expect(screen.getByTestId('product-count')).toHaveTextContent('8');
    expect(screen.getByTestId('first-product-name')).toHaveTextContent('Premium Service');
  });

  it('initializes purchases as an empty array', () => {
    render(
      <ProductProvider>
        <TestConsumerComponent />
      </ProductProvider>
    );
    expect(screen.getByTestId('purchase-count')).toHaveTextContent('0');
  });

  describe('buyProduct function', () => {
    const getFirstProductFromProvider = () => {
        let products: Product[] = [];
        // Render provider and consumer just to extract products from context for test data consistency
        render(<ProductProvider><ProductContext.Consumer>{value => { products = value?.products || []; return null; }}</ProductContext.Consumer></ProductProvider>);
        return products[0];
    };

    it('processes a successful purchase', () => {
      const product1 = getFirstProductFromProvider(); // Get the actual product data
      render(
        <ProductProvider>
          <TestConsumerComponent />
        </ProductProvider>
      );

      act(() => {
        screen.getByRole('button', { name: 'Buy Product 1' }).click();
      });

      expect(mockRemoveTokens).toHaveBeenCalledWith(product1.price);
      expect(screen.getByTestId('purchase-count')).toHaveTextContent('1');
      expect(screen.getByTestId('purchase-1')).toHaveTextContent(`1 - ${product1.price} - Inst: 1`);
      expect(mockJourneyLogger.logPurchase).toHaveBeenCalledWith('0x123TestAddress', product1.id, product1.price, undefined);
    });

    const getBuyProductFn = () => {
        let buyProductFn: (productId: string, installments?: number) => boolean = () => false;
        render(
            <ProductProvider>
              <ProductContext.Consumer>
                  {value => {
                      if (value) buyProductFn = value.buyProduct;
                      return null;
                  }}
              </ProductContext.Consumer>
            </ProductProvider>
        );
        return buyProductFn;
    };

    it('returns false and does not process purchase if product not found', () => {
      const buyProductFn = getBuyProductFn();
      let callResult: boolean = false;
      act(() => {
        callResult = buyProductFn('nonexistent-id');
      });

      expect(callResult).toBe(false);
      expect(mockRemoveTokens).not.toHaveBeenCalled();
      expect(mockJourneyLogger.logPurchase).not.toHaveBeenCalled();
    });

    it('returns false if balance is insufficient', () => {
      mockUseTokens.mockReturnValue({ balance: 1, removeTokens: mockRemoveTokens });
      const buyProductFn = getBuyProductFn();
      let callResult: boolean = false;
      act(() => {
        callResult = buyProductFn('1'); // Product '1' is 'Premium Service' with price 5
      });

      expect(callResult).toBe(false);
      expect(mockRemoveTokens).not.toHaveBeenCalled();
    });

    it('returns false if user address is not available', () => {
      mockUsePrivyAuth.mockReturnValue({ address: null });
      const buyProductFn = getBuyProductFn();
      let callResult: boolean = false;
      act(() => {
        callResult = buyProductFn('1');
      });
      expect(callResult).toBe(false);
      expect(mockRemoveTokens).not.toHaveBeenCalled();
    });
  });

  describe('buyProductInstallment function', () => {
     const getProductFromProvider = (id: string) => {
        let products: Product[] = [];
        render(<ProductProvider><ProductContext.Consumer>{value => { products = value?.products || []; return null; }}</ProductContext.Consumer></ProductProvider>);
        return products.find(p => p.id === id);
    };

    const getBuyProductInstallmentFn = () => {
        let buyProductInstallmentFn: (productId: string, installments: number) => boolean = () => false;
        render(
            <ProductProvider>
              <ProductContext.Consumer>
                  {value => {
                      if (value) buyProductInstallmentFn = value.buyProductInstallment;
                      return null;
                  }}
              </ProductContext.Consumer>
            </ProductProvider>
        );
        return buyProductInstallmentFn;
    };

    it('processes a successful installment purchase setup', () => {
      const product1 = getProductFromProvider('1')!; // Product '1' allows installments
      render(
        <ProductProvider>
          <TestConsumerComponent />
        </ProductProvider>
      );
      act(() => {
        screen.getByRole('button', { name: 'Buy Product 1 Installment' }).click();
      });

      expect(mockRemoveTokens).not.toHaveBeenCalled();
      expect(screen.getByTestId('purchase-count')).toHaveTextContent('1');
      expect(screen.getByTestId('purchase-1')).toHaveTextContent(`1 - ${product1.price} - Inst: 3`);
      expect(mockJourneyLogger.logPurchase).toHaveBeenCalledWith('0x123TestAddress', product1.id, product1.price, 3);
    });

    it('returns false if product does not allow installments', () => {
      const buyProductInstallmentFn = getBuyProductInstallmentFn();
      const product2 = getProductFromProvider('2')!; // Product '2' (API Access) does not have installments
      expect(product2.installments).toBeUndefined();

      let callResult: boolean = false;
      act(() => {
        callResult = buyProductInstallmentFn('2', 3);
      });

      expect(callResult).toBe(false);
      expect(mockJourneyLogger.logPurchase).not.toHaveBeenCalled();
    });

    it('returns false if user address is not available for installment', () => {
      mockUsePrivyAuth.mockReturnValue({ address: null });
      const buyProductInstallmentFn = getBuyProductInstallmentFn();
      let callResult: boolean = false;
      act(() => {
        callResult = buyProductInstallmentFn('1', 3); // Product '1' allows installments
      });
      expect(callResult).toBe(false);
    });
  });

  it('useProducts throws error when used outside of ProductProvider', () => {
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => render(<TestConsumerComponent />)).toThrow('useProducts must be used within ProductProvider');

    console.error = originalError;
  });
});