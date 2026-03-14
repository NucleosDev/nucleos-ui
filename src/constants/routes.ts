export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CORES: '/cores',
  HABITS: '/habits',
  ACTIVITIES: '/activities',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    ME: '/users/me',
    UPDATE: '/users/me',
  },
  CORES: {
    LIST: '/cores',
    CREATE: '/cores',
    GET: (id: string) => `/cores/${id}`,
    UPDATE: (id: string) => `/cores/${id}`,
    DELETE: (id: string) => `/cores/${id}`,
  },
  HABITS: {
    LIST: '/habits',
    CREATE: '/habits',
    GET: (id: string) => `/habits/${id}`,
    UPDATE: (id: string) => `/habits/${id}`,
    DELETE: (id: string) => `/habits/${id}`,
  },
  ACTIVITIES: {
    LIST: '/activities',
    CREATE: '/activities',
    GET: (id: string) => `/activities/${id}`,
  },
} as const
