import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  "/",
  "/entrar",
  "/cadastro",
  "/forgot-password",
  "/reset-password",
  "/pricing",
  "/about",
  "/contact",
];

// Rotas de autenticação (acesso apenas para não autenticados)
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Rotas protegidas (precisam de autenticação)
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/nucleos",
  "/blocos",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Tentar obter token de várias fontes
  const token =
    request.cookies.get("auth_token")?.value || // Cookie (HTTP-only é mais seguro)
    request.cookies.get("access_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", ""); // Header

  const isAuthenticated = !!token;

  // Verificar se é uma rota pública
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Verificar se é uma rota de autenticação (login/register)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Verificar se é uma rota protegida
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Caso 1: Usuário autenticado tentando acessar página de login/register
  if (isAuthenticated && isAuthRoute) {
    // Redireciona para dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Caso 2: Usuário não autenticado tentando acessar rota protegida
  if (!isAuthenticated && isProtectedRoute) {
    // Guarda a URL que tentou acessar para redirecionar depois do login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Caso 3: Rotas públicas ou já autenticado em rota permitida
  return NextResponse.next();
}

// Configuração do matcher para performance
export const config = {
  matcher: [
    /*
     * Corresponde a todas as rotas exceto:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico
     * - public (arquivos públicos como imagens, fonts, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
