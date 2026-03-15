// tipos para os núcleos, incluindo informações básicas, ícones, blocos, conquistas e relações
import { Bloco } from './bloco'
import { User } from './user'

export interface Nucleo {
  id: string
  user_id: string
  icon_id?: string
  nome: string
  descricao?: string
  tipo: 'pessoal' | 'profissional' | 'projeto' | 'estudo' | 'hobby'
  cor_destaque?: string
  imagem_capa?: string
  created_at: string
  updated_at: string
  icon?: NucleoIcon
  blocos?: Bloco[]
  achievements?: NucleoAchievement[]
  relations?: NucleoRelation[]
  user?: User
}

export interface NucleoIcon {
  id: string
  name?: string
  icon_url?: string
  created_at: string
}

export interface NucleoRelation {
  id: string
  source_nucleo_id: string
  target_nucleo_id: string
  relation_type?: string
  created_at: string
  source?: Nucleo
  target?: Nucleo
}

export interface NucleoAchievement {
  id: string
  nucleo_id: string
  achievement_type: string
  current_value: number
  target_value?: number
  unlocked_at?: string
  created_at: string
}