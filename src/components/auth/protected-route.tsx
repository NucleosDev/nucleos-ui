"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/auth";
import { isPublicRoute, getLoginUrlWithCallback } from "@/constants/routes";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // Aguarda carregar para não tomar decisão precipitada
    if (isLoading) return;

    const isPublic = isPublicRoute(pathname);

    // Caso 1: Não autenticado tentando acessar rota protegida → redireciona para login
    if (!isAuthenticated && !isPublic) {
      router.push(getLoginUrlWithCallback(pathname));
    }

    // Caso 2: Autenticado tentando acessar página de login/registro → redireciona para dashboard
    if (
      isAuthenticated &&
      (pathname === "/entrar" || pathname === "/cadastro")
    ) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Garante render idêntico entre server e client na primeira passagem
  if (!hasMounted) return null;

  // Não mostra nada enquanto carrega - o GlobalLoader cuida disso
  if (isLoading) return null;

  // Não autenticado: não renderiza o conteúdo (o redirecionamento já foi disparado)
  if (!isAuthenticated) return null;

  // Autenticado: renderiza os filhos
  return <>{children}</>;
}
