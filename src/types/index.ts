// ==========================// TIPOS BASE
// ==========================
export interface User {
  id: string;
  email: string;
  phone: string;
  cpf: string;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  nickname?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLevel {
  id: string;
  userId: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  totalXpEarned: number;
  updatedAt: string;
}

// ==========================// NUCLEOS
// ==========================
export interface NucleoIcon {
  id: string;
  name?: string;
  iconUrl: string;
  createdAt: string;
}

// export interface Nucleo {
//   id: string;
//   userId: string;
//   iconId?: string;
//   nome: string;
//   descricao?: string;
//   tipo: string;
//   corDestaque?: string;
//   imagemCapa?: string;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt?: string;
//   // Relações
//   icon?: NucleoIcon;
// }

export interface NucleoStats {
  totalBlocos: number;
  totalTarefas: number;
  tarefasConcluidas: number;
  totalHabitos: number;
  habitosHoje: number;
  totalListas: number;
  xpTotal: number;
  level: number;
  nextLevelXp: number;
  currentXp: number;
  conquistas: number;
  xpHoje: number;
}

export interface NucleoComStats extends Nucleo {
  stats?: NucleoStats;
  xpTotal: number;
  level: number;
  nextLevelXp: number;
  currentXp: number;
  conquistas: number;
  xpHoje: number;
}

export interface CreateNucleoPayload {
  nome: string;
  descricao?: string;
  tipo?: string;
  corDestaque?: string;
  imagemCapa?: string;
  iconId?: string;
}

export interface Nucleo {
  id: string;
  userId: string;
  iconId?: string;
  nome: string;
  descricao?: string;
  tipo: "pessoal" | "profissional" | "projeto" | "estudo" | "hobby";
  corDestaque?: string;
  imagemCapa?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  icon?: NucleoIcon;
  blocos?: Bloco[];
  achievements?: NucleoAchievement[];
  relations?: NucleoRelation[];
  user?: User;
}

export type NucleoTipo =
  | "pessoal"
  | "profissional"
  | "estudo"
  | "projeto"
  | "hobby"
  | "fitness"
  | "financas"
  | "idiomas"
  | string;

export interface NucleoRelation {
  id: string;
  sourceNucleoId: string;
  targetNucleoId: string;
  relationType?: string;
  createdAt: string;
  source?: Nucleo;
  target?: Nucleo;
}

export interface NucleoAchievement {
  id: string;
  nucleoId: string;
  achievementType: string;
  currentValue: number;
  targetValue?: number;
  unlockedAt?: string;
  createdAt: string;
}

// Para criação/atualização
export interface CreateNucleoPayload {
  nome: string;
  descricao?: string;
  tipo?: NucleoTipo;
  corDestaque?: string;
  imagemCapa?: string;
  iconId?: string;
}

export interface UpdateNucleoPayload extends Partial<CreateNucleoPayload> {}

// ==========================// BLOCOS
// ==========================
export type TipoBloco =
  | "tarefas"
  | "habitos"
  | "notas"
  | "lista"
  | "calendario"
  | "calculo"
  | "colecoes";

export interface BlocoConfiguracoes {
  conteudo?: string;
  [key: string]: unknown;
}

export interface Bloco {
  id: string;
  nucleoId: string;
  tipo: TipoBloco;
  titulo?: string;
  posicao: number;
  configuracoes: BlocoConfiguracoes;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateBlocoPayload {
  nucleoId: string;
  tipo: TipoBloco;
  titulo?: string;
  posicao?: number;
  configuracoes?: Record<string, any>;
}

export interface UpdateBlocoPayload {
  titulo?: string;
  posicao?: number;
  configuracoes?: Record<string, any>;
}

export interface ReorderBlocosPayload {
  nucleoId: string;
  orders: Array<{ id: string; posicao: number }>;
}

// ==========================// TAREFAS
// ==========================
export type PrioridadeTarefa = "baixa" | "media" | "alta";
export type StatusTarefa = "pendente" | "concluida" | "atrasada";

export interface Tarefa {
  id: string;
  blocoId: string;
  titulo: string;
  descricao?: string;
  prioridade: PrioridadeTarefa;
  status: StatusTarefa;
  dataVencimento?: string;
  concluidaEm?: string;
  posicao: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateTarefaPayload {
  blocoId: string;
  titulo: string;
  descricao?: string;
  prioridade?: PrioridadeTarefa;
  dataVencimento?: string;
}

export interface UpdateTarefaPayload {
  titulo?: string;
  descricao?: string;
  prioridade?: PrioridadeTarefa;
  dataVencimento?: string;
  status?: StatusTarefa;
  posicao?: number;
}

// ==========================// HÁBITOS
// ==========================
export type FrequenciaHabito = "diaria" | "semanal" | "personalizada";

export interface Habito {
  id: string;
  blocoId: string;
  nome: string;
  frequencia: FrequenciaHabito;
  diasSemana?: number[];
  metaVezes: number;
  createdAt: string;
  updatedAt: string;
}

export interface HabitoRegistro {
  id: string;
  habitoId: string;
  data: string;
  vezesCompletadas: number;
  createdAt: string;
}

export interface HabitoComProgresso extends Habito {
  registrosHoje: number;
  completoHoje: boolean;
  streak: number;
}

export interface CreateHabitoPayload {
  blocoId: string;
  nome: string;
  frequencia?: FrequenciaHabito;
  diasSemana?: number[];
  metaVezes?: number;
}

export interface UpdateHabitoPayload {
  nome?: string;
  frequencia?: FrequenciaHabito;
  diasSemana?: number[];
  metaVezes?: number;
}

// ==========================// LISTAS
// ==========================
export type TipoLista = "generica" | "compras" | "financeiro";

export interface Lista {
  id: string;
  blocoId: string;
  nome: string;
  tipoLista: TipoLista;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Categoria {
  id: string;
  listaId: string;
  nome: string;
  cor?: string;
  createdAt: string;
}

export interface ItemLista {
  id: string;
  listaId: string;
  categoriaId?: string;
  nome: string;
  quantidade: number;
  valorUnitario?: number;
  valorTotal?: number;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Relação
  categoria?: Categoria;
}

export interface ListaComItens extends Lista {
  itens: ItemLista[];
  categorias: Categoria[];
  totalItens: number;
  itensChecados: number;
  valorTotal?: number;
}

export interface CreateListaPayload {
  blocoId: string;
  nome: string;
  tipoLista?: TipoLista;
}

export interface CreateItemListaPayload {
  listaId: string;
  categoriaId?: string;
  nome: string;
  quantidade?: number;
  valorUnitario?: number;
}

export interface CreateCategoriaPayload {
  listaId: string;
  nome: string;
  cor?: string;
}

// ==========================// COLEÇÕES
// ==========================
export type TipoCampo =
  | "texto"
  | "numero"
  | "data"
  | "booleano"
  | "select"
  | "url"
  | "email";

export interface Colecao {
  id: string;
  blocoId: string;
  nome: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campo {
  id: string;
  colecaoId: string;
  nome: string;
  tipoCampo: TipoCampo;
  createdAt: string;
  updatedAt: string;
}

export interface ItemColecao {
  id: string;
  colecaoId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemValor {
  id: string;
  itemId: string;
  campoId: string;
  valorTexto?: string;
  valorNumerico?: number;
  valorData?: string;
  valorBooleano?: boolean;
}

export interface ItemColecaoComValores extends ItemColecao {
  valores: ItemValor[];
}

export interface ColecaoCompleta extends Colecao {
  campos: Campo[];
  itens: ItemColecaoComValores[];
}

export interface CreateColecaoPayload {
  blocoId: string;
  nome: string;
}

export interface CreateCampoPayload {
  colecaoId: string;
  nome: string;
  tipoCampo: TipoCampo;
}

export interface CreateItemColecaoPayload {
  colecaoId: string;
}

export interface CreateItemValorPayload {
  itemId: string;
  campoId: string;
  valorTexto?: string;
  valorNumerico?: number;
  valorData?: string;
  valorBooleano?: boolean;
}

// ==========================// CALENDÁRIO
// ==========================
export interface CalendarioEvento {
  id: string;
  nucleoId: string;
  titulo: string;
  descricao?: string;
  dataEvento: string;
  duracaoMinutos?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCalendarioEventoPayload {
  nucleoId: string;
  titulo: string;
  descricao?: string;
  dataEvento: string;
  duracaoMinutos?: number;
}

export interface UpdateCalendarioEventoPayload {
  titulo?: string;
  descricao?: string;
  dataEvento?: string;
  duracaoMinutos?: number;
}

// ==========================// TIMERS
// ==========================
export interface Timer {
  id: string;
  nucleoId: string;
  titulo?: string;
  inicio?: string;
  fim?: string;
  duracaoSegundos?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimerPayload {
  nucleoId: string;
  titulo?: string;
  duracaoSegundos?: number;
}

export interface StartTimerPayload {
  timerId: string;
}

// ==========================// GAMIFICAÇÃO
// ==========================
export interface Conquista {
  id: string;
  nome: string;
  descricao?: string;
  iconeUrl?: string;
  tipo?: string;
  condicao?: Record<string, unknown>;
  xpRecompensa: number;
  createdAt: string;
}

export interface UserConquista {
  id: string;
  userId: string;
  conquistaId: string;
  desbloqueadoEm: string;
  conquista?: Conquista;
}

export interface ConquistaComProgresso extends Conquista {
  desbloqueada: boolean;
  desbloqueadaEm?: string;
  progresso?: number;
  progressoMax?: number;
}

export interface Streak {
  id: string;
  userId: string;
  nucleoId?: string;
  streakType: string;
  currentStreak: number;
  maxStreak: number;
  lastActivityDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface XpLog {
  id: string;
  userId: string;
  nucleoId?: string;
  xpAmount: number;
  source: string;
  createdAt: string;
}

// ==========================// NOTIFICAÇÕES
// ==========================
export type TipoNotificacao =
  | "info"
  | "sucesso"
  | "alerta"
  | "conquista"
  | "lembrete";

export interface Notificacao {
  id: string;
  userId: string;
  titulo: string;
  mensagem?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificacaoUI {
  id: string;
  titulo: string;
  mensagem?: string;
  tipo?: TipoNotificacao;
  icone?: React.ReactNode;
  tempo: string;
  lida?: boolean;
  acao?: {
    label: string;
    onClick: () => void;
  };
}

// ==========================// API RESPONSES
// ==========================
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// export const timersService = {
//   async getTimers(nucleoId: string): Promise<Timer[]> {
//     const response = await api.get(API_ROUTES.TIMERS.BY_NUCLEO(nucleoId));
//     return response.data;
//   },

//   async startTimer(data: CriarTimerDTO): Promise<Timer> {
//     const response = await api.post(API_ROUTES.TIMERS.START, {
//       nucleoId: data.nucleoId,
//       titulo: data.titulo || "Sessão de foco",
//     });
//     return response.data;
//   },

//   async stopTimer(
//     id: string,
//   ): Promise<{ duracaoSegundos: number; xpGanho: number }> {
//     const response = await api.post(API_ROUTES.TIMERS.STOP(id));
//     return response.data;
//   },
// };
