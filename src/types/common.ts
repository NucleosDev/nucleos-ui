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

export interface DateRange {
  startDate?: Date | string
  endDate?: Date | string
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface StatusResponse {
  success: boolean
  message?: string
}
