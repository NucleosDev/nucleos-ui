// ========== LOGS ==========
export interface XpLog {
  id: string
  user_id?: string
  nucleo_id?: string
  xp_amount: number
  source: string
  created_at: string
}

export interface EnergyLog {
  id: string
  user_id?: string
  nucleo_id?: string
  energy_amount: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  titulo?: string
  mensagem?: string
  read: boolean
  created_at: string
}