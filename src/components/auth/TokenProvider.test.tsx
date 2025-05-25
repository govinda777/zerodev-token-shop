import { render, screen, waitFor, act } from '@testing-library/react';
import { TokenProvider, useTokens } from './TokenProvider';
import React from 'react';

// Mock do hook usePrivyAuth
jest.mock('@/hooks/usePrivyAuth', () => ({
  usePrivyAuth: jest.fn()
}));

// Mock do JourneyLogger
jest.mock('@/utils/journeyLogger', () => ({
  __esModule: true,
  default: {
    logFirstLogin: jest.fn(),
    logTokenReward: jest.fn()
  }
}));

const mockUsePrivyAuth = require('@/hooks/usePrivyAuth').usePrivyAuth as jest.Mock;
const mockJourneyLogger = require('@/utils/journeyLogger').default;

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Componente de teste para usar o hook
function TestComponent() {
  const { balance, addTokens, removeTokens, isLoading } = useTokens();

  return (
    <div>
      <div data-testid="balance">{balance}</div>
      <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
      <button onClick={() => addTokens(10)} data-testid="add-tokens">
        Add Tokens
      </button>
      <button onClick={() => removeTokens(5)} data-testid="remove-tokens">
        Remove Tokens
      </button>
    </div>
  );
}

describe('TokenProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve renderizar children corretamente', () => {
    mockUsePrivyAuth.mockReturnValue({
      isConnected: false,
      address: undefined
    });

    render(
      <TokenProvider>
        <div data-testid="child">Test Child</div>
      </TokenProvider>
    );

    // Avançar timers para simular o useEffect
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('deve fornecer balance inicial 0 quando não conectado', async () => {
    mockUsePrivyAuth.mockReturnValue({
      isConnected: false,
      address: undefined
    });

    render(
      <TokenProvider>
        <TestComponent />
      </TokenProvider>
    );

    // Avançar timers para simular o useEffect
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('0');
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });
  });

  it('deve conceder tokens de boas-vindas para novo usuário', async () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      address: testAddress
    });

    render(
      <TokenProvider>
        <TestComponent />
      </TokenProvider>
    );

    // Avançar timers para simular o useEffect
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('10');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(`initial_grant_${testAddress}`, 'true');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(testAddress, '10');
      expect(mockJourneyLogger.logFirstLogin).toHaveBeenCalledWith(testAddress, 10);
      expect(mockJourneyLogger.logTokenReward).toHaveBeenCalledWith(testAddress, 10, 'welcome_bonus');
    });
  });

  it('deve carregar balance existente para usuário retornando', async () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === `initial_grant_${testAddress}`) return 'true';
      if (key === testAddress) return '25';
      return null;
    });

    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      address: testAddress
    });

    render(
      <TokenProvider>
        <TestComponent />
      </TokenProvider>
    );

    // Avançar timers para simular o useEffect
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('25');
      expect(mockJourneyLogger.logFirstLogin).not.toHaveBeenCalled();
    });
  });

  it('deve adicionar tokens corretamente', async () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === `initial_grant_${testAddress}`) return 'true';
      if (key === testAddress) return '20';
      return null;
    });

    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      address: testAddress
    });

    render(
      <TokenProvider>
        <TestComponent />
      </TokenProvider>
    );

    // Avançar timers para simular o useEffect
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('20');
    });

    // Adicionar tokens
    const addButton = screen.getByTestId('add-tokens');
    act(() => {
      addButton.click();
    });

    expect(screen.getByTestId('balance')).toHaveTextContent('30');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(testAddress, '30');
    expect(mockJourneyLogger.logTokenReward).toHaveBeenCalledWith(testAddress, 10, 'manual_addition');
  });

  it('deve remover tokens corretamente quando há saldo suficiente', async () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === `initial_grant_${testAddress}`) return 'true';
      if (key === testAddress) return '20';
      return null;
    });

    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      address: testAddress
    });

    render(
      <TokenProvider>
        <TestComponent />
      </TokenProvider>
    );

    // Avançar timers para simular o useEffect
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('20');
    });

    // Remover tokens
    const removeButton = screen.getByTestId('remove-tokens');
    act(() => {
      removeButton.click();
    });

    expect(screen.getByTestId('balance')).toHaveTextContent('15');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(testAddress, '15');
  });

  it('não deve remover tokens quando saldo é insuficiente', async () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === `initial_grant_${testAddress}`) return 'true';
      if (key === testAddress) return '3';
      return null;
    });

    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      address: testAddress
    });

    render(
      <TokenProvider>
        <TestComponent />
      </TokenProvider>
    );

    // Avançar timers para simular o useEffect
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('3');
    });

    // Tentar remover mais tokens do que disponível
    const removeButton = screen.getByTestId('remove-tokens');
    act(() => {
      removeButton.click();
    });

    // Balance deve permanecer o mesmo
    expect(screen.getByTestId('balance')).toHaveTextContent('3');
  });

  it('não deve fazer nada quando não há endereço conectado', async () => {
    mockUsePrivyAuth.mockReturnValue({
      isConnected: false,
      address: undefined
    });

    render(
      <TokenProvider>
        <TestComponent />
      </TokenProvider>
    );

    // Avançar timers para simular o useEffect
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('0');
    });

    // Tentar adicionar tokens sem endereço
    const addButton = screen.getByTestId('add-tokens');
    act(() => {
      addButton.click();
    });

    expect(screen.getByTestId('balance')).toHaveTextContent('0');
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('deve mostrar loading durante inicialização', async () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      address: testAddress
    });

    render(
      <TokenProvider>
        <TestComponent />
      </TokenProvider>
    );

    // Antes de avançar os timers, deve estar loading
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    // Avançar timers para simular o useEffect
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });
  });

  it('deve lançar erro quando useTokens é usado fora do provider', () => {
    // Capturar erros do console para evitar poluição nos testes
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTokens must be used within a TokenProvider');

    consoleSpy.mockRestore();
  });
}); 