"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  address: string | undefined;
}

export const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const connect = async () => {
    setIsConnecting(true);
    
    // Simular delay de conexão
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular endereço de carteira
    const mockAddress = "0x1234567890123456789012345678901234567890";
    setAddress(mockAddress);
    setIsConnected(true);
    setIsConnecting(false);
    
    console.log("Mock auth: Connected with address", mockAddress);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(undefined);
    console.log("Mock auth: Disconnected");
  };

  return (
    <MockAuthContext.Provider value={{
      isConnected,
      isConnecting,
      connect,
      disconnect,
      address
    }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
} 