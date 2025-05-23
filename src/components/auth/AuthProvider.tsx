"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

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
  const { connect: wagmiConnect } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);
      console.log("Connecting to wallet...");
      await wagmiConnect({ connector: injected() });
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    wagmiDisconnect();
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isConnected,
        isConnecting,
        connect,
        disconnect,
        address,
      }}
    >
      {children}
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