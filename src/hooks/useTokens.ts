import { useContext } from "react";
import { TokenContext } from "@/components/auth/TokenProvider";

export function useTokens() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
} 