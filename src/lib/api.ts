import { env } from "@/config/env";
import type { ApiError, ApiResponse } from "@/types";

// ============================================================================
// CONFIGURAÇÃO BASE DO FETCH
// ============================================================================

const BASE_URL = env.apiUrl;

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Construir URL com query params
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Headers padrão
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  // Adicionar token de autenticação se existir
  const token = getAuthToken();
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Parsear resposta
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error: ApiError = {
        message: data?.message || `Erro HTTP: ${response.status}`,
        statusCode: response.status,
        errors: data?.errors,
      };
      throw error;
    }

    return data as T;
  } catch (error) {
    // Se já é um ApiError, propagar
    if ((error as ApiError).statusCode) {
      throw error;
    }
    // Erro de rede ou outro
    throw {
      message: "Erro de conexão com o servidor",
      statusCode: 0,
    } as ApiError;
  }
}

// ============================================================================
// MÉTODOS HTTP
// ============================================================================

export const api = {
  get<T>(endpoint: string, params?: RequestOptions["params"]): Promise<T> {
    return request<T>(endpoint, { method: "GET", params });
  },

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: "DELETE" });
  },
};

// ============================================================================
// HELPERS
// ============================================================================

export function handleApiError(error: unknown): string {
  if ((error as ApiError).message) {
    return (error as ApiError).message;
  }
  return "Ocorreu um erro inesperado";
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "statusCode" in error;
}
