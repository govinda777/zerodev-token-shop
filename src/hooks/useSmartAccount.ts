"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export function useSmartAccount() {
  const { address } = useAccount();
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