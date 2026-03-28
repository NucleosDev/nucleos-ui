// src/services/api.ts
import axios from "axios";
import { env } from "@/config/env";

// Garantir que a URL base está correta
const api = axios.create({
  baseURL: env.apiUrl || "http://localhost:5000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${api.defaults.baseURL}/v1/auth/refresh-token`,
            { refreshToken },
          );
          const { token } = response.data;
          localStorage.setItem("token", token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          if (typeof window !== "undefined") {
            window.location.href = "/entrar";
          }
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.href = "/entrar";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
