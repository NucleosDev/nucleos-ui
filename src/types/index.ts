// ========== RE-EXPORTS ==========
export * from './auth'
export * from './user'
export * from './plan'
export * from './nucleo'
export * from './bloco'
export * from './calendar'
export * from './logs'
export * from './ai'
export * from './common'
export * from './tarefas'



// ========== TIPOS COMPARTILHADOS ==========
export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}