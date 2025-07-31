// GenericRequest.ts
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { RequestOptions } from "@/types/RequestOptions";
import type { ResponseHelper } from "@/types/ResponseHelper";

const baseURL = import.meta.env.VITE_URL_API;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // 👈 Esto permite que las cookies viajen
});

// Interceptor para manejar errores 401 (opcional)
// Puedes eliminar esta parte si el backend ya maneja el refresh solo por cookies
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refrescar desde cookie (sin enviar token manualmente)
        const refreshResponse = await axiosInstance.post("/api/refresh", {}, {
          headers: { "Content-Type": "application/json" },
        });

        const accessToken = refreshResponse.data?.accessToken;

        if (accessToken) {
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          };
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error al refrescar token:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Función principal
export async function GenericRequest<T>({
  url,
  method,
  headers,
  params,
  data,
}: RequestOptions): Promise<ResponseHelper<T> | null> {
  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      headers: {
        ...(headers || { "Content-Type": "application/json" }),
      },
      withCredentials: true,
      params,
      data,
    };

    const response = await axiosInstance(config);
    return response.data as ResponseHelper<T>;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error en la solicitud:", error.response?.data || error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    return null;
  }
}