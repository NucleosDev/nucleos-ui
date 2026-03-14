export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  level: number
  totalXp: number
  createdAt: string
  updatedAt: string
}

export interface Core {
  id: string
  userId: string
  name: string
  description?: string
  color: string
  icon: string
  level: number
  currentXp: number
  xpToNextLevel: number
  createdAt: string
  updatedAt: string
}

export interface Habit {
  id: string
  coreId: string
  name: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly'
  xpReward: number
  streak: number
  completedToday: boolean
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  coreId: string
  habitId?: string
  name: string
  description?: string
  xpEarned: number
  completedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
