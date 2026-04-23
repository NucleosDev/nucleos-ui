"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import type { User } from "@/types/user";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth";
import { GoogleLogin } from "@react-oauth/google";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>; // GOOGLE LOGIN
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "user";
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isAuthenticated = !!user;

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  // 🔄 REFRESH USER
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      clearAuth();
    }
  }, [clearAuth]);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  // LOGIN
  const login = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    const response = await authService.login(credentials);

    localStorage.setItem(TOKEN_KEY, response.token);
    await refreshUser();

    return response;
  };

  // REGISTER
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authService.register(data);

    localStorage.setItem(TOKEN_KEY, response.token);
    await refreshUser();

    return response;
  };

  // GOOGLE LOGIN
  const loginWithGoogle = useCallback(
    async (token: string) => {
      const response = await authService.loginWithGoogle(token);

      localStorage.setItem(TOKEN_KEY, response.token);
      await refreshUser(); // usa seu fluxo padrão 🔥
    },
    [refreshUser],
  );

  // LOGOUT
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
        loginWithGoogle, // GOOGLE LOGIN
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

/// esse codigo aqui é pra login-page, perae que to reformulando o design aqui, importa o que precisa nesse auth-context sem alterar o arquivo todo pq ta certin aq ✔
// "use client";

// import Link from "next/link";
// import { LoginForm } from "@/components/auth/login-form";
// import { ROUTES } from "@/constants/routes";
// import Image from "next/image";
// import { GoogleLogin } from "@react-oauth/google";
// import { useAuth } from "@/types/auth"; // tem um index lá cria, que já export o provider e o context, deixa só assim, e não estamos mais usando o index.ts //. pode pegar la no type/qual for o t

// export default function LoginPage() {
//   const { loginWithGoogle } = useAuth();

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-foreground/2">
//       {/* Background effects */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/15 blur-3xl" />
//         <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/15 blur-3xl" />
//       </div>

//       {/* Logo */}
//       <Link
//         href={ROUTES.HOME}
//         className="mb-8 flex items-center gap-2 transition-transform hover:scale-105"
//       >
//         <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
//           <Image
//             src="/icon.svg"
//             alt="Nucleos"
//             width={64}
//             height={64}
//             className="text-primary"
//           />
//         </div>
//         <span className="text-xl font-semibold text-foreground">Nucleos</span>
//       </Link>

//       {/* Login Form */}
//       <LoginForm />

//       {/* 🔥 BOTÃO GOOGLE */}
//       <div className="mt-4 flex justify-center">
//         <GoogleLogin
//           onSuccess={(res) => {
//             if (res.credential) {
//               loginWithGoogle(res.credential);
//             }
//           }}
//           onError={() => console.log("Erro no login com Google")}
//         />
//       </div>

//       {/* Esqueceu a senha */}
//       <div className="mt-4 text-center">
//         <Link
//           href={ROUTES.FORGOT_PASSWORD}
//           className="text-sm text-muted-foreground hover:text-primary transition-colors"
//         >
//           Esqueceu sua senha?
//         </Link>
//       </div>

//       {/* Terms */}
//       <p className="mt-8 text-center text-xs text-muted-foreground">
//         Ao continuar, você concorda com nossos{" "}
//         <Link href="/termos" className="underline hover:text-foreground">
//           Termos de Serviço
//         </Link>{" "}
//         e{" "}
//         <Link href="/privacidade" className="underline hover:text-foreground">
//           Política de Privacidade
//         </Link>
//         .
//       </p>

//       {/* Cadastro */}
//       <p className="mt-4 text-center text-sm text-muted-foreground">
//         Não tem uma conta?{" "}
//         <Link
//           href={ROUTES.REGISTER}
//           className="text-primary hover:underline font-medium"
//         >
//           Cadastre-se gratuitamente
//         </Link>
//       </p>
//     </div>
//   );
// }
