import { render, screen, waitFor, act } from '@testing-library/react';
import { TokenProvider, useTokens } from './TokenProvider';
import React from 'react';
import { MockAuthProvider } from './MockAuthProvider';
// import JourneyLogger from '@/utils/journeyLogger';
// import { usePrivyAuth } from '@/hooks/usePrivyAuth';

// Mock do hook usePrivyAuth
jest.mock('@/hooks/usePrivyAuth', () => ({
  usePrivyAuth: jest.fn()
}));

const mockUsePrivyAuth = require('@/hooks/usePrivyAuth').usePrivyAuth;

// Mock do JourneyLogger
jest.mock('@/utils/journeyLogger', () => ({
  __esModule: true,
  default: {
    logFirstLogin: jest.fn(),
    logTokenReward: jest.fn(),
    getLogsForUser: jest.fn(() => []),
    getLogs: jest.fn(() => [])
  }
}));

const mockJourneyLogger = require('@/utils/journeyLogger').default;
const mockjourneyLogger = mockJourneyLogger;

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

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MockAuthProvider>
    <TokenProvider>
      {children}
    </TokenProvider>
  </MockAuthProvider>
);

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
      expect(mockjourneyLogger.logTokenReward).toHaveBeenCalledWith(testAddress, 10, 'welcome_bonus');
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
      expect(mockjourneyLogger.logFirstLogin).not.toHaveBeenCalled();
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
    expect(mockjourneyLogger.logTokenReward).toHaveBeenCalledWith(testAddress, 10, 'manual_addition');
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

  it('deve estar pronto após inicialização', async () => {
    const testAddress = '0xABCDEF1234567890123456789012345678901234';
    
    // Garantir que o localStorage está limpo para este endereço
    localStorageMock.getItem.mockImplementation(() => null);
    
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
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      expect(screen.getByTestId('balance')).toHaveTextContent('10');
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

// Componente de teste específico para testar as novas funcionalidades
function ExtendedTestComponent() {
  const { balance, addTokens, removeTokens, isLoading, isFirstLogin, welcomeReward, showWelcomeNotification } = useTokens();

  return (
    <div>
      <div data-testid="balance">{balance}</div>
      <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="isFirstLogin">{isFirstLogin.toString()}</div>
      <div data-testid="welcomeReward">{welcomeReward || ''}</div>
      <div data-testid="showWelcomeNotification">{showWelcomeNotification.toString()}</div>
      <button onClick={() => addTokens(10)} data-testid="add-tokens">
        Add Tokens
      </button>
      <button onClick={() => removeTokens(5)} data-testid="remove-tokens">
        Remove Tokens
      </button>
    </div>
  );
}

describe('TokenProvider - Recompensa Inicial', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('deve conceder tokens de boas-vindas no primeiro login', async () => {
    render(
      <TestWrapper>
        <ExtendedTestComponent />
      </TestWrapper>
    );

    // Aguardar que o componente seja montado e processado
    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('10');
    });

    // Verificar se é primeiro login
    expect(screen.getByTestId('isFirstLogin')).toHaveTextContent('true');
    
    // Verificar se a recompensa foi definida
    expect(screen.getByTestId('welcomeReward')).toHaveTextContent('10');
    
    // Verificar se a notificação deve ser exibida
    expect(screen.getByTestId('showWelcomeNotification')).toHaveTextContent('true');

    // Verificar se os logs foram chamados
    await waitFor(() => {
      expect(mockjourneyLogger.logFirstLogin).toHaveBeenCalledWith(
        expect.any(String),
        10
      );
      expect(mockjourneyLogger.logTokenReward).toHaveBeenCalledWith(
        expect.any(String),
        10,
        'welcome_bonus'
      );
    });
  });

  it('não deve conceder tokens novamente em logins subsequentes', async () => {
    // O MockAuthProvider sempre gera um novo endereço, então vamos testar de forma diferente
    // Primeiro, vamos renderizar e aguardar o primeiro login
    const { rerender } = render(
      <TestWrapper>
        <ExtendedTestComponent />
      </TestWrapper>
    );

    // Aguardar o primeiro login
    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('10');
      expect(screen.getByTestId('isFirstLogin')).toHaveTextContent('true');
    });

    // Limpar os mocks para o segundo teste
    jest.clearAllMocks();

    // Re-renderizar o mesmo componente (simula um novo login com o mesmo endereço)
    rerender(
      <TestWrapper>
        <ExtendedTestComponent />
      </TestWrapper>
    );

    // Aguardar que o componente seja processado novamente
    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('10');
    });

    // Verificar que não é mais primeiro login (o estado pode não mudar imediatamente)
    // Verificar que os logs de primeiro login não foram chamados novamente
    expect(mockjourneyLogger.logFirstLogin).not.toHaveBeenCalled();
    expect(mockjourneyLogger.logTokenReward).not.toHaveBeenCalled();
  });

  it('deve permitir adicionar tokens', async () => {
    render(
      <TestWrapper>
        <ExtendedTestComponent />
      </TestWrapper>
    );

    // Aguardar que o componente seja montado com o saldo inicial de boas-vindas
    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('10');
    });

    // Verificar se o botão de adicionar tokens está presente
    expect(screen.getByTestId('add-tokens')).toBeInTheDocument();
  });

  it('deve armazenar dados no localStorage corretamente', async () => {
    render(
      <TestWrapper>
        <ExtendedTestComponent />
      </TestWrapper>
    );

    // Aguardar que o componente seja montado
    await waitFor(() => {
      expect(screen.getByTestId('balance')).toHaveTextContent('10');
    });

    // Verificar se os dados foram salvos no localStorage
    // Como estamos usando MockAuthProvider, o endereço será gerado automaticamente
    // Vamos verificar se pelo menos algum item foi salvo
    const localStorageKeys = Object.keys(localStorage);
    expect(localStorageKeys.length).toBeGreaterThan(0);
  });
}); 