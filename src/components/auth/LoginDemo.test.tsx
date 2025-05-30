import { render, screen, fireEvent } from '@testing-library/react';
import { LoginDemo } from './LoginDemo';
import { TokenProvider } from './TokenProvider';
import React from 'react';
import { usePrivyAuth as mockUsePrivyAuth } from '@/hooks/usePrivyAuth';

// Mock do hook usePrivyAuth
jest.mock('@/hooks/usePrivyAuth', () => ({
  usePrivyAuth: jest.fn()
}));

// Wrapper component with TokenProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TokenProvider>
    {children}
  </TokenProvider>
);

// Mock do window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn()
});

describe('LoginDemo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve mostrar loading quando não está pronto', () => {
    mockUsePrivyAuth.mockReturnValue({
      isReady: false,
      isAuthenticated: false,
      isConnecting: false,
      user: null,
      address: undefined,
      userInfo: null,
      hasWallet: false,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    expect(screen.getByText('Carregando Privy...')).toBeInTheDocument();
  });

  it('deve mostrar tela de login quando não autenticado', () => {
    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: false,
      isConnecting: false,
      user: null,
      address: undefined,
      userInfo: null,
      hasWallet: false,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    expect(screen.getByText('Demonstração do Privy')).toBeInTheDocument();
    expect(screen.getByText('Faça login para acessar o marketplace')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /conectar carteira/i })).toBeInTheDocument();
  });

  it('deve mostrar estado de connecting quando conectando', () => {
    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: false,
      isConnecting: true,
      user: null,
      address: undefined,
      userInfo: null,
      hasWallet: false,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    expect(screen.getByText('Conectando...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('deve chamar connect quando botão de conectar é clicado', () => {
    const mockConnect = jest.fn();
    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: false,
      isConnecting: false,
      user: null,
      address: undefined,
      userInfo: null,
      hasWallet: false,
      connect: mockConnect,
      disconnect: jest.fn(),
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    const connectButton = screen.getByRole('button', { name: /conectar carteira/i });
    fireEvent.click(connectButton);

    expect(mockConnect).toHaveBeenCalled();
  });

  it('deve mostrar informações do usuário quando autenticado', () => {
    const mockUserInfo = {
      id: 'user-123',
      email: 'test@example.com',
      wallet: '0xabcdef1234567890',
      createdAt: 1640995200000
    };

    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: true,
      isConnecting: false,
      user: { id: 'user-123' },
      address: '0xabcdef1234567890',
      userInfo: mockUserInfo,
      hasWallet: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    expect(screen.getByText('Conectado com sucesso!')).toBeInTheDocument();
    expect(screen.getByText('user-123')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('0xabcdef1234567890')).toBeInTheDocument();
  });

  it('deve mostrar botão de desconectar quando autenticado', () => {
    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: true,
      isConnecting: false,
      user: { id: 'user-123' },
      address: '0xabcdef1234567890',
      userInfo: {
        id: 'user-123',
        wallet: '0xabcdef1234567890',
        createdAt: Date.now()
      },
      hasWallet: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    expect(screen.getByRole('button', { name: /desconectar/i })).toBeInTheDocument();
  });

  it('deve chamar disconnect quando botão de desconectar é clicado', () => {
    const mockDisconnect = jest.fn();
    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: true,
      isConnecting: false,
      user: { id: 'user-123' },
      address: '0xabcdef1234567890',
      userInfo: {
        id: 'user-123',
        wallet: '0xabcdef1234567890',
        createdAt: Date.now()
      },
      hasWallet: true,
      connect: jest.fn(),
      disconnect: mockDisconnect,
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    const disconnectButton = screen.getByRole('button', { name: /desconectar/i });
    fireEvent.click(disconnectButton);

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('deve mostrar botão do Etherscan quando tem carteira', () => {
    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: true,
      isConnecting: false,
      user: { id: 'user-123' },
      address: '0xabcdef1234567890',
      userInfo: {
        id: 'user-123',
        wallet: '0xabcdef1234567890',
        createdAt: Date.now()
      },
      hasWallet: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    expect(screen.getByRole('button', { name: /ver no etherscan/i })).toBeInTheDocument();
  });

  it('deve abrir Etherscan quando botão é clicado', () => {
    const mockWindowOpen = jest.fn();
    window.open = mockWindowOpen;

    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: true,
      isConnecting: false,
      user: { id: 'user-123' },
      address: '0xabcdef1234567890',
      userInfo: {
        id: 'user-123',
        wallet: '0xabcdef1234567890',
        createdAt: Date.now()
      },
      hasWallet: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    const etherscanButton = screen.getByRole('button', { name: /ver no etherscan/i });
    fireEvent.click(etherscanButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://etherscan.io/address/0xabcdef1234567890',
      '_blank'
    );
  });

  it('deve mostrar botão de conectar carteira adicional quando não tem carteira', () => {
    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: true,
      isConnecting: false,
      user: { id: 'user-123' },
      address: undefined,
      userInfo: {
        id: 'user-123',
        createdAt: Date.now()
      },
      hasWallet: false,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectWallet: jest.fn()
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    expect(screen.getByRole('button', { name: /conectar carteira adicional/i })).toBeInTheDocument();
  });

  it('deve chamar connectWallet quando botão de carteira adicional é clicado', () => {
    const mockConnectWallet = jest.fn();
    mockUsePrivyAuth.mockReturnValue({
      isReady: true,
      isAuthenticated: true,
      isConnecting: false,
      user: { id: 'user-123' },
      address: undefined,
      userInfo: {
        id: 'user-123',
        createdAt: Date.now()
      },
      hasWallet: false,
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectWallet: mockConnectWallet
    });

    render(<LoginDemo />, { wrapper: TestWrapper });

    const connectWalletButton = screen.getByRole('button', { name: /conectar carteira adicional/i });
    fireEvent.click(connectWalletButton);

    expect(mockConnectWallet).toHaveBeenCalled();
  });
}); 