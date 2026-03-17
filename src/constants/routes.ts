export const API_ROUTES = {
  // ========== AUTENTICAÇÃO ==========
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // ========== USUÁRIOS ==========
  USERS: {
    ME: "/users/me",
    PROFILE: "/users/me/profile",
    AVATAR: "/users/me/avatar",
    LEVEL: "/users/me/level",
    NOTIFICATIONS: "/users/me/notifications",
    XP_LOGS: "/users/me/xp-logs",
    ENERGY_LOGS: "/users/me/energy-logs",
    AI_CONTEXT: "/users/me/ai-context",
    AI_INTERACTIONS: "/users/me/ai-interactions",
    AI_INSIGHTS: "/users/me/ai-insights",
  },

  // ========== NucleoS ==========
  NUCLEOS: {
    LIST: "/nucleos",
    CREATE: "/nucleos",
    GET: (id: string) => `/nucleos/${id}`,
    UPDATE: (id: string) => `/nucleos/${id}`,
    DELETE: (id: string) => `/nucleos/${id}`,
    ICONS: "/nucleos/icons",
    RELATIONS: (id: string) => `/nucleos/${id}/relations`,
    ACHIEVEMENTS: (id: string) => `/nucleos/${id}/achievements`,
    XP: (id: string) => `/nucleos/${id}/xp`,
    ENERGY: (id: string) => `/nucleos/${id}/energy`,
  },

  // ========== ÍCONES ==========
  ICONES: {
    LIST: "/icones",
    GET: (id: string) => `/icones/${id}`,
    CREATE: "/icones",
    UPDATE: (id: string) => `/icones/${id}`,
    DELETE: (id: string) => `/icones/${id}`,
  },

  // ========== BLOCOS ==========
  BLOCOS: {
    LIST: (nucleoId: string) => `/nucleos/${nucleoId}/blocos`,
    CREATE: (nucleoId: string) => `/nucleos/${nucleoId}/blocos`,
    GET: (id: string) => `/blocos/${id}`,
    UPDATE: (id: string) => `/blocos/${id}`,
    DELETE: (id: string) => `/blocos/${id}`,
    REORDER: (nucleoId: string) => `/nucleos/${nucleoId}/blocos/reorder`,
  },

  // ========== COLEÇÕES ==========
  COLECOES: {
    LIST: (blocoId: string) => `/blocos/${blocoId}/colecoes`,
    CREATE: (blocoId: string) => `/blocos/${blocoId}/colecoes`,
    GET: (id: string) => `/colecoes/${id}`,
    UPDATE: (id: string) => `/colecoes/${id}`,
    DELETE: (id: string) => `/colecoes/${id}`,
  },

  // ========== CAMPOS ==========
  CAMPOS: {
    LIST: (colecaoId: string) => `/colecoes/${colecaoId}/campos`,
    CREATE: (colecaoId: string) => `/colecoes/${colecaoId}/campos`,
    GET: (id: string) => `/campos/${id}`,
    UPDATE: (id: string) => `/campos/${id}`,
    DELETE: (id: string) => `/campos/${id}`,
  },

  // ========== ITENS ==========
  ITENS: {
    LIST: (colecaoId: string) => `/colecoes/${colecaoId}/itens`,
    CREATE: (colecaoId: string) => `/colecoes/${colecaoId}/itens`,
    GET: (id: string) => `/itens/${id}`,
    UPDATE: (id: string) => `/itens/${id}`,
    DELETE: (id: string) => `/itens/${id}`,
  },

  // ========== VALORES DOS ITENS ==========
  ITEM_VALORES: {
    LIST: (itemId: string) => `/itens/${itemId}/valores`,
    CREATE: (itemId: string, campoId: string) =>
      `/itens/${itemId}/campos/${campoId}/valores`,
    UPDATE: (id: string) => `/valores/${id}`,
    DELETE: (id: string) => `/valores/${id}`,
  },

  // ========== RELAÇÕES ENTRE NucleoS ==========
  RELACOES: {
    LIST: (nucleoId: string) => `/nucleos/${nucleoId}/relacoes`,
    CREATE: "/relacoes",
    DELETE: (id: string) => `/relacoes/${id}`,
  },

  // ========== CALENDÁRIO ==========
  CALENDARIO: {
    LIST: (nucleoId: string) => `/nucleos/${nucleoId}/eventos`,
    CREATE: (nucleoId: string) => `/nucleos/${nucleoId}/eventos`,
    GET: (id: string) => `/eventos/${id}`,
    UPDATE: (id: string) => `/eventos/${id}`,
    DELETE: (id: string) => `/eventos/${id}`,
  },

  // ========== TIMERS ==========
  TIMERS: {
    LIST: (nucleoId: string) => `/nucleos/${nucleoId}/timers`,
    CREATE: (nucleoId: string) => `/nucleos/${nucleoId}/timers`,
    GET: (id: string) => `/timers/${id}`,
    UPDATE: (id: string) => `/timers/${id}`,
    DELETE: (id: string) => `/timers/${id}`,
    STOP: (id: string) => `/timers/${id}/stop`,
    START: (id: string) => `/timers/${id}/start`,
    PAUSE: (id: string) => `/timers/${id}/pause`,
    RESUME: (id: string) => `/timers/${id}/resume`,
  },

  // ========== LOGS ==========
  LOGS: {
    XP: "/logs/xp",
    ENERGY: "/logs/energy",
    ACTIVITY: "/logs/activity",
  },

  // ========== CONQUISTAS ==========
  ACHIEVEMENTS: {
    LIST: "/achievements",
    NUCLEO: (nucleoId: string) => `/nucleos/${nucleoId}/achievements`,
    UNLOCK: (id: string) => `/achievements/${id}/unlock`,
  },

  // ========== IA ==========
  AI: {
    INTERACT: "/ai/interact",
    CONTEXT: "/ai/context",
    INSIGHTS: "/ai/insights",
    INSIGHT_APPLY: (id: string) => `/ai/insights/${id}/apply`,
  },

  // ========== NOTIFICAÇÕES ==========
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // ========== PLANOS E ASSINATURAS ==========
  PLANS: {
    LIST: "/plans",
    CURRENT: "/subscriptions/current",
    SUBSCRIBE: (planId: string) => `/plans/${planId}/subscribe`,
    CANCEL: "/subscriptions/cancel",
  },

  // ========== ADMIN (se tiver) ==========
  ADMIN: {
    USERS: "/admin/users",
    USER: (id: string) => `/admin/users/${id}`,
    NUCLEOS: "/admin/nucleos",
    STATS: "/admin/stats",
  },
} as const;

// ========== ROTAS DO FRONT-END ==========
export const ROUTES = {
  // Públicas
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  // Privadas
  DASHBOARD: "/dashboard",
  NUCLEOS: "/nucleos",
  NUCLEO: (id: string) => `/nucleos/${id}`,
  NUCLEO_EDIT: (id: string) => `/nucleos/${id}/edit`,
  NUCLEO_BLOCOS: (id: string) => `/nucleos/${id}/blocos`,

  // Perfil
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  SETTINGS: "/settings",

  // Notificações
  NOTIFICATIONS: "/notifications",

  // Calendário
  CALENDAR: "/calendar",

  // Timers
  TIMERS: "/timers",

  // IA
  AI_ASSISTANT: "/ai/assistant",
  AI_INSIGHTS: "/ai/insights",

  // Admin
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_NUCLEOS: "/admin/nucleos",
} as const;
