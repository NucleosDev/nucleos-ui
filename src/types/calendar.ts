
export interface CalendarioEvento {
  id: string
  nucleo_id: string
  titulo?: string
  descricao?: string
  data_evento?: string
  duracao_minutos?: number
  created_at: string
  updated_at: string
}

export interface Timer {
  id: string
  nucleo_id: string
  titulo?: string
  inicio?: string
  fim?: string
  duracao_segundos?: number
  created_at: string
}