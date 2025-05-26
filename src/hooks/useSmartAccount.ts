"use client";

import { useEffect, useState } from "react";
import { usePrivyAuth } from "./usePrivyAuth";

export function useSmartAccount() {
  const { address } = usePrivyAuth();
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | undefined>();

  useEffect(() => {
    if (!address) {
      setSmartAccountAddress(undefined);
      return;
    }
    // Aqui você pode implementar lógica real do SDK futuramente
    setSmartAccountAddress(address);
  }, [address]);

  return {
    smartAccountAddress,
  };
} 