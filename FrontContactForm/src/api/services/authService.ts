// authService.ts
import type { IAuthUser, ILoginUser } from "@/types/Auth";
import { GenericRequest } from "@/api/GenericRequest";
import type { ResponseHelper } from "@/types/ResponseHelper";
import type { TokenModel } from "@/types/Auth";

const baseUrl = "api";

export const LoginAuth = async (
  userLogin: ILoginUser,
  setTokens: (tokens: TokenModel) => void
): Promise<ResponseHelper<IAuthUser> | null> => {
  console.log("Iniciando LoginAuth con:", { username: userLogin.username, password: "****" });

  const response = await GenericRequest<IAuthUser>({
    url: `${baseUrl}/login`,
    method: "POST",
    data: {
      username: userLogin.username,
      password: userLogin.password,
    },
  });

  console.log("Respuesta de LoginAuth:", response);

  if (response?.status === 200 && response.data) {
    const tokens = {
      accessToken: response.data.accessToken || "",
      refreshToken: response.data.refreshToken || "",
      accessTokenExpiration: new Date(Date.now() + 3600 * 1000).toISOString(),
    };
    setTokens(tokens);
  }

  return response;
};