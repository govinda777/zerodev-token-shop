import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthButton, LoginButton } from './AuthButton';
import React from 'react';

// Mock do hook usePrivyAuth
jest.mock('@/hooks/usePrivyAuth', () => ({
  usePrivyAuth: jest.fn()
}));

const mockUsePrivyAuth = require('@/hooks/usePrivyAuth').usePrivyAuth as jest.Mock;

describe('AuthButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve mostrar "Login with Wallet" quando não conectado', () => {
    mockUsePrivyAuth.mockReturnValue({
      isConnected: false,
      connect: jest.fn(),
      disconnect: jest.fn(),
      address: undefined
    });

    render(<AuthButton />);

    expect(screen.getByRole('button', { name: /login with wallet/i })).toBeInTheDocument();
  });

  it('deve mostrar "Logout" quando conectado', () => {
    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      address: '0x1234567890123456789012345678901234567890'
    });

    render(<AuthButton />);

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('deve mostrar endereço quando conectado', () => {
    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      address: '0x1234567890123456789012345678901234567890'
    });

    render(<AuthButton />);

    expect(screen.getByText('Connected: 0x1234...7890')).toBeInTheDocument();
  });

  it('deve chamar connect quando não conectado e botão é clicado', async () => {
    const mockConnect = jest.fn();
    mockUsePrivyAuth.mockReturnValue({
      isConnected: false,
      connect: mockConnect,
      disconnect: jest.fn(),
      address: undefined
    });

    render(<AuthButton />);

    const button = screen.getByRole('button', { name: /login with wallet/i });
    fireEvent.click(button);

    expect(mockConnect).toHaveBeenCalled();
  });

  it('deve chamar disconnect quando conectado e botão é clicado', () => {
    const mockDisconnect = jest.fn();
    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      connect: jest.fn(),
      disconnect: mockDisconnect,
      address: '0x1234567890123456789012345678901234567890'
    });

    render(<AuthButton />);

    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('deve mostrar loading state durante login', async () => {
    const mockConnect = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    mockUsePrivyAuth.mockReturnValue({
      isConnected: false,
      connect: mockConnect,
      disconnect: jest.fn(),
      address: undefined
    });

    render(<AuthButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText('Logging in...')).not.toBeInTheDocument();
    });
  });

  it('deve tratar erro durante connect', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockConnect = jest.fn().mockRejectedValue(new Error('Connection failed'));
    
    mockUsePrivyAuth.mockReturnValue({
      isConnected: false,
      connect: mockConnect,
      disconnect: jest.fn(),
      address: undefined
    });

    render(<AuthButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Authentication error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('deve aplicar classes CSS corretas quando não conectado', () => {
    mockUsePrivyAuth.mockReturnValue({
      isConnected: false,
      connect: jest.fn(),
      disconnect: jest.fn(),
      address: undefined
    });

    render(<AuthButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-500', 'hover:bg-blue-600');
  });

  it('deve aplicar classes CSS corretas quando conectado', () => {
    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      address: '0x1234567890123456789012345678901234567890'
    });

    render(<AuthButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500', 'hover:bg-red-600');
  });

  it('deve não mostrar endereço quando conectado mas sem address', () => {
    mockUsePrivyAuth.mockReturnValue({
      isConnected: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      address: undefined
    });

    render(<AuthButton />);

    expect(screen.queryByText(/connected:/i)).not.toBeInTheDocument();
  });
});

describe('LoginButton', () => {
  it('deve ser o mesmo componente que AuthButton', () => {
    expect(LoginButton).toBe(AuthButton);
  });
}); 