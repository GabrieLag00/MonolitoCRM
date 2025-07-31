// AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import type { TokenModel } from "@/types/Auth";
import { getTokens, updateTokens } from "@/utils/utils";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string;
  setTokens: (tokens: TokenModel) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokensState] = useState<TokenModel | null>(getTokens()); // Corrección aquí

  useEffect(() => {
    if (tokens) {
      updateTokens(tokens);
    } else {
      updateTokens(null);
    }
  }, [tokens]);

  const setTokens = (newTokens: TokenModel) => {
    setTokensState(newTokens);
  };

  const logout = () => {
    setTokensState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: tokens?.accessToken || "",
        refreshToken: tokens?.refreshToken || "",
        accessTokenExpiration: tokens?.accessTokenExpiration || "",
        setTokens,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };