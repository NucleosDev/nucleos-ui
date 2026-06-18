// Rotas de api (BACKEND)
// Baseadas nas definições reais dos routers Express + futuras implementações

export const API_ROUTES = {
  // AUTENTICAÇÃO

  AUTH: {
    LOGIN: "/Auth/login",
    REGISTER: "/Auth/register",
    LOGOUT: "/Auth/logout",
    ME: "/Auth/me",
    REFRESH_TOKEN: "/Auth/refresh-token",
  },

  // USUÁRIOS

  USERS: {
    ME: "/users/me",
    PROFILE: "/users/profile",
    PREFERENCES: "/users/preferences",
    STATS: "/users/stats",
    ACHIEVEMENTS: "/users/achievements",
    XP_LOGS: "/users/xp-logs",
    ENERGY_LOGS: "/users/energy-logs",
    ACTIVITY_LOGS: "/users/activity-logs",
    PLAN: "/users/plan",
    DELETE_ACCOUNT: "/users/account",
    REACTIVATE: "/users/reactivate",
    REENTRY_STATUS: "/users/reentry-status",
    REENTRY_PROCESS: "/users/reentry-process",
  },

  // NucleoS

  NUCLEOS: {
    LIST: "/nucleos",
    GET: (id: string) => `/nucleos/${id}`,
    CREATE: "/nucleos",
    UPDATE: (id: string) => `/nucleos/${id}`,
    DELETE: (id: string) => `/nucleos/${id}`,

    // Rotas adicionais planejadas (implementar no futuro)
    STATS: (id: string) => `/nucleos/${id}/stats`,
    ICONES: "/nucleos/icons",
    XP: (id: string) => `/nucleos/${id}/xp`,
    ACHIEVEMENTS: (id: string) => `/nucleos/${id}/achievements`,
    ENERGY: (id: string) => `/nucleos/${id}/energy`,
    SHARE: (id: string) => `/nucleos/${id}/share`,
    RELACOES: (id: string) => `/nucleos/${id}/relacoes`,
    RELACOES_CREATE: "/nucleos/relacoes",
    RELACOES_DELETE: (id: string) => `/nucleos/relacoes/${id}`,
  },

  // BLOCOS

  BLOCOS: {
    PING: "/blocos/ping",
    LIST: (nucleoId: string) => `/blocos/nucleo/${nucleoId}`,
    GET: (id: string) => `/blocos/${id}`,
    CREATE: "/blocos",
    UPDATE: (id: string) => `/blocos/${id}`,
    DELETE: (id: string) => `/blocos/${id}`,
    REORDER: "/blocos/reorder",

    PARENT: (parentId: string) => `/blocos/parent/${parentId}`,
    ANCESTORS: (id: string) => `/blocos/${id}/ancestors`,
    MOVE: (id: string) => `/blocos/${id}/move`,

    PATCH_CONTENT: (id: string) => `/blocos/${id}/content`,

    CANVAS: {
      GET: (nucleoId: string) => `/blocos/canvas/${nucleoId}`,
      SAVE: (nucleoId: string) => `/blocos/canvas/${nucleoId}`,
    },
  },

  // COLEÇÕES (com campos e itens aninhados)

  COLECOES: {
    // Coleção
    LIST_BY_BLOCO: (blocoId: string) => `/colecoes/bloco/${blocoId}`,
    LIST: (blocoId: string) => `/colecoes/bloco/${blocoId}`,
    GET: (id: string) => `/colecoes/${id}`,
    CREATE: "/colecoes",
    UPDATE: (id: string) => `/colecoes/${id}`,
    DELETE: (id: string) => `/colecoes/${id}`,

    // Campos (aninhados sob /colecoes)
    CAMPOS: {
      LIST: (colecaoId: string) => `/colecoes/${colecaoId}/campos`,
      CREATE: "/colecoes/campos",
      UPDATE: (id: string) => `/colecoes/campos/${id}`,
      DELETE: (id: string) => `/colecoes/campos/${id}`,
    },

    // Itens (aninhados sob /colecoes)
    ITENS: {
      LIST: (colecaoId: string) => `/colecoes/${colecaoId}/items`,
      CREATE: "/colecoes/items",
      UPDATE: (id: string) => `/colecoes/items/${id}`,
      DELETE: (id: string) => `/colecoes/items/${id}`,
    },
  },

  // CAMPOS (standalone, para compatibilidade com código antigo)

  CAMPOS: {
    BY_COLECAO: (colecaoId: string) => `/colecoes/${colecaoId}/campos`,
    CREATE: "/colecoes/campos",
    UPDATE: (id: string) => `/colecoes/campos/${id}`,
    DELETE: (id: string) => `/colecoes/campos/${id}`,
  },

  // ITENS (standalone, para compatibilidade)

  ITENS: {
    BY_COLECAO: (colecaoId: string) => `/colecoes/${colecaoId}/items`,
    CREATE: "/colecoes/items",
    UPDATE: (id: string) => `/colecoes/items/${id}`,
    DELETE: (id: string) => `/colecoes/items/${id}`,
  },

  // ITEM_VALORES (planejado)

  ITEM_VALORES: {
    BY_ITEM: (itemId: string) => `/item-valores/item/${itemId}`,
    CREATE: (itemId: string, campoId: string) =>
      `/item-valores/item/${itemId}/campo/${campoId}`,
    UPDATE: (id: string) => `/item-valores/${id}`,
    DELETE: (id: string) => `/item-valores/${id}`,
  },

  // TAREFAS

  TAREFAS: {
    BASE: "/tarefas",
    BY_ID: (id: string) => `/tarefas/${id}`,
    CONCLUDE: (id: string) => `/tarefas/${id}/concluir`,
    BY_BLOCO: (blocoId: string) => `/tarefas/bloco/${blocoId}`,
    VENCENDO: "/tarefas/vencendo",
  },

  // LISTAS

  LISTAS: {
    // Lista
    LIST: (blocoId: string) => `/listas/bloco/${blocoId}`,
    BY_ID: (id: string) => `/listas/${id}`,
    CREATE: "/listas",
    UPDATE: (id: string) => `/listas/${id}`,
    DELETE: (id: string) => `/listas/${id}`,

    // Itens
    ITENS: {
      LIST: (listaId: string) => `/listas/${listaId}/items`,
      CREATE: "/listas/items",
      UPDATE: (id: string) => `/listas/items/${id}`,
      TOGGLE: (id: string) => `/listas/items/${id}/toggle`,
      DELETE: (id: string) => `/listas/items/${id}`,
    },

    // Categorias
    CATEGORIAS: {
      LIST: (listaId: string) => `/listas/${listaId}/categorias`,
      CREATE: "/listas/categorias",
      DELETE: (id: string) => `/listas/categorias/${id}`,
    },
  },

  // HÁBITOS

  HABITOS: {
    BASE: "/habitos",
    BY_ID: (id: string) => `/habitos/${id}`,
    BY_BLOCO: (blocoId: string) => `/habitos/bloco/${blocoId}`,
    REGISTER: (id: string) => `/habitos/${id}/registrar`,
    PROGRESS: (id: string) => `/habitos/${id}/progresso`,
  },

  // EXERCÍCIOS

  EXERCICIOS: {
    BASE: "/exercicios",
    BY_ID: (id: string) => `/exercicios/${id}`,
    BY_BLOCO: (blocoId: string) => `/exercicios/bloco/${blocoId}`,
    ADD_EXERCICIO: (templateId: string) => `/exercicios/${templateId}/exercicios`,
    REMOVE_EXERCICIO: (exercicioId: string) => `/exercicios/exercicios/${exercicioId}`,
  },

  // GAMIFICAÇÃO

  GAMIFICACAO: {
    STATS: "/gamificacao/stats",
    LEADERBOARD: "/gamificacao/leaderboard",
    ACHIEVEMENTS: "/gamificacao/achievements",
    CONQUISTAS: "/gamificacao/achievements",
    HISTORY: "/gamificacao/history",
    STREAK: "/gamificacao/streak",
    STREAKS: "/gamificacao/streak",
    LEVEL: "/gamificacao/level",
    ADD_XP: "/gamificacao/xp",
    PROCESS_ACTION: "/gamificacao/process-action",
  },

  // PROGRESS (XP e Energia)

  PROGRESS: {
    XP: "/progress/xp",
    ENERGY: "/progress/energy",
  },

  // PLANOS

  PLANS: {
    LIST: "/plans",
    SUBSCRIPTION: "/plans/subscription",
    CURRENT: "/plans/subscription/current",
    SUBSCRIBE: (planId: string) => `/plans/${planId}/subscribe`,
    CANCEL: "/plans/subscription/cancel",
  },

  // TIMERS

  TIMERS: {
    LIST: (nucleoId: string) => `/timers/nucleo/${nucleoId}`,
    START: "/timers/start",
    STOP: (id: string) => `/timers/${id}/stop`,
    PAUSE: (id: string) => `/timers/${id}/pause`,
    RESUME: (id: string) => `/timers/${id}/resume`,
    UPDATE: (id: string) => `/timers/${id}`,
  },

  // CALENDÁRIO

  CALENDARIO: {
    LIST: (nucleoId: string) => `/calendario/nucleo/${nucleoId}`,
    GET: (id: string) => `/calendario/${id}`,
    CREATE: "/calendario",
    UPDATE: (id: string) => `/calendario/${id}`,
    DELETE: (id: string) => `/calendario/${id}`,
  },

  // NOTIFICAÇÕES

  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // INSIGHTS / IA

  INSIGHTS: {
    BASE: "/insights",
    GET_BY_ID: (id: string) => `/insights/${id}`,
    GENERATE: "/insights/gerar",
    APPLY: (id: string) => `/insights/${id}/aplicar`,
    CHAT: "/insights/chat",
  },

  // ADMIN

  ADMIN: {
    STATS: "/admin/stats",
    USERS: "/admin/users",
    USER: (id: string) => `/admin/users/${id}`,
    NUCLEOS: "/admin/nucleos",
  },

  // IA / CHATBOT

  AI: {
    INTERACT: "/ai/interact",
    CONTEXT: "/ai/context",
    INSIGHTS: "/ai/insights",
    INSIGHT_APPLY: (id: string) => `/ai/insights/${id}/apply`,
  },
} as const;

// ROTAS DE NAVEGAÇÃO (FRONTEND)

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

  // Nucleos
  NUCLEOS: "/nucleos",
  NUCLEO_DETAIL: (id: string) => `/dashboard/nucleos/${id}`,
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

// LISTAS DE ROTAS PARA VALIDAÇÃO

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

export const PROTECTED_ROUTES: readonly string[] = [
  ROUTES.DASHBOARD,
  ROUTES.DASHBOARD_PROFILE,
  ROUTES.DASHBOARD_SETTINGS,
  ROUTES.DASHBOARD_NOTIFICATIONS,
  ROUTES.NUCLEOS,
];

export const PUBLIC_DYNAMIC_ROUTES: readonly string[] = [
  "/ajuda/artigo/",
  "/ajuda/categoria/",
  "/blog/",
  "/estudos/demo",
  "/saude/demo",
];

export const PROTECTED_DYNAMIC_ROUTES: readonly string[] = [
  "/nucleos/",
  "/dashboard/",
  "/blocos/",
  "/tarefas/",
  "/habitos/",
];

// FUNÇÕES AUXILIARES

export const isPublicRoute = (pathname: string): boolean => {
  if (PUBLIC_ROUTES.includes(pathname as any)) return true;
  return PUBLIC_DYNAMIC_ROUTES.some((route) => pathname.startsWith(route));
};

export const isProtectedRoute = (pathname: string): boolean => {
  if (PROTECTED_ROUTES.includes(pathname as any)) return true;
  return PROTECTED_DYNAMIC_ROUTES.some((route) => pathname.startsWith(route));
};

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

export const isAuthRoute = (pathname: string): boolean => {
  const authRoutes = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
  ];
  return authRoutes.includes(pathname as any);
};

export const getLoginUrlWithCallback = (callbackUrl: string): string => {
  const encodedCallback = encodeURIComponent(callbackUrl);
  return `${ROUTES.LOGIN}?callbackUrl=${encodedCallback}`;
};

// FUNÇÕES DE NAVEGAÇÃO

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

// TIPOS

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
export type AuthRoute =
  | typeof ROUTES.LOGIN
  | typeof ROUTES.REGISTER
  | typeof ROUTES.FORGOT_PASSWORD
  | typeof ROUTES.RESET_PASSWORD;
