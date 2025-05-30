import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NetworkGuard, NetworkProvider, useNetworkValidation } from './NetworkGuard'; // Assuming all are in the same file
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

jest.mock('@/hooks/usePrivyAuth');
const mockUsePrivyAuth = usePrivyAuth as jest.Mock;

const TestChildren = () => <div data-testid="test-children">Children Content</div>;

// Helper to wrap component with NetworkProvider for testing NetworkGuard
const renderWithProvider = (ui: React.ReactElement, providerProps?: any) => {
  return render(
    <NetworkProvider {...providerProps}>
      {ui}
    </NetworkProvider>
  );
};

describe('NetworkGuard and NetworkProvider', () => {
  let mockGetChainId: jest.Mock;
  let mockProviderRequest: jest.Mock;
  let mockProviderOn: jest.Mock;
  let mockProviderRemoveListener: jest.Mock;

  const targetChainId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID || "0xaa36a7";
  const targetNetworkName = process.env.NEXT_PUBLIC_TARGET_NETWORK_NAME || "Sepolia";

  beforeEach(() => {
    mockGetChainId = jest.fn().mockResolvedValue(targetChainId);
    mockProviderRequest = jest.fn();
    mockProviderOn = jest.fn(); // Mock for web3Provider.on
    mockProviderRemoveListener = jest.fn(); // Mock for web3Provider.removeListener

    mockUsePrivyAuth.mockReturnValue({
      address: '0xTestUser',
      isConnected: true,
      getChainId: mockGetChainId,
      provider: {
        request: mockProviderRequest,
        on: mockProviderOn,
        removeListener: mockProviderRemoveListener,
      },
    });
    // Mock window.alert
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('NetworkProvider Initialization and Network Check', () => {
    it('initially sets isOnCorrectNetwork to true if getChainId matches target', async () => {
      renderWithProvider(<TestChildren />); // Render something that uses the context indirectly
      await waitFor(() => expect(mockGetChainId).toHaveBeenCalled());
      // To check the internal state, we'd need a consumer. NetworkGuard itself is a consumer.
      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      await waitFor(() => expect(screen.getByTestId('test-children')).toBeInTheDocument());
    });

    it('sets isOnCorrectNetwork to false if getChainId does not match target', async () => {
      mockGetChainId.mockResolvedValue('0x1'); // Different chainId
      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      await waitFor(() => expect(mockGetChainId).toHaveBeenCalled());
      expect(screen.getByText('Rede Incorreta')).toBeInTheDocument();
    });

    it('handles chainChanged event from provider', async () => {
      let chainChangedCallback: (newChainId: string) => void = () => {};
      mockProviderOn.mockImplementation((event, callback) => {
        if (event === 'chainChanged') {
          chainChangedCallback = callback;
        }
      });

      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      await waitFor(() => expect(mockGetChainId).toHaveBeenCalled()); // Initial check

      // Simulate chainChanged event
      act(() => {
        chainChangedCallback('0x1'); // Change to incorrect network
      });
      await waitFor(() => expect(screen.getByText('Rede Incorreta')).toBeInTheDocument());

      act(() => {
        chainChangedCallback(targetChainId); // Change back to correct network
      });
      await waitFor(() => expect(screen.getByTestId('test-children')).toBeInTheDocument());
    });
  });

  describe('NetworkGuard UI States', () => {
    it('renders children if wallet is not connected', () => {
      mockUsePrivyAuth.mockReturnValue({
        address: null, isConnected: false, getChainId: mockGetChainId, provider: null,
      });
      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.queryByText('Verificando rede...')).not.toBeInTheDocument();
      expect(screen.queryByText('Rede Incorreta')).not.toBeInTheDocument();
    });

    it('renders loading UI when isLoading is true and wallet connected', async () => {
      // Simulate loading state by making getChainId promise not resolve immediately
      mockGetChainId.mockImplementation(() => new Promise(() => {})); // Pending promise
      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      // The isLoading state in provider is set true before calling getChainId
      await waitFor(() => expect(screen.getByText('Verificando rede...')).toBeInTheDocument());
    });

    it('renders incorrect network UI when isOnCorrectNetwork is false', async () => {
      mockGetChainId.mockResolvedValue('0x1'); // Incorrect network
      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      await waitFor(() => expect(screen.getByText('Rede Incorreta')).toBeInTheDocument());
      expect(screen.getByText(`Por favor, mude para a rede ${targetNetworkName} em sua carteira para continuar.`)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `Mudar para ${targetNetworkName}` })).toBeInTheDocument();
      expect(screen.getByText(`Chain ID: ${targetChainId}`)).toBeInTheDocument();
    });

    it('renders children when isOnCorrectNetwork is true and wallet connected', async () => {
      mockGetChainId.mockResolvedValue(targetChainId); // Correct network
      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      await waitFor(() => expect(mockGetChainId).toHaveBeenCalled());
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });
  });

  describe('switchNetwork Functionality (via NetworkGuard button)', () => {
    beforeEach(() => {
      // Ensure we start on an incorrect network for these tests
      mockGetChainId.mockResolvedValue('0x1');
    });

    it('successfully switches network via wallet_switchEthereumChain', async () => {
      mockProviderRequest.mockImplementation(async ({ method }) => {
        if (method === 'wallet_switchEthereumChain') {
          // Simulate successful switch by immediately updating chainId for the next check
          mockGetChainId.mockResolvedValue(targetChainId);
          return null;
        }
      });

      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      await waitFor(() => expect(screen.getByText('Rede Incorreta')).toBeInTheDocument());

      const switchButton = screen.getByRole('button', { name: `Mudar para ${targetNetworkName}` });
      fireEvent.click(switchButton);

      await waitFor(() => expect(mockProviderRequest).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      }));
      // After switch, checkNetwork is called again.
      await waitFor(() => expect(screen.getByTestId('test-children')).toBeInTheDocument());
    });

    it('adds network via wallet_addEthereumChain if switch fails with 4902, then switches', async () => {
      mockProviderRequest
        .mockImplementationOnce(async ({ method }) => { // First call (switch)
          if (method === 'wallet_switchEthereumChain') {
            const error = new Error('Unrecognized chain ID') as any;
            error.code = 4902;
            throw error;
          }
        })
        .mockImplementationOnce(async ({ method }) => { // Second call (add)
          if (method === 'wallet_addEthereumChain') {
            // Simulate successful add by updating chainId for the next check
            mockGetChainId.mockResolvedValue(targetChainId);
            return null;
          }
        });

      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      await waitFor(() => expect(screen.getByText('Rede Incorreta')).toBeInTheDocument());

      const switchButton = screen.getByRole('button', { name: `Mudar para ${targetNetworkName}` });
      fireEvent.click(switchButton);

      await waitFor(() => expect(mockProviderRequest).toHaveBeenCalledWith({
        method: 'wallet_addEthereumChain',
        params: [expect.objectContaining({ chainId: targetChainId, chainName: targetNetworkName })],
      }));
      await waitFor(() => expect(screen.getByTestId('test-children')).toBeInTheDocument());
    });

    it('alerts if adding network fails after switch fails with 4902', async () => {
      mockProviderRequest
        .mockRejectedValueOnce({ code: 4902 }) // Fail switch
        .mockRejectedValueOnce(new Error('Failed to add network')); // Fail add

      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      await waitFor(() => expect(screen.getByText('Rede Incorreta')).toBeInTheDocument());

      const switchButton = screen.getByRole('button', { name: `Mudar para ${targetNetworkName}` });
      fireEvent.click(switchButton);

      await waitFor(() => expect(window.alert).toHaveBeenCalledWith(`Failed to switch to ${targetNetworkName}. Please add it to your wallet manually.`));
      expect(screen.getByText('Rede Incorreta')).toBeInTheDocument(); // Should still be on incorrect network
    });

    it('alerts if switch fails with a generic error', async () => {
      const errorMessage = 'User rejected the request.';
      mockProviderRequest.mockRejectedValueOnce(new Error(errorMessage));

      renderWithProvider(<NetworkGuard><TestChildren /></NetworkGuard>);
      await waitFor(() => expect(screen.getByText('Rede Incorreta')).toBeInTheDocument());

      const switchButton = screen.getByRole('button', { name: `Mudar para ${targetNetworkName}` });
      fireEvent.click(switchButton);

      await waitFor(() => expect(window.alert).toHaveBeenCalledWith(`Failed to switch to ${targetNetworkName}. Error: ${errorMessage}`));
      expect(screen.getByText('Rede Incorreta')).toBeInTheDocument();
    });
  });

  it('useNetworkValidation throws error if used outside of NetworkProvider', () => {
    const originalError = console.error;
    console.error = jest.fn(); // Suppress error boundary message
    expect(() => render(<NetworkGuard><TestChildren/></NetworkGuard>)).toThrow('useNetworkValidation must be used within a NetworkProvider');
    console.error = originalError;
  });
});
