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

jest.mock('@/components/journey/JourneyProvider', () => {
  const actual = jest.requireActual('@/components/journey/JourneyProvider');
  return {
    ...actual,
    useJourney: () => ({
      journey: {
        completedMissions: ['login'],
        missions: [
          { id: 'login', completed: true, unlocked: true },
          { id: 'faucet', completed: false, unlocked: true, icon: '🚰', title: 'Usar Faucet', description: 'Obtenha tokens gratuitos do faucet', reward: { description: '5 tokens do faucet' } },
        ],
      },
      getNextAvailableMission: () => ({
        id: 'faucet',
        icon: '🚰',
        title: 'Usar Faucet',
        description: 'Obtenha tokens gratuitos do faucet',
        reward: { description: '5 tokens do faucet' },
      }),
    }),
  };
});

jest.mock('@/components/journey/FaucetComponent', () => ({
  FaucetComponent: () => <div data-testid="faucet-component">FaucetComponent Renderizado</div>,
}));

jest.mock('@/components/common/NetworkGuard', () => ({
  NetworkGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/shop/ProductProvider', () => ({
  ProductProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

// Teste de integração

describe('Home (integração)', () => {
  it('renderiza FaucetComponent quando a próxima missão é faucet e usuário está conectado', () => {
    render(<Home />);
    expect(screen.getByTestId('faucet-component')).toBeInTheDocument();
    expect(screen.getByText('FaucetComponent Renderizado')).toBeInTheDocument();
    expect(screen.getByText('Usar Faucet')).toBeInTheDocument();
    expect(screen.getByText('Obtenha tokens gratuitos do faucet')).toBeInTheDocument();
    expect(screen.getByText('5 tokens do faucet')).toBeInTheDocument();
  });
}); 