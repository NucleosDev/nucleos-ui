import env from "@/config/env";
// NEXT_PUBLIC_API_URL precisa ser inserido antes do caminho?
// ============================================================================
// ROTAS DA API (BACKEND)
// ============================================================================

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/Auth/login",
    REGISTER: "/Auth/register",
    LOGOUT: "/Auth/logout",
    ME: "/Auth/me",
    REFRESH_TOKEN: "/Auth/refresh-token",
  },

  // Núcleos
  NUCLEOS: {
    LIST: "/nucleos",
    GET: (id: string) => `/nucleos/${id}`,
    CREATE: "/nucleos",
    UPDATE: (id: string) => `/nucleos/${id}`,
    DELETE: (id: string) => `/nucleos/${id}`,
    SHARE: (id: string) => `/nucleos/${id}/share`,
    STATS: (id: string) => `/nucleos/${id}/stats`,
    ICONES: "/nucleos/icons",
    RELACOES: (id: string) => `/nucleos/${id}/relacoes`,
    RELACOES_CREATE: "/nucleos/relacoes",
    RELACOES_DELETE: (id: string) => `/nucleos/relacoes/${id}`,
    ACHIEVEMENTS: (id: string) => `/nucleos/${id}/achievements`,
    XP: (id: string) => `/nucleos/${id}/xp`,
    ENERGY: (id: string) => `/nucleos/${id}/energy`,
  },

  // Blocos
  BLOCOS: {
    LIST: (nucleoId: string) => `/blocos/nucleo/${nucleoId}`,
    GET: (id: string) => `/blocos/${id}`,
    CREATE: "/blocos",
    UPDATE: (id: string) => `/blocos/${id}`,
    DELETE: (id: string) => `/blocos/${id}`,
    REORDER: "/blocos/reorder",
  },

  // Coleções
  COLECOES: {
    LIST: (blocoId: string) => `/colecoes/bloco/${blocoId}`,
    GET: (id: string) => `/colecoes/${id}`,
    CREATE: (blocoId: string) => `/colecoes/bloco/${blocoId}`,
    UPDATE: (id: string) => `/colecoes/${id}`,
    DELETE: (id: string) => `/colecoes/${id}`,
  },

  // Campos
  CAMPOS: {
    LIST: (colecaoId: string) => `/campos/colecao/${colecaoId}`,
    CREATE: (colecaoId: string) => `/campos/colecao/${colecaoId}`,
    GET: (id: string) => `/campos/${id}`,
    UPDATE: (id: string) => `/campos/${id}`,
    DELETE: (id: string) => `/campos/${id}`,
  },

  // Itens
  ITENS: {
    LIST: (colecaoId: string) => `/itens/colecao/${colecaoId}`,
    CREATE: (colecaoId: string) => `/itens/colecao/${colecaoId}`,
    GET: (id: string) => `/itens/${id}`,
    UPDATE: (id: string) => `/itens/${id}`,
    DELETE: (id: string) => `/itens/${id}`,
  },

  // Item Valores
  ITEM_VALORES: {
    LIST: (itemId: string) => `/item-valores/item/${itemId}`,
    CREATE: (itemId: string, campoId: string) =>
      `/item-valores/item/${itemId}/campo/${campoId}`,
    GET: (id: string) => `/item-valores/${id}`,
    UPDATE: (id: string) => `/item-valores/${id}`,
    DELETE: (id: string) => `/item-valores/${id}`,
  },

  // Tarefas
  TAREFAS: {
    BASE: "/tarefas",
    BY_ID: (id: string) => `/tarefas/${id}`,
    CONCLUDE: (id: string) => `/tarefas/${id}/concluir`,
    BY_BLOCO: (blocoId: string) => `/tarefas/bloco/${blocoId}`,
    VENCENDO: "/tarefas/vencendo",
  },

  // Listas
  LISTAS: {
    BASE: "/listas",
    BY_ID: (id: string) => `/listas/${id}`,
    BY_BLOCO: (blocoId: string) => `/listas/bloco/${blocoId}`,
    ITEMS: (listaId: string) => `/listas/${listaId}/items`,
    CATEGORIAS: (listaId: string) => `/listas/${listaId}/categorias`,
  },

  // Hábitos
  HABITOS: {
    BASE: "/habitos",
    BY_ID: (id: string) => `/habitos/${id}`,
    BY_BLOCO: (blocoId: string) => `/habitos/bloco/${blocoId}`,
    REGISTER: (id: string) => `/habitos/${id}/registrar`,
    PROGRESS: (id: string) => `/habitos/${id}/progresso`,
  },

  // Gamificação
  GAMIFICACAO: {
    LEVEL: "/gamificacao/level",
    CONQUISTAS: "/gamificacao/conquistas",
    STREAKS: "/gamificacao/streaks",
    ADD_XP: "/gamificacao/add-xp",
    ATUALIZAR_STREAK: "/gamificacao/atualizar-streak",
    DESBLOQUEAR_CONQUISTA: "/gamificacao/desbloquear-conquista",
  },

  // Progress
  PROGRESS: {
    XP: "/progress/xp",
    ENERGY: "/progress/energy",
  },

  // Usuários
  USERS: {
    ME: "/users/me",
    PROFILE: "/users/profile",
    AVATAR: "/users/avatar",
    LEVEL: "/users/level",
    LEVEL_BY_ID: (id: string) => `/users/${id}/level`,
    XP_LOGS: "/users/xp-logs",
    ENERGY_LOGS: "/users/energy-logs",
    NOTIFICATIONS: "/users/notifications",
    AI_CONTEXT: "/users/ai-context",
    AI_INSIGHTS: "/users/ai-insights",
  },

  // Notificações
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // Planos
  PLANS: {
    CREATE: "/plans",
    SUBSCRIPTION: "/plans/subscription",
  },

  // Timers
  TIMERS: {
    LIST: (nucleoId: string) => `/timers/nucleo/${nucleoId}`,
    GET: (id: string) => `/timers/${id}`,
    START: "/timers/start",
    PAUSE: (id: string) => `/timers/${id}/pause`,
    RESUME: (id: string) => `/timers/${id}/resume`,
    STOP: (id: string) => `/timers/${id}/stop`,
  },

  // Calendário
  CALENDARIO: {
    LIST: (nucleoId: string) => `/calendario/nucleo/${nucleoId}`,
    GET: (id: string) => `/calendario/${id}`,
    CREATE: "/calendario",
    UPDATE: (id: string) => `/calendario/${id}`,
    DELETE: (id: string) => `/calendario/${id}`,
  },

  // IA/Insights
  INSIGHTS: {
    BASE: "/insights",
    GET_BY_ID: (id: string) => `/insights/${id}`,
    GENERATE: "/insights/gerar",
    APPLY: (id: string) => `/insights/${id}/aplicar`,
    CHAT: "/insights/chat",
  },

  // Admin
  ADMIN: {
    STATS: "/admin/stats",
    USERS: "/admin/users",
  },
} as const;

// ============================================================================
// ROTAS DE NAVEGAÇÃO (FRONTEND)
// ============================================================================

export const ROUTES = {
  // Públicas
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

  // Autenticação
  LOGIN: "/entrar",
  REGISTER: "/cadastro",
  FORGOT_PASSWORD: "/esqueci-senha",
  RESET_PASSWORD: "/resetar-senha",

  // Dashboard (protegidas)
  DASHBOARD: "/dashboard",
  DASHBOARD_PROFILE: "/dashboard/perfil",
  DASHBOARD_SETTINGS: "/dashboard/configuracoes",
  DASHBOARD_NOTIFICATIONS: "/dashboard/notificacoes",

  // Núcleos
  NUCLEOS: "/nucleos",
  NUCLEO_DETAIL: (id: string) => `/nucleos/${id}`,
  NUCLEO_EDIT: (id: string) => `/nucleos/${id}/editar`,
  NUCLEO_CREATE: "/nucleos/novo",

  // Blocos
  BLOCOS: (nucleoId: string) => `/nucleos/${nucleoId}/blocos`,
  BLOCO_DETAIL: (nucleoId: string, blocoId: string) =>
    `/nucleos/${nucleoId}/blocos/${blocoId}`,

  // Itens
  TAREFAS: (blocoId: string) => `/blocos/${blocoId}/tarefas`,
  LISTAS: (blocoId: string) => `/blocos/${blocoId}/listas`,
  HABITOS: (blocoId: string) => `/blocos/${blocoId}/habitos`,
} as const;

// ============================================================================
// LISTAS DE ROTAS PARA VALIDAÇÃO
// ============================================================================

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
export const PUBLIC_DYNAMIC_ROUTES: readonly string[] = [
  "/ajuda/artigo/",
  "/ajuda/categoria/",
  "/blog/",
  "/estudos/demo",
  "/saude/demo",
];

// Rotas dinâmicas protegidas
export const PROTECTED_DYNAMIC_ROUTES: readonly string[] = [
  "/nucleos/",
  "/dashboard/",
  "/blocos/",
  "/tarefas/",
  "/habitos/",
];

// ============================================================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================================================

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

// ============================================================================
// FUNÇÃO DE REDIRECIONAMENTO (apenas uma, para uso no ProtectedRoute)
// ============================================================================

/**
 * Gera URL de login com callback para redirecionamento após autenticação
 */
export const getLoginUrlWithCallback = (callbackUrl: string): string => {
  const encodedCallback = encodeURIComponent(callbackUrl);
  return `${ROUTES.LOGIN}?callbackUrl=${encodedCallback}`;
};

// ============================================================================
// FUNÇÕES DE NAVEGAÇÃO
// ============================================================================

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

// ============================================================================
// TIPOS
// ============================================================================

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
export type AuthRoute =
  | typeof ROUTES.LOGIN
  | typeof ROUTES.REGISTER
  | typeof ROUTES.FORGOT_PASSWORD
  | typeof ROUTES.RESET_PASSWORD;
