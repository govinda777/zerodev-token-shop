// Mock setup for tests
export const createMockFunction = <T extends (...args: any[]) => any>() => {
  const fn = jest.fn() as jest.MockedFunction<T>;
  return fn;
};

export const mockUsePrivyAuth = () => ({
  isReady: true,
  isAuthenticated: false,
  isConnecting: false,
  isConnected: false,
  user: null,
  address: undefined,
  connect: jest.fn(),
  disconnect: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  ready: true,
  authenticated: false,
  linkWallet: jest.fn()
});

export const mockUsePrivy = () => ({
  ready: true,
  authenticated: false,
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  linkWallet: jest.fn(),
  unlinkWallet: jest.fn(),
  exportWallet: jest.fn(),
  createWallet: jest.fn()
}); 