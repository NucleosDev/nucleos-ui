export interface Evento {
  id: string;
  nucleo_id: string;
  titulo?: string;
  descricao?: string;
  data_evento?: string;
  duracao_minutos?: number;
  created_at: string;
  updated_at: string;
}


export interface CalendarioEvento {
  id: string
  nucleoId: string
  titulo: string
  descricao?: string
  dataEvento: string | Date
  duracaoMinutos: number
  createdAt: string
  updatedAt?: string
  // snake_case aliases for API compatibility
  nucleo_id?: string
  data_evento?: string
  duracao_minutos?: number
  created_at?: string
}

export interface Timer {
  id: string
  nucleoId: string
  titulo?: string
  inicio?: string
  fim?: string
  duracaoSegundos?: number
  createdAt: string
  // snake_case aliases
  nucleo_id?: string
  duracao_segundos?: number
  created_at?: string
}

