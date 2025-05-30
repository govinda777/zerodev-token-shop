import { renderHook, act } from '@testing-library/react';
import { usePrivyAuth } from './usePrivyAuth';
import { MockAuthProvider } from '@/components/auth/MockAuthProvider';
import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

// Mock do Privy
jest.mock('@privy-io/react-auth', () => ({
  usePrivy: jest.fn()
}));

// Definir mockUsePrivy para uso nos testes
const mockUsePrivy = usePrivy;

describe('usePrivyAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modo Mock', () => {
    const MockWrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(MockAuthProvider, null, children)
    );

    it('deve retornar estado inicial correto no modo mock', () => {
      const { result } = renderHook(() => usePrivyAuth(), {
        wrapper: MockWrapper
      });

      expect(result.current.isReady).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isConnected).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.address).toBeUndefined();
      expect(result.current.hasWallet).toBe(false);
    });

    it('deve conectar corretamente no modo mock', async () => {
      const { result } = renderHook(() => usePrivyAuth(), {
        wrapper: MockWrapper
      });

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isConnected).toBe(true);
      expect(result.current.address).toBe('0x1234567890123456789012345678901234567890');
      expect(result.current.hasWallet).toBe(true);
      expect(result.current.user).toEqual({
        id: 'mock-user',
        wallet: { address: '0x1234567890123456789012345678901234567890' }
      });
    });

    it('deve desconectar corretamente no modo mock', async () => {
      const { result } = renderHook(() => usePrivyAuth(), {
        wrapper: MockWrapper
      });

      // Primeiro conecta
      await act(async () => {
        await result.current.connect();
      });

      // Depois desconecta
      act(() => {
        result.current.disconnect();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isConnected).toBe(false);
      expect(result.current.address).toBeUndefined();
      expect(result.current.hasWallet).toBe(false);
    });
  });

  describe('Modo Privy', () => {
    it('deve retornar estado inicial correto do Privy', () => {
      mockUsePrivy.mockReturnValue({
        ready: true,
        authenticated: false,
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        connectWallet: jest.fn(),
        linkWallet: jest.fn()
      });

      const { result } = renderHook(() => usePrivyAuth());

      expect(result.current.isReady).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isConnected).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.userInfo).toBeNull();
    });

    it('deve retornar dados do usuário quando autenticado', () => {
      const mockUser = {
        id: 'user-123',
        email: { address: 'test@example.com' },
        wallet: { address: '0xabcdef1234567890' },
        createdAt: 1640995200000
      };

      mockUsePrivy.mockReturnValue({
        ready: true,
        authenticated: true,
        user: mockUser,
        login: jest.fn(),
        logout: jest.fn(),
        connectWallet: jest.fn(),
        linkWallet: jest.fn()
      });

      const { result } = renderHook(() => usePrivyAuth());

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBe(mockUser);
      expect(result.current.address).toBe('0xabcdef1234567890');
      expect(result.current.hasWallet).toBe(true);
      expect(result.current.userInfo).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        wallet: '0xabcdef1234567890',
        createdAt: 1640995200000
      });
    });

    it('deve chamar login quando connect é executado', async () => {
      const mockLogin = jest.fn();
      mockUsePrivy.mockReturnValue({
        ready: true,
        authenticated: false,
        user: null,
        login: mockLogin,
        logout: jest.fn(),
        connectWallet: jest.fn(),
        linkWallet: jest.fn()
      });

      const { result } = renderHook(() => usePrivyAuth());

      await act(async () => {
        await result.current.connect();
      });

      expect(mockLogin).toHaveBeenCalled();
    });

    it('deve chamar logout quando disconnect é executado', () => {
      const mockLogout = jest.fn();
      mockUsePrivy.mockReturnValue({
        ready: true,
        authenticated: true,
        user: {},
        login: jest.fn(),
        logout: mockLogout,
        connectWallet: jest.fn(),
        linkWallet: jest.fn()
      });

      const { result } = renderHook(() => usePrivyAuth());

      act(() => {
        result.current.disconnect();
      });

      expect(mockLogout).toHaveBeenCalled();
    });

    it('deve tratar erro no connect', async () => {
      const mockLogin = jest.fn().mockRejectedValue(new Error('Login failed'));
      mockUsePrivy.mockReturnValue({
        ready: true,
        authenticated: false,
        user: null,
        login: mockLogin,
        logout: jest.fn(),
        connectWallet: jest.fn(),
        linkWallet: jest.fn()
      });

      const { result } = renderHook(() => usePrivyAuth());

      await expect(act(async () => {
        await result.current.connect();
      })).rejects.toThrow('Login failed');
    });
  });
}); 