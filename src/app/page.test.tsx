import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Importação do componente a ser testado
import Home from './page';

// Mocks dos hooks de contexto
jest.mock('@/hooks/usePrivyAuth', () => ({
  usePrivyAuth: () => ({
    isConnected: true,
    user: { wallet: { address: '0x123' } },
    address: '0x123',
  }),
}));

jest.mock('@/hooks/useTokens', () => ({
  useTokens: () => ({
    balance: 100,
    addTokens: jest.fn(),
  }),
}));



jest.mock('@/components/common/NetworkGuard', () => ({
  NetworkGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/shop/ProductProvider', () => ({
  ProductProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useProducts: () => ({
    products: [],
    purchases: [],
    buyProduct: jest.fn(),
    buyProductInstallment: jest.fn(),
  }),
}));

jest.mock('@/components/shop/ProductGrid', () => ({
  ProductGrid: () => <div data-testid="product-grid">ProductGrid Mock</div>,
}));

jest.mock('@/components/auth/LoginDemo', () => ({
  LoginDemo: () => <div>LoginDemo Mock</div>,
}));

jest.mock('@/components/common/Header', () => ({
  Header: () => <div>Header Mock</div>,
}));

jest.mock('@/components/common/Footer', () => ({
  Footer: () => <div>Footer Mock</div>,
}));

jest.mock('@/components/common/SkipLinks', () => ({
  SkipLinks: () => <div>SkipLinks Mock</div>,
}));

jest.mock('@/components/tools/FaucetComponent', () => ({
  FaucetComponent: () => <div data-testid="faucet-component">FaucetComponent Renderizado</div>,
}));

jest.mock('@/components/investment/StakingComponent', () => ({
  StakingComponent: () => <div data-testid="staking-component">StakingComponent Mock</div>,
}));

jest.mock('@/components/investment/PassiveIncomeComponent', () => ({
  PassiveIncomeComponent: () => <div data-testid="passive-income-component">PassiveIncomeComponent Mock</div>,
}));

jest.mock('@/components/nft/NFTMarketplace', () => ({
  NFTMarketplace: () => <div data-testid="nft-marketplace">NFTMarketplace Mock</div>,
}));

jest.mock('@/components/rewards/AirdropComponent', () => ({
  AirdropComponent: () => <div data-testid="airdrop-component">AirdropComponent Mock</div>,
}));

jest.mock('@/components/services/SubscriptionComponent', () => ({
  SubscriptionComponent: () => <div data-testid="subscription-component">SubscriptionComponent Mock</div>,
}));

// Teste de integração
describe('Home (integração)', () => {
  it('renderiza a seção de ferramentas e produtos quando o usuário está conectado', () => {
    render(<Home />);
    
    // Verificar se a seção de ferramentas está presente
    expect(screen.getByText('Ferramentas e Recursos')).toBeInTheDocument();
    expect(screen.getByTestId('faucet-component')).toBeInTheDocument();
    expect(screen.getByText('FaucetComponent Renderizado')).toBeInTheDocument();
    
    // Verificar se a seção de produtos está presente
    expect(screen.getByText('Nossos Produtos')).toBeInTheDocument();
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    
    // Verificar mensagem de boas-vindas
    expect(screen.getByText('Bem-vindo ao Marketplace!')).toBeInTheDocument();
    expect(screen.getByText('Todas as funcionalidades estão liberadas!')).toBeInTheDocument();
  });

  it('renderiza LoginDemo quando o usuário não está conectado', () => {
    // Mock para usuário desconectado
    jest.mocked(require('@/hooks/usePrivyAuth').usePrivyAuth).mockReturnValue({
      isConnected: false,
      user: null,
      address: null,
    });

    render(<Home />);
    
    expect(screen.getByText('LoginDemo Mock')).toBeInTheDocument();
    expect(screen.queryByText('Ferramentas e Recursos')).not.toBeInTheDocument();
    expect(screen.queryByText('Nossos Produtos')).not.toBeInTheDocument();
  });
}); 