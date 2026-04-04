// =============================================================================
// Cliente HTTP base – axios com interceptors de auth e refresh
// =============================================================================
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:5000";

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Injeta o token JWT em cada requisição
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("@nucleos:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Refresh automático ao receber 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("@nucleos:refreshToken");
        const { data } = await axios.post(
          `${BASE_URL}/api/v1/Auth/refresh-token`,
          {
            refreshToken,
          },
        );
        localStorage.setItem("@nucleos:token", data.token);
        localStorage.setItem("@nucleos:refreshToken", data.refreshToken);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch {
        localStorage.removeItem("@nucleos:token");
        localStorage.removeItem("@nucleos:refreshToken");
        window.location.href = "/entrar";
      }
    }
    return Promise.reject(error);
  },
);
