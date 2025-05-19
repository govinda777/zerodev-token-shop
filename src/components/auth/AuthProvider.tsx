"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useSmartAccount } from "@/hooks/useSmartAccount";

interface AuthContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  address: string | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect: wagmiConnect } = useConnect({
    connector: injected(),
  });
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { smartAccountAddress } = useSmartAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);
      await wagmiConnect();
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    wagmiDisconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        isConnected,
        isConnecting,
        connect,
        disconnect,
        address: smartAccountAddress,
      }}
    >
      {!mounted ? <div>Carregando autenticação...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 