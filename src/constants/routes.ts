// src/constants/routes.ts

// ============================================
// ROTAS DA API (BACKEND)
// ============================================

export const API_ROUTES = {
  // ========== AUTENTICAÇÃO ==========
  AUTH: {
    LOGIN: "/v1/auth/login",
    REGISTER: "/v1/auth/register",
    LOGOUT: "/v1/auth/logout",
    ME: "/v1/auth/me",
    REFRESH_TOKEN: "/v1/auth/refresh-token",
    CHANGE_PASSWORD: "/v1/auth/change-password",
    FORGOT_PASSWORD: "/v1/auth/forgot-password",
    RESET_PASSWORD: "/v1/auth/reset-password",
    VERIFY_EMAIL: "/v1/auth/verify-email",
  },

  // ========== Nucleos ==========
  NUCLEOS: {
    LIST: "/v1/nucleos",
    GET: (id: string) => `/v1/nucleos/${id}`,
    CREATE: "/v1/nucleos",
    UPDATE: (id: string) => `/v1/nucleos/${id}`,
    DELETE: (id: string) => `/v1/nucleos/${id}`,
    SHARE: (id: string) => `/v1/nucleos/${id}/share`,
    STATS: (id: string) => `/v1/nucleos/${id}/stats`,
    ICONES: "/v1/nucleos/icons",
    RELACOES: (id: string) => `/v1/nucleos/${id}/relacoes`,
    RELACOES_CREATE: "/v1/nucleos/relacoes",
    RELACOES_DELETE: (id: string) => `/v1/nucleos/relacoes/${id}`,
    ACHIEVEMENTS: (id: string) => `/v1/nucleos/${id}/achievements`,
    XP: (id: string) => `/v1/nucleos/${id}/xp`,
    ENERGY: (id: string) => `/v1/nucleos/${id}/energy`,
  },

  // ========== BLOCOS ==========
  BLOCOS: {
    LIST: (nucleoId: string) => `/v1/blocos/nucleo/${nucleoId}`,
    GET: (id: string) => `/v1/blocos/${id}`,
    CREATE: (nucleoId: string) => `/v1/blocos/nucleo/${nucleoId}`,
    UPDATE: (id: string) => `/v1/blocos/${id}`,
    DELETE: (id: string) => `/v1/blocos/${id}`,
    REORDER: (nucleoId: string) => `/v1/blocos/nucleo/${nucleoId}/reorder`,
  },

  // ========== COLEÇÕES ==========
  COLECOES: {
    LIST: (blocoId: string) => `/v1/colecoes/bloco/${blocoId}`,
    GET: (id: string) => `/v1/colecoes/${id}`,
    CREATE: (blocoId: string) => `/v1/colecoes/bloco/${blocoId}`,
    UPDATE: (id: string) => `/v1/colecoes/${id}`,
    DELETE: (id: string) => `/v1/colecoes/${id}`,
  },

  // ========== CAMPOS ==========
  CAMPOS: {
    LIST: (colecaoId: string) => `/v1/campos/colecao/${colecaoId}`,
    CREATE: (colecaoId: string) => `/v1/campos/colecao/${colecaoId}`,
    GET: (id: string) => `/v1/campos/${id}`,
    UPDATE: (id: string) => `/v1/campos/${id}`,
    DELETE: (id: string) => `/v1/campos/${id}`,
  },

  // ========== ITENS ==========
  ITENS: {
    LIST: (colecaoId: string) => `/v1/itens/colecao/${colecaoId}`,
    CREATE: (colecaoId: string) => `/v1/itens/colecao/${colecaoId}`,
    GET: (id: string) => `/v1/itens/${id}`,
    UPDATE: (id: string) => `/v1/itens/${id}`,
    DELETE: (id: string) => `/v1/itens/${id}`,
  },

  // ========== ITEM VALORES ==========
  ITEM_VALORES: {
    LIST: (itemId: string) => `/v1/item-valores/item/${itemId}`,
    CREATE: (itemId: string, campoId: string) =>
      `/v1/item-valores/item/${itemId}/campo/${campoId}`,
    GET: (id: string) => `/v1/item-valores/${id}`,
    UPDATE: (id: string) => `/v1/item-valores/${id}`,
    DELETE: (id: string) => `/v1/item-valores/${id}`,
  },

  // ========== TAREFAS ==========
  TAREFAS: {
    BASE: "/v1/tarefas",
    BY_ID: (id: string) => `/v1/tarefas/${id}`,
    CONCLUDE: (id: string) => `/v1/tarefas/${id}/conclude`,
    BY_BLOCO: (blocoId: string) => `/v1/tarefas/bloco/${blocoId}`,
    VENCENDO: "/v1/tarefas/vencendo",
  },

  // ========== LISTAS ==========
  LISTAS: {
    BASE: "/v1/listas",
    BY_ID: (id: string) => `/v1/listas/${id}`,
    BY_BLOCO: (blocoId: string) => `/v1/listas/bloco/${blocoId}`,
    ITEMS: (listaId: string) => `/v1/listas/${listaId}/items`,
  },

  // ========== HÁBITOS ==========
  HABITOS: {
    BASE: "/v1/habitos",
    BY_ID: (id: string) => `/v1/habitos/${id}`,
    BY_BLOCO: (blocoId: string) => `/v1/habitos/bloco/${blocoId}`,
    REGISTER: (id: string) => `/v1/habitos/${id}/register`,
    PROGRESS: (id: string) => `/v1/habitos/${id}/progress`,
  },

  // ========== GAMIFICAÇÃO ==========
  GAMIFICACAO: {
    LEVEL: "/v1/gamificacao/level",
    CONQUISTAS: "/v1/gamificacao/conquistas",
    STREAKS: "/v1/gamificacao/streaks",
    ADD_XP: "/v1/gamificacao/add-xp",
  },

  // ========== PROGRESS ==========
  PROGRESS: {
    XP: "/v1/progress/xp",
    ENERGY: "/v1/progress/energy",
  },

  // ========== USUÁRIOS ==========
  USERS: {
    ME: "/v1/users/me",
    PROFILE: "/v1/users/profile",
    AVATAR: "/v1/users/avatar",
    LEVEL: "/v1/users/level",
    LEVEL_BY_ID: (id: string) => `/v1/users/${id}/level`,
    XP_LOGS: "/v1/users/xp-logs",
    ENERGY_LOGS: "/v1/users/energy-logs",
    NOTIFICATIONS: "/v1/users/notifications",
    AI_CONTEXT: "/v1/users/ai-context",
    AI_INSIGHTS: "/v1/users/ai-insights",
  },

  // ========== NOTIFICAÇÕES ==========
  NOTIFICATIONS: {
    LIST: "/v1/notifications",
    MARK_READ: (id: string) => `/v1/notifications/${id}/read`,
    MARK_ALL_READ: "/v1/notifications/read-all",
    DELETE: (id: string) => `/v1/notifications/${id}`,
  },

  // ========== PLANOS ==========
  PLANS: {
    LIST: "/v1/plans",
    CURRENT: "/v1/plans/current",
    SUBSCRIBE: (planId: string) => `/v1/plans/${planId}/subscribe`,
    CANCEL: "/v1/plans/cancel",
  },

  // ========== TIMERS ==========
  TIMERS: {
    LIST: (nucleoId: string) => `/v1/timers/nucleo/${nucleoId}`,
    GET: (id: string) => `/v1/timers/${id}`,
    CREATE: (nucleoId: string) => `/v1/timers/nucleo/${nucleoId}`,
    UPDATE: (id: string) => `/v1/timers/${id}`,
    DELETE: (id: string) => `/v1/timers/${id}`,
    START: (id: string) => `/v1/timers/${id}/start`,
    PAUSE: (id: string) => `/v1/timers/${id}/pause`,
    RESUME: (id: string) => `/v1/timers/${id}/resume`,
    STOP: (id: string) => `/v1/timers/${id}/stop`,
  },

  // ========== CALENDÁRIO ==========
  CALENDARIO: {
    LIST: (nucleoId: string) => `/v1/calendario/nucleo/${nucleoId}`,
    GET: (id: string) => `/v1/calendario/${id}`,
    CREATE: (nucleoId: string) => `/v1/calendario/nucleo/${nucleoId}`,
    UPDATE: (id: string) => `/v1/calendario/${id}`,
    DELETE: (id: string) => `/v1/calendario/${id}`,
  },

  // ========== IA/INSIGHTS ==========
  INSIGHTS: {
    BASE: "/v1/insights",
    GENERATE: "/v1/insights/generate",
    APPLY: (id: string) => `/v1/insights/${id}/apply`,
    CHAT: "/v1/insights/chat",
  },

  // ========== ADMIN ==========
  ADMIN: {
    USERS: "/v1/admin/users",
    DASHBOARD: "/v1/admin/dashboard",
    PLANS: "/v1/admin/plans",
    SUBSCRIPTIONS: "/v1/admin/subscriptions",
  },
} as const;

// ============================================
// ROTAS DE NAVEGAÇÃO (FRONTEND)
// ============================================
export const ROUTES = {
  HOME: "/",
  SOBRE: "/sobre",
  COMO_FUNCIONA: "/como-funciona",
  PLANOS: "/planos",
  RECURSOS: "/recursos",
  CONTATO: "/contato",
  BLOG: "/blog",
  AJUDA: "/ajuda",
  DUVIDAS: "/duvidas",
  TERMOS: "/termos",
  PRIVACIDADE: "/privacidade",
  COOKIES: "/cookies",
  CARREIRAS: "/carreiras",
  DEVS: "/devs",
  DOCS: "/docs",
  PRODUTO: "/produto",
  ESTUDOS: "/estudos",
  FINANCAS: "/financas",
  SAUDE: "/saude",
  EXPLORAR: "/explorar",
  PAINEL: "/painel",
  LOGIN: "/entrar",
  REGISTER: "/cadastro",
  FORGOT_PASSWORD: "/esqueci-senha",
  RESET_PASSWORD: "/resetar-senha",
  DASHBOARD: "/dashboard",
  DASHBOARD_PROFILE: "/dashboard/perfil",
  DASHBOARD_SETTINGS: "/dashboard/configuracoes",
  DASHBOARD_NOTIFICATIONS: "/dashboard/notificacoes",
  NUCLEOS: "/nucleos",
  NUCLEO_DETAIL: (id: string) => `/nucleos/${id}`,
  NUCLEO_EDIT: (id: string) => `/nucleos/${id}/editar`,
  NUCLEO_CREATE: "/nucleos/novo",
  BLOCOS: (nucleoId: string) => `/nucleos/${nucleoId}/blocos`,
  BLOCO_DETAIL: (nucleoId: string, blocoId: string) =>
    `/nucleos/${nucleoId}/blocos/${blocoId}`,
  TAREFAS: (blocoId: string) => `/blocos/${blocoId}/tarefas`,
  LISTAS: (blocoId: string) => `/blocos/${blocoId}/listas`,
  HABITOS: (blocoId: string) => `/blocos/${blocoId}/habitos`,
} as const;

// ============================================
// LISTAS DE ROTAS PARA VALIDAÇÃO
// ============================================

// Rotas públicas (acessíveis sem autenticação)
export const PUBLIC_ROUTES: readonly string[] = [
  ROUTES.HOME,
  ROUTES.SOBRE,
  ROUTES.COMO_FUNCIONA,
  ROUTES.PLANOS,
  ROUTES.RECURSOS,
  ROUTES.CONTATO,
  ROUTES.BLOG,
  ROUTES.AJUDA,
  ROUTES.DUVIDAS,
  ROUTES.TERMOS,
  ROUTES.PRIVACIDADE,
  ROUTES.COOKIES,
  ROUTES.CARREIRAS,
  ROUTES.DEVS,
  ROUTES.DOCS,
  ROUTES.PRODUTO,
  ROUTES.ESTUDOS,
  ROUTES.FINANCAS,
  ROUTES.SAUDE,
  ROUTES.EXPLORAR,
  ROUTES.PAINEL,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

// Rotas protegidas (requerem autenticação)
export const PROTECTED_ROUTES: readonly string[] = [
  ROUTES.DASHBOARD,
  ROUTES.DASHBOARD_PROFILE,
  ROUTES.DASHBOARD_SETTINGS,
  ROUTES.DASHBOARD_NOTIFICATIONS,
  ROUTES.NUCLEOS,
];

// Rotas dinâmicas públicas
const PUBLIC_DYNAMIC_ROUTES: readonly string[] = [
  "/ajuda/artigo/",
  "/ajuda/categoria/",
  "/blog/",
  "/estudos/demo",
  "/saude/demo",
];

// Rotas dinâmicas protegidas
const PROTECTED_DYNAMIC_ROUTES: readonly string[] = [
  "/nucleos/",
  "/dashboard/",
  "/blocos/",
  "/tarefas/",
  "/habitos/",
];

// ============================================
// FUNÇÕES DE VALIDAÇÃO (CORRIGIDAS)
// ============================================

/**
 * Verifica se uma rota é pública
 */
export const isPublicRoute = (pathname: string): boolean => {
  // Verificar rotas públicas exatas
  if (PUBLIC_ROUTES.includes(pathname as any)) return true;

  // Verificar rotas dinâmicas públicas
  return PUBLIC_DYNAMIC_ROUTES.some((route) => pathname.startsWith(route));
};

/**
 * Verifica se uma rota é protegida
 */
export const isProtectedRoute = (pathname: string): boolean => {
  // Verificar rotas protegidas exatas
  if (PROTECTED_ROUTES.includes(pathname as any)) return true;

  // Verificar rotas dinâmicas protegidas
  return PROTECTED_DYNAMIC_ROUTES.some((route) => pathname.startsWith(route));
};

/**
 * Verifica se uma rota é de administrador
 */
export const isAdminRoute = (pathname: string): boolean => {
  const adminRoutes = [
    "/admin",
    "/admin/usuarios",
    "/admin/planos",
    "/admin/assinaturas",
    "/admin/logs",
  ];
  return adminRoutes.some((route) => pathname.startsWith(route));
};

/**
 * Verifica se uma rota é de autenticação (login, registro, etc)
 */
export const isAuthRoute = (pathname: string): boolean => {
  const authRoutes = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
  ];
  return authRoutes.includes(pathname as any);
};

// ============================================
// FUNÇÕES DE REDIRECIONAMENTO
// ============================================

/**
 * Gera URL de login com callback para redirecionamento após autenticação
 */
// export const getLoginUrlWithCallback = (callbackUrl: string): string => {
//   const encodedCallback = encodeURIComponent(callbackUrl);
//   return `${ROUTES.LOGIN}?callbackUrl=${encodedCallback}`;
// };

/**
 * Extrai o callback URL dos parâmetros da query
 */
// export const getCallbackUrl = (searchParams: URLSearchParams): string => {
//   const callback = searchParams.get("callbackUrl");
//   if (
//     callback &&
//     (callback.startsWith("/") ||
//       callback.startsWith(process.env.NEXT_PUBLIC_APP_URL || ""))
//   ) {
//     return callback;
//   }
//   return ROUTES.DASHBOARD;
// };

// ============================================
// FUNÇÕES DE NAVEGAÇÃO
// ============================================

export const getNucleoUrl = (id: string): string => ROUTES.NUCLEO_DETAIL(id);
export const getNucleoEditUrl = (id: string): string => ROUTES.NUCLEO_EDIT(id);
export const getBlocosUrl = (nucleoId: string): string =>
  ROUTES.BLOCOS(nucleoId);
export const getBlocoUrl = (nucleoId: string, blocoId: string): string =>
  ROUTES.BLOCO_DETAIL(nucleoId, blocoId);
export const getTarefasUrl = (blocoId: string): string =>
  ROUTES.TAREFAS(blocoId);
export const getListasUrl = (blocoId: string): string => ROUTES.LISTAS(blocoId);
export const getHabitosUrl = (blocoId: string): string =>
  ROUTES.HABITOS(blocoId);
export const getAjudaArtigoUrl = (slug: string): string =>
  `/ajuda/artigo/${slug}`;
export const getAjudaCategoriaUrl = (slug: string): string =>
  `/ajuda/categoria/${slug}`;
export const getBlogPostUrl = (slug: string): string => `/blog/${slug}`;

// ============================================
// TIPOS
// ============================================

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
export type AdminRoute = typeof API_ROUTES extends readonly (infer U)[]
  ? U
  : never;

export type AuthRoute =
  | typeof ROUTES.LOGIN
  | typeof ROUTES.REGISTER
  | typeof ROUTES.FORGOT_PASSWORD
  | typeof ROUTES.RESET_PASSWORD;

export type Route = PublicRoute | ProtectedRoute | AdminRoute | AuthRoute;
