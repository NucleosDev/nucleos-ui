import axios from "axios";
import { env } from "@/config/env";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const token = localStorage.getItem("token");

  console.log("🔑 TOKEN ENVIADO:", token);
  console.log("➡️ URL:", config.url);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 - token inválido ou não enviado");
    }
    return Promise.reject(error);
  },
);

export default api;
