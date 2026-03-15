
export interface AiInteraction {
  id: string
  user_id: string
  mensagem: string
  resposta: string
  contexto?: Record<string, any>
  created_at: string
}

export interface AiContext {
  id: string
  user_id: string
  last_summary?: string
  preferred_style?: string
  last_interaction?: string
  updated_at: string
}

export interface AiInsight {
  id: string
  user_id?: string
  nucleo_id?: string
  insight_type: string
  mensagem: string
  priority: number
  applied: boolean
  created_at: string
}