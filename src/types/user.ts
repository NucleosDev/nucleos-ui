// tipos pro usuario e perfil, incluindo níveis, XP, segurança e assinatura
import { Plan } from './plan'

export interface User {
  id: string
  email: string
  email_verified: boolean
  profile: UserProfile
  roles: UserRole[]
  security?: UserSecurity
  level?: UserLevel
  subscription?: Subscription
  created_at: string
  active: boolean
}

export interface UserProfile {
  full_name: string
  nickname?: string
  avatar_url?: string
  phone?: string
  cpf?: string
}

export interface UserRole {
  role: 'user' | 'admin' | 'moderator'
}

export interface UserSecurity {
  last_login?: string
  failed_attempts: number
  password_updated_at: string
}

export interface UserLevel {
  level: number
  current_xp: number
  next_level_xp: number
  total_xp_earned: number
  updated_at: string
}

export interface Subscription {
  plan: Plan
  started_at: string
  expires_at?: string
}

