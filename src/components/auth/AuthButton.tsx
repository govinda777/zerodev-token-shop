import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useState } from 'react';

export const LoginButton = () => {
  const { isConnected, connect, disconnect, address } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      if (isConnected) {
        disconnect();
      } else {
        await connect();
      }
    } catch (err) {
      // console.error('Authentication error:', err); // Replaced by user notification if connect() throws & is handled by usePrivyAuth or calling component
      // Assuming connect() itself or usePrivyAuth would trigger a notification on error.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleAuth}
        disabled={isLoading}
        className={`
          px-6 py-2 rounded-lg font-medium
          ${isConnected 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {isConnected ? 'Logging out...' : 'Logging in...'}
          </span>
        ) : (
          isConnected ? 'Logout' : 'Login with Wallet'
        )}
      </button>
      
      {isConnected && address && (
        <p className="text-sm text-gray-600 mt-2">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      )}
    </div>
  );
};

// Exportar LoginButton como AuthButton para compatibilidade
export const AuthButton = LoginButton; 