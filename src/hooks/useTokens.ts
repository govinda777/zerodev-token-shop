import { useContext } from "react";
import { TokenContext, TokenContextType } from "@/components/auth/TokenProvider";

export function useTokens(): TokenContextType {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
} 