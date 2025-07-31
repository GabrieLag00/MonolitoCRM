// authUtils.ts
import axios from "axios";
import type { TokenModel } from "@/types/Auth";

const baseURL = import.meta.env.VITE_URL_API || "http://localhost:3000";

let currentTokens: TokenModel | null = null;

export const updateTokens = (tokens: TokenModel | null) => {
  currentTokens = tokens;
  localStorage.setItem("tokens", JSON.stringify(tokens));
};

export const getTokens = (): TokenModel | null => {
  if (currentTokens) return currentTokens;
  const stored = localStorage.getItem("tokens");
  return stored ? JSON.parse(stored) : null;
};

export const refreshToken = async (): Promise<string | null> => {
  const tokens = getTokens();
  if (!tokens?.refreshToken) return null;

  try {
    console.log("Enviando petición a /api/refresh con refreshToken");
    const response = await axios.post(`${baseURL}/api/refresh`, {
      refreshToken: tokens.refreshToken,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Respuesta de /api/refresh:", response.data, "Estado:", response.status);
    const newTokens = response.data as TokenModel;
    updateTokens(newTokens);
    return newTokens.accessToken;
  } catch (error) {
    console.error("Error al refrescar token:", error);
    localStorage.removeItem("tokens");
    return null;
  }
};