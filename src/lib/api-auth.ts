// // src/lib/api-auth.ts
// import { env } from "@/config/env";
// import {
//   User,
//   UserProfile,
//   UserRole,
//   UserSecurity,
//   UserLevel,
//   Subscription,
// } from "@/types/user";
// import { API_ROUTES } from "@/constants/routes";

// interface LoginCredentials {
//   email: string;
//   password: string;
//   RememberMe?: boolean;
// }

// interface RegisterData {
//   fullName: string;
//   email: string;
//   password: string;
//   ConfirmPassword?: string;
//   phone?: string;
//   cpf?: string;
// }

// interface AuthResponse {
//   success: boolean;
//   message: string;
//   userId: string;
//   email: string;
//   fullName: string;
//   token: string;
//   expiresAt: string;
//   errors?: string[];
// }

// interface ApiError {
//   message: string;
//   statusCode: number;
//   errors?: string[];
// }

// // Tipo para o usuário armazenado localmente (versão simplificada)
// interface StoredUser {
//   id: string;
//   email: string;
//   fullName: string;
//   avatarUrl?: string;
//   nickname?: string;
//   roles?: string[];
// }

// /**
//  * Classe para lidar com autenticação
//  */
// export class ApiAuth {
//   private static instance: ApiAuth;
//   private baseUrl: string;
//   private tokenKey = "nucleos_token";
//   private userKey = "nucleos_user";

//   private constructor() {
//     // Garantir que a URL base não tenha barras duplicadas
//     const apiUrl = env.apiUrl || "localhost:5000/api";
//     this.baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
//     console.log("🔧 API Base URL:", this.baseUrl); // Para debug
//   }

//   public static getInstance(): ApiAuth {
//     if (!ApiAuth.instance) {
//       ApiAuth.instance = new ApiAuth();
//     }
//     return ApiAuth.instance;
//   }

//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     try {
//       const url = `${this.baseUrl}${API_ROUTES.AUTH.LOGIN}`;
//       console.log("🔐 Login URL:", url);

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: credentials.email,
//           password: credentials.password,
//           RememberMe: credentials.RememberMe || false,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw {
//           message: data.message || "Erro ao fazer login",
//           statusCode: response.status,
//           errors: data.errors,
//         } as ApiError;
//       }

//       if (data.success && typeof window !== "undefined") {
//         this.setToken(data.token);
//         this.setUser({
//           id: data.userId,
//           email: data.email,
//           fullName: data.fullName,
//         });

//         // Se o backend retornar dados completos do usuário, armazenar também
//         if (data.user) {
//           localStorage.setItem("nucleos_user_full", JSON.stringify(data.user));
//         }
//       }

//       return data;
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   }

//   async register(data: RegisterData): Promise<AuthResponse> {
//     try {
//       const url = `${this.baseUrl}${API_ROUTES.AUTH.REGISTER}`;
//       console.log("📝 Register URL:", url);
//       console.log("📦 Payload:", {
//         email: data.email,
//         fullName: data.fullName,
//         phone: data.phone,
//         cpf: data.cpf,
//         // não logar senha
//       });

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: data.email,
//           fullName: data.fullName,
//           password: data.password,
//           ConfirmPassword: data.ConfirmPassword || data.password,
//           phone: data.phone,
//           cpf: data.cpf,
//         }),
//       });

//       console.log("📡 Response status:", response.status);

//       const result = await response.json();
//       console.log("📨 Response data:", result);

//       if (!response.ok) {
//         throw {
//           message: result.message || "Erro ao fazer registro",
//           statusCode: response.status,
//           errors: result.errors,
//         } as ApiError;
//       }

//       if (result.success && typeof window !== "undefined") {
//         this.setToken(result.token);
//         this.setUser({
//           id: result.userId,
//           email: result.email,
//           fullName: result.fullName,
//         });

//         if (result.user) {
//           localStorage.setItem(
//             "nucleos_user_full",
//             JSON.stringify(result.user),
//           );
//         }
//       }

//       return result;
//     } catch (error) {
//       console.error("Register error:", error);
//       throw error;
//     }
//   }

//   async logout(): Promise<void> {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem(this.tokenKey);
//       localStorage.removeItem(this.userKey);
//       localStorage.removeItem("nucleos_user_full");
//     }
//   }

//   private setToken(token: string): void {
//     if (typeof window === "undefined") return;
//     localStorage.setItem(this.tokenKey, token);
//   }

//   getToken(): string | null {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem(this.tokenKey);
//   }

//   private setUser(user: StoredUser): void {
//     if (typeof window === "undefined") return;
//     localStorage.setItem(this.userKey, JSON.stringify(user));
//   }

//   getUser(): StoredUser | null {
//     if (typeof window === "undefined") return null;
//     const userStr = localStorage.getItem(this.userKey);
//     if (!userStr) return null;
//     try {
//       return JSON.parse(userStr);
//     } catch {
//       return null;
//     }
//   }

//   getUserFull(): User | null {
//     if (typeof window === "undefined") return null;
//     const userStr = localStorage.getItem("nucleos_user_full");
//     if (!userStr) return null;
//     try {
//       return JSON.parse(userStr);
//     } catch {
//       return null;
//     }
//   }

//   isAuthenticated(): boolean {
//     if (typeof window === "undefined") return false;
//     const token = this.getToken();
//     if (!token) return false;

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const exp = payload.exp * 1000;
//       const isValid = Date.now() < exp;

//       if (!isValid) {
//         this.logout();
//       }

//       return isValid;
//     } catch {
//       return false;
//     }
//   }

//   /**
//    * Busca os dados completos do usuário no backend
//    */
//   async fetchCurrentUser(): Promise<User | null> {
//     try {
//       const user = await this.get<User>("/v1/users/me");
//       if (user && typeof window !== "undefined") {
//         localStorage.setItem("nucleos_user_full", JSON.stringify(user));
//       }
//       return user;
//     } catch (error) {
//       console.error("Error fetching current user:", error);
//       return null;
//     }
//   }

//   /**
//    * Faz uma requisição autenticada (com token)
//    */
//   async fetchAuth<T = any>(url: string, options: RequestInit = {}): Promise<T> {
//     const token = this.getToken();

//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//     };

//     if (options.headers) {
//       const existingHeaders = options.headers as Record<string, string>;
//       Object.keys(existingHeaders).forEach((key) => {
//         headers[key] = existingHeaders[key];
//       });
//     }

//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }

//     try {
//       const response = await fetch(`${this.baseUrl}${url}`, {
//         ...options,
//         headers,
//       });

//       if (response.status === 401) {
//         await this.logout();
//         if (typeof window !== "undefined") {
//           window.location.href = "/entrar";
//         }
//         throw new Error("Sessão expirada. Faça login novamente.");
//       }

//       if (!response.ok) {
//         const error = await response.json().catch(() => ({}));
//         throw {
//           message: error.message || "Erro na requisição",
//           statusCode: response.status,
//           errors: error.errors,
//         } as ApiError;
//       }

//       if (response.status === 204) {
//         return {} as T;
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Fetch auth error:", error);
//       throw error;
//     }
//   }

//   async get<T = any>(url: string): Promise<T> {
//     return this.fetchAuth<T>(url, { method: "GET" });
//   }

//   async post<T = any>(url: string, body: any): Promise<T> {
//     return this.fetchAuth<T>(url, {
//       method: "POST",
//       body: JSON.stringify(body),
//     });
//   }

//   async put<T = any>(url: string, body: any): Promise<T> {
//     return this.fetchAuth<T>(url, {
//       method: "PUT",
//       body: JSON.stringify(body),
//     });
//   }

//   async patch<T = any>(url: string, body: any): Promise<T> {
//     return this.fetchAuth<T>(url, {
//       method: "PATCH",
//       body: JSON.stringify(body),
//     });
//   }

//   async delete<T = any>(url: string): Promise<T> {
//     return this.fetchAuth<T>(url, { method: "DELETE" });
//   }

//   async upload<T = any>(
//     url: string,
//     file: File,
//     fieldName: string = "file",
//   ): Promise<T> {
//     const token = this.getToken();
//     const formData = new FormData();
//     formData.append(fieldName, file);

//     const headers: Record<string, string> = {};
//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }

//     const response = await fetch(`${this.baseUrl}${url}`, {
//       method: "POST",
//       headers,
//       body: formData,
//     });

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({}));
//       throw {
//         message: error.message || "Erro no upload",
//         statusCode: response.status,
//       } as ApiError;
//     }

//     return response.json();
//   }
// }

// // Exporta uma instância única
// export const apiAuth = ApiAuth.getInstance();

// // Exporta funções utilitárias
// export const login = (email: string, password: string, RememberMe?: boolean) =>
//   apiAuth.login({ email, password, RememberMe });
// export const register = (
//   fullName: string,
//   email: string,
//   password: string,
//   phone?: string,
//   cpf?: string,
// ) => apiAuth.register({ fullName, email, password, phone, cpf });
// export const logout = () => apiAuth.logout();
// export const getToken = () => apiAuth.getToken();
// export const getUser = () => apiAuth.getUser();
// export const getUserFull = () => apiAuth.getUserFull();
// export const fetchCurrentUser = () => apiAuth.fetchCurrentUser();
// export const isAuthenticated = () => apiAuth.isAuthenticated();
// export const fetchAuth = apiAuth.fetchAuth.bind(apiAuth);
// export const get = apiAuth.get.bind(apiAuth);
// export const post = apiAuth.post.bind(apiAuth);
// export const put = apiAuth.put.bind(apiAuth);
// export const patch = apiAuth.patch.bind(apiAuth);
// export const del = apiAuth.delete.bind(apiAuth);
// export const upload = apiAuth.upload.bind(apiAuth);

export { authService as apiAuth } from "@/services/auth.service";
