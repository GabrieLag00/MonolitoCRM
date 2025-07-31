import { z } from "zod";

export const errorSchema = z.object({
  error: z.string(),
  details: z
    .union([
      z.string(),
      z.array(z.object({ campo: z.string(), mensaje: z.string() })),
    ])
    .optional(),
});

export interface ILoginUser {
  username: string,
  password: string,
}

export interface TokenModel {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string;
}

export interface IAuthUser {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiration?: string;

}

