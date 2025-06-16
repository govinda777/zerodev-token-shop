import { renderHook } from '@testing-library/react';
import { usePrivyAuth } from './usePrivyAuth';

describe('usePrivyAuth', () => {
  it('should return default state when simplified', () => {
    const { result } = renderHook(() => usePrivyAuth());
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.address).toBe(null);
    expect(result.current.userId).toBe(null);
    expect(result.current.walletType).toBe('unknown');
    expect(result.current.connectorType).toBe('none');
    expect(result.current.hasWallet).toBe(false);
    expect(result.current.isSmartWallet).toBe(false);
    expect(result.current.isExternalWallet).toBe(false);
    expect(result.current.loginMethods).toEqual(['email', 'wallet', 'google']);
  });
}); 