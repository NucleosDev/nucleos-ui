// tipos para os blocos, coleções, campos e itens, incluindo suas relações e configurações
export interface Bloco {
  id: string
  nucleo_id: string
  tipo: string
  titulo?: string
  posicao: number
  configuracoes: Record<string, any>
  created_at: string
  updated_at: string
  colecoes?: Colecao[]
}

export interface Colecao {
  id: string
  bloco_id: string
  nome?: string
  created_at: string
  updated_at: string
  campos?: Campo[]
  itens?: Item[]
}

export interface Campo {
  id: string
  colecao_id: string
  nome?: string
  tipo_campo: 'texto' | 'numero' | 'data' | 'booleano' | 'arquivo' | 'select' | 'relacao'
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  colecao_id: string
  created_at: string
  updated_at: string
  valores?: ItemValor[]
}

export interface ItemValor {
  id: string
  item_id: string
  campo_id: string
  valor_texto?: string
  valor_numerico?: number
  valor_data?: string
  valor_booleano?: boolean
  campo?: Campo
}