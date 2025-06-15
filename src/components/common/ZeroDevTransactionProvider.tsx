"use client";

// Temporarily disabled for deployment - simplified version
import React, { createContext, useContext } from 'react';

interface ZeroDevTransactionContextType {
  executeTransaction: () => Promise<void>;
  isLoading: boolean;
}

const ZeroDevTransactionContext = createContext<ZeroDevTransactionContextType | null>(null);

const ZeroDevTransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const executeTransaction = async () => {
    console.log('Transaction execution temporarily disabled for deployment');
  };

  const value = {
    executeTransaction,
    isLoading: false,
  };

  return (
    <ZeroDevTransactionContext.Provider value={value}>
      <div>
        <div style={{ 
          padding: '1rem', 
          background: '#f0f0f0', 
          borderRadius: '8px', 
          margin: '1rem 0',
          textAlign: 'center'
        }}>
          <p>🚧 ZeroDev transactions temporarily disabled for deployment</p>
          <p>Full blockchain functionality will be restored after resolving dependency conflicts</p>
        </div>
        {children}
      </div>
    </ZeroDevTransactionContext.Provider>
  );
};

export function useZeroDevTransaction() {
  const context = useContext(ZeroDevTransactionContext);
  if (!context) {
    throw new Error('useZeroDevTransaction must be used within ZeroDevTransactionProvider');
  }
  return context;
}

// Export both default and named export for compatibility
export default ZeroDevTransactionProvider;
export { ZeroDevTransactionProvider }; 