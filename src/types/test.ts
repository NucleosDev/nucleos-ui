// =============================================================================
// Núcleos – Types centralizados
// Espelho dos DTOs retornados pela API ASP.NET
// =============================================================================

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export interface User {
  id: string
  nome: string
  email: string
  avatarUrl?: string | null
  createdAt: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}

export interface LoginPayload {
  email: string
  senha: string
}

export interface RegisterPayload {
  nome: string
  email: string
  senha: string
}

// ---------------------------------------------------------------------------
// Núcleos
// ---------------------------------------------------------------------------
export type NucleoColor = "health" | "study" | "finance" | "default"

export interface Nucleo {
  id: string
  nome: string
  descricao?: string | null
  icone?: string | null
  cor?: NucleoColor | null
  progresso: number          // 0-100
  totalBlocos: number
  ultimaAtividade?: string | null
  createdAt: string
}

export interface CreateNucleoPayload {
  nome: string
  descricao?: string
  icone?: string
  cor?: NucleoColor
}

export interface UpdateNucleoPayload extends Partial<CreateNucleoPayload> {}

export interface UpdateUserPayload {
  nome?: string
  email?: string
  senhaAtual?: string
  novaSenha?: string
  avatarUrl?: string
}

// ---------------------------------------------------------------------------
// Blocos
// ---------------------------------------------------------------------------
export type BlocoTipo = "tarefas" | "habitos" | "notas" | "lista" | "calendario" | "calculo"

export interface Bloco {
  id: string
  nucleoId: string
  nome: string
  tipo: BlocoTipo
  ordem: number
  descricao?: string | null
  createdAt: string
}

export interface CreateBlocoPayload {
  nucleoId: string
  nome: string
  tipo: BlocoTipo
  descricao?: string
}

export interface UpdateBlocoPayload extends Partial<Omit<CreateBlocoPayload, "nucleoId">> {}

// ---------------------------------------------------------------------------
// Tarefas
// ---------------------------------------------------------------------------
export type TarefaStatus = "pendente" | "em_andamento" | "concluida"
export type TarefaPrioridade = "baixa" | "media" | "alta"

export interface Tarefa {
  id: string
  blocoId: string
  titulo: string
  descricao?: string | null
  status: TarefaStatus
  prioridade: TarefaPrioridade
  dataVencimento?: string | null
  concluidaEm?: string | null
  createdAt: string
}

export interface CreateTarefaPayload {
  blocoId: string
  titulo: string
  descricao?: string
  prioridade?: TarefaPrioridade
  dataVencimento?: string
}

export interface UpdateTarefaPayload extends Partial<Omit<CreateTarefaPayload, "blocoId">> {
  status?: TarefaStatus
}

// ---------------------------------------------------------------------------
// Hábitos
// ---------------------------------------------------------------------------
export interface Habito {
  id: string
  blocoId: string
  nome: string
  descricao?: string | null
  frequencia: "diario" | "semanal" | "mensal"
  streakAtual: number
  streakMaximo: number
  completoHoje: boolean
  createdAt: string
}

export interface CreateHabitoPayload {
  blocoId: string
  nome: string
  descricao?: string
  frequencia?: Habito["frequencia"]
}

// ---------------------------------------------------------------------------
// Gamificação
// ---------------------------------------------------------------------------
export interface UserLevel {
  nivel: number
  xpAtual: number
  xpProximoNivel: number
  titulo: string
}

export interface Streak {
  tipo: string
  atual: number
  maximo: number
  ativo: boolean
}

export interface Conquista {
  id: string
  nome: string
  descricao: string
  icone: string
  categoria: "habito" | "tarefa" | "nucleo" | "especial"
  desbloqueada: boolean
  desbloquedaEm?: string | null
  raridade: "comum" | "raro" | "epico" | "lendario"
}

// ---------------------------------------------------------------------------
// Admin / Stats
// ---------------------------------------------------------------------------
export interface DashboardStats {
  totalUsuarios: number
  totalNucleos: number
  totalTarefasConcluidas: number
  totalHabitosAtivos: number
  // stats do usuário logado
  nucleosAtivos: number
  tarefasConcluidasHoje: number
  minutosConcentradosHoje: number
  progressoGeral: number
}

// ---------------------------------------------------------------------------
// Listas
// ---------------------------------------------------------------------------
export interface ItemLista {
  id: string
  blocoId: string
  texto: string
  concluido: boolean
  ordem: number
}

export interface CreateItemListaPayload {
  blocoId: string
  texto: string
}

// ---------------------------------------------------------------------------
// Calendário
// ---------------------------------------------------------------------------
export interface Evento {
  id: string
  blocoId: string
  titulo: string
  descricao?: string | null
  inicio: string
  fim: string
  corHex?: string | null
}
