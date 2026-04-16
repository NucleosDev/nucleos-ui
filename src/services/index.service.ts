import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  Nucleo,
  NucleoComStats,
  NucleoStats,
  NucleoIcon,
  CreateNucleoPayload,
  UpdateNucleoPayload,
} from "@/types/index";
import type {
  Lista,
  ListaComItens,
  ItemLista,
  Categoria,
  CreateListaPayload,
  CreateItemListaPayload,
  CreateCategoriaPayload,
} from "@/types";
import type {
  Colecao,
  ColecaoCompleta,
  Campo,
  ItemColecao,
  ItemColecaoComValores,
  ItemValor,
  CreateColecaoPayload,
  CreateCampoPayload,
  CreateItemColecaoPayload,
  CreateItemValorPayload,
} from "@/types";
import type {
  Habito,
  HabitoComProgresso,
  HabitoRegistro,
  CreateHabitoPayload,
  UpdateHabitoPayload,
} from "@/types";
import type { Bloco, CreateBlocoPayload, UpdateBlocoPayload } from "@/types";
import type { Notificacao } from "@/types";
import type { Tarefa, CreateTarefaPayload, UpdateTarefaPayload } from "@/types";
import type { UserLevel, ConquistaComProgresso, Streak } from "@/types";
import type { User } from "@/types/user";

// ============================================================================
// NÚCLEOS
// ============================================================================
export const nucleosService = {
  async listar(): Promise<NucleoComStats[]> {
    return api.get<NucleoComStats[]>(API_ROUTES.NUCLEOS.LIST);
  },

  async buscarPorId(id: string): Promise<NucleoComStats> {
    return api.get<NucleoComStats>(API_ROUTES.NUCLEOS.GET(id));
  },

  async criar(payload: CreateNucleoPayload): Promise<Nucleo> {
    return api.post<Nucleo>(API_ROUTES.NUCLEOS.CREATE, payload);
  },

  async atualizar(id: string, payload: UpdateNucleoPayload): Promise<Nucleo> {
    return api.put<Nucleo>(API_ROUTES.NUCLEOS.UPDATE(id), payload);
  },

  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.NUCLEOS.DELETE(id));
  },

  // Rotas ainda não implementadas – mantenha comentadas até existirem no back-end
  // async buscarStats(id: string): Promise<NucleoStats> { ... }
  // async listarIcones(): Promise<NucleoIcon[]> { ... }
  // async buscarXp(id: string): Promise<{ xpTotal: number; xpHoje: number }> { ... }
  // async buscarConquistas(id: string): Promise<{ conquistas: number }> { ... }
};

// ============================================================================
// BLOCOS
// ============================================================================
export const blocosService = {
  async listarPorNucleo(nucleoId: string): Promise<Bloco[]> {
    return api.get<Bloco[]>(API_ROUTES.BLOCOS.LIST(nucleoId));
  },

  async buscarPorId(id: string): Promise<Bloco> {
    return api.get<Bloco>(API_ROUTES.BLOCOS.GET(id));
  },

  async criar(payload: CreateBlocoPayload): Promise<Bloco> {
    return api.post<Bloco>(API_ROUTES.BLOCOS.CREATE, payload);
  },

  async atualizar(id: string, payload: UpdateBlocoPayload): Promise<Bloco> {
    return api.put<Bloco>(API_ROUTES.BLOCOS.UPDATE(id), payload);
  },

  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.BLOCOS.DELETE(id));
  },

  async reordenar(blocos: { id: string; posicao: number }[]): Promise<void> {
    return api.post(API_ROUTES.BLOCOS.REORDER, { blocos });
  },
};

// ============================================================================
// TAREFAS
// ============================================================================
export const tarefasService = {
  async listarPorBloco(blocoId: string): Promise<Tarefa[]> {
    return api.get<Tarefa[]>(API_ROUTES.TAREFAS.BY_BLOCO(blocoId));
  },

  async buscarPorId(id: string): Promise<Tarefa> {
    return api.get<Tarefa>(API_ROUTES.TAREFAS.BY_ID(id));
  },

  async criar(payload: CreateTarefaPayload): Promise<Tarefa> {
    return api.post<Tarefa>(API_ROUTES.TAREFAS.BASE, payload);
  },

  async atualizar(id: string, payload: UpdateTarefaPayload): Promise<Tarefa> {
    return api.put<Tarefa>(API_ROUTES.TAREFAS.BY_ID(id), payload);
  },

  async concluir(id: string): Promise<Tarefa> {
    return api.post<Tarefa>(API_ROUTES.TAREFAS.CONCLUDE(id));
  },

  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.TAREFAS.BY_ID(id));
  },

  async listarVencendo(): Promise<Tarefa[]> {
    return api.get<Tarefa[]>(API_ROUTES.TAREFAS.VENCENDO);
  },
};

// ============================================================================
// LISTAS
// ============================================================================
export const listasService = {
  // Listas
  async listarPorBloco(blocoId: string): Promise<ListaComItens[]> {
    return api.get<ListaComItens[]>(API_ROUTES.LISTAS.LIST(blocoId));
  },

  // ATENÇÃO: A rota GET /listas/:id NÃO está implementada no back-end ainda.
  // async buscarPorId(id: string): Promise<ListaComItens> {
  //   return api.get<ListaComItens>(API_ROUTES.LISTAS.BY_ID(id));
  // },

  async criar(payload: CreateListaPayload): Promise<Lista> {
    return api.post<Lista>(API_ROUTES.LISTAS.CREATE, payload);
  },

  async atualizar(
    id: string,
    payload: Partial<CreateListaPayload>,
  ): Promise<Lista> {
    return api.put<Lista>(API_ROUTES.LISTAS.UPDATE(id), payload);
  },

  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.LISTAS.DELETE(id));
  },

  // Itens
  async listarItens(listaId: string): Promise<ItemLista[]> {
    return api.get<ItemLista[]>(API_ROUTES.LISTAS.ITENS.LIST(listaId));
  },

  async criarItem(payload: CreateItemListaPayload): Promise<ItemLista> {
    return api.post<ItemLista>(API_ROUTES.LISTAS.ITENS.CREATE, payload);
  },

  async atualizarItem(
    id: string,
    payload: Partial<CreateItemListaPayload>,
  ): Promise<ItemLista> {
    return api.put<ItemLista>(API_ROUTES.LISTAS.ITENS.UPDATE(id), payload);
  },

  async toggleItem(id: string): Promise<ItemLista> {
    return api.patch<ItemLista>(API_ROUTES.LISTAS.ITENS.TOGGLE(id));
  },

  async deletarItem(id: string): Promise<void> {
    return api.delete(API_ROUTES.LISTAS.ITENS.DELETE(id));
  },

  // Categorias
  async listarCategorias(listaId: string): Promise<Categoria[]> {
    return api.get<Categoria[]>(API_ROUTES.LISTAS.CATEGORIAS.LIST(listaId));
  },

  async criarCategoria(payload: CreateCategoriaPayload): Promise<Categoria> {
    return api.post<Categoria>(API_ROUTES.LISTAS.CATEGORIAS.CREATE, payload);
  },

  async deletarCategoria(id: string): Promise<void> {
    return api.delete(API_ROUTES.LISTAS.CATEGORIAS.DELETE(id));
  },
};

// ============================================================================
// HÁBITOS
// ============================================================================
export const habitosService = {
  async listarPorBloco(blocoId: string): Promise<HabitoComProgresso[]> {
    return api.get<HabitoComProgresso[]>(API_ROUTES.HABITOS.BY_BLOCO(blocoId));
  },

  async buscarPorId(id: string): Promise<Habito> {
    return api.get<Habito>(API_ROUTES.HABITOS.BY_ID(id));
  },

  async criar(payload: CreateHabitoPayload): Promise<Habito> {
    return api.post<Habito>(API_ROUTES.HABITOS.BASE, payload);
  },

  async atualizar(id: string, payload: UpdateHabitoPayload): Promise<Habito> {
    return api.put<Habito>(API_ROUTES.HABITOS.BY_ID(id), payload);
  },

  async registrar(id: string): Promise<HabitoRegistro> {
    return api.post<HabitoRegistro>(API_ROUTES.HABITOS.REGISTER(id));
  },

  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.HABITOS.BY_ID(id));
  },

  // ATENÇÃO: A rota de progresso ainda não foi implementada no back-end.
  // async buscarProgresso(id: string): Promise<{ completoHoje: boolean; streak: number }> {
  //   return api.get(API_ROUTES.HABITOS.PROGRESS(id));
  // },
};

// ============================================================================
// COLEÇÕES
// ============================================================================
export const colecoesService = {
  // Coleções
  async listarPorBloco(blocoId: string): Promise<Colecao[]> {
    return api.get<Colecao[]>(API_ROUTES.COLECOES.LIST(blocoId));
  },

  // ATENÇÃO: A rota GET /colecoes/:id não existe no back-end.
  // async buscarPorId(id: string): Promise<ColecaoCompleta> {
  //   return api.get<ColecaoCompleta>(API_ROUTES.COLECOES.GET(id));
  // },

  async criar(payload: CreateColecaoPayload): Promise<Colecao> {
    return api.post<Colecao>(API_ROUTES.COLECOES.CREATE, payload);
  },

  async atualizar(id: string, payload: { nome: string }): Promise<Colecao> {
    return api.put<Colecao>(API_ROUTES.COLECOES.UPDATE(id), payload);
  },

  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.COLECOES.DELETE(id));
  },

  // Campos (usando aliases CAMPOS para compatibilidade)
  async listarCampos(colecaoId: string): Promise<Campo[]> {
    return api.get<Campo[]>(API_ROUTES.CAMPOS.BY_COLECAO(colecaoId));
  },

  async criarCampo(payload: CreateCampoPayload): Promise<Campo> {
    return api.post<Campo>(API_ROUTES.CAMPOS.CREATE, payload);
  },

  async atualizarCampo(
    id: string,
    payload: Partial<CreateCampoPayload>,
  ): Promise<Campo> {
    return api.put<Campo>(API_ROUTES.CAMPOS.UPDATE(id), payload);
  },

  async deletarCampo(id: string): Promise<void> {
    return api.delete(API_ROUTES.CAMPOS.DELETE(id));
  },

  // Itens (usando aliases ITENS)
  async listarItens(colecaoId: string): Promise<ItemColecaoComValores[]> {
    return api.get<ItemColecaoComValores[]>(
      API_ROUTES.ITENS.BY_COLECAO(colecaoId),
    );
  },

  async criarItem(payload: CreateItemColecaoPayload): Promise<ItemColecao> {
    return api.post<ItemColecao>(API_ROUTES.ITENS.CREATE, payload);
  },

  async deletarItem(id: string): Promise<void> {
    return api.delete(API_ROUTES.ITENS.DELETE(id));
  },

  // Valores dos itens (rota planejada, ainda não implementada)
  // async listarValores(itemId: string): Promise<ItemValor[]> {
  //   return api.get<ItemValor[]>(API_ROUTES.ITEM_VALORES.BY_ITEM(itemId));
  // },
  // async salvarValor(...) { ... }
  // async deletarValor(...) { ... }
};

// ============================================================================
// NOTIFICAÇÕES (serviço mantido, mas rotas ainda não implementadas)
// ============================================================================
export const notificationsService = {
  async listar(): Promise<Notificacao[]> {
    return api.get<Notificacao[]>(API_ROUTES.NOTIFICATIONS.LIST);
  },

  async marcarComoLida(id: string): Promise<Notificacao> {
    return api.patch<Notificacao>(API_ROUTES.NOTIFICATIONS.MARK_READ(id));
  },

  async marcarTodasComoLidas(): Promise<void> {
    return api.post(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
  },

  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.NOTIFICATIONS.DELETE(id));
  },
};

// ============================================================================
// GAMIFICAÇÃO (serviço mantido, rotas ainda não implementadas)
// ============================================================================
export const gamificacaoService = {
  async getLevel(): Promise<UserLevel> {
    return api.get<UserLevel>(API_ROUTES.GAMIFICACAO.LEVEL);
  },
  async getConquistas(): Promise<ConquistaComProgresso[]> {
    return api.get<ConquistaComProgresso[]>(API_ROUTES.GAMIFICACAO.CONQUISTAS);
  },
  async getStreaks(): Promise<Streak> {
    return api.get<Streak>(API_ROUTES.GAMIFICACAO.STREAKS);
  },
  async addXp(quantidade: number, fonte: string): Promise<void> {
    return api.post(API_ROUTES.GAMIFICACAO.ADD_XP, { quantidade, fonte });
  },
};

// ============================================================================
// TIMERS
// ============================================================================
export const timersService = {
  async listarPorNucleo(nucleoId: string) {
    return api.get(API_ROUTES.TIMERS.LIST(nucleoId));
  },
  async start(payload: { nucleoId: string; descricao?: string }) {
    return api.post(API_ROUTES.TIMERS.START, payload);
  },
  async stop(id: string) {
    return api.post(API_ROUTES.TIMERS.STOP(id));
  },
};

// ============================================================================
// CALENDÁRIO
// ============================================================================
export const calendarioService = {
  async listarPorNucleo(nucleoId: string) {
    return api.get(API_ROUTES.CALENDARIO.LIST(nucleoId));
  },
  async criar(payload: any) {
    return api.post(API_ROUTES.CALENDARIO.CREATE, payload);
  },
  async atualizar(id: string, payload: any) {
    return api.put(API_ROUTES.CALENDARIO.UPDATE(id), payload);
  },
  async deletar(id: string) {
    return api.delete(API_ROUTES.CALENDARIO.DELETE(id));
  },
};

// ============================================================================
// USUÁRIOS (NOVO)
// ============================================================================
export const usersService = {
  async getMe(): Promise<User> {
    return api.get<User>(API_ROUTES.USERS.ME);
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    return api.patch<User>(API_ROUTES.USERS.PROFILE, payload);
  },

  async updatePreferences(preferences: Record<string, any>): Promise<void> {
    return api.patch(API_ROUTES.USERS.PREFERENCES, preferences);
  },

  async getStats(): Promise<{ tarefasConcluidasHoje: number /* outros */ }> {
    return api.get(API_ROUTES.USERS.STATS);
  },

  async getAchievements(): Promise<any[]> {
    return api.get(API_ROUTES.USERS.ACHIEVEMENTS);
  },

  async getXpLogs(): Promise<any[]> {
    return api.get(API_ROUTES.USERS.XP_LOGS);
  },

  async getEnergyLogs(): Promise<any[]> {
    return api.get(API_ROUTES.USERS.ENERGY_LOGS);
  },

  async getActivityLogs(): Promise<any[]> {
    return api.get(API_ROUTES.USERS.ACTIVITY_LOGS);
  },

  async getCurrentPlan(): Promise<any> {
    return api.get(API_ROUTES.USERS.PLAN);
  },

  async deleteAccount(): Promise<void> {
    return api.delete(API_ROUTES.USERS.DELETE_ACCOUNT);
  },

  async reactivateAccount(): Promise<void> {
    return api.post(API_ROUTES.USERS.REACTIVATE);
  },
};

// ============================================================================
// PLANOS (NOVO)
// ============================================================================
export const plansService = {
  async list(): Promise<any[]> {
    return api.get(API_ROUTES.PLANS.LIST);
  },
  async getCurrentSubscription(): Promise<any> {
    return api.get(API_ROUTES.PLANS.SUBSCRIPTION);
  },
};

// ============================================================================
// INSIGHTS / IA (NOVO)
// ============================================================================
export const insightsService = {
  async generate(payload: {
    nucleoId: string;
    contexto?: string;
  }): Promise<any> {
    return api.post(API_ROUTES.INSIGHTS.GENERATE, payload);
  },
  async getById(id: string): Promise<any> {
    return api.get(API_ROUTES.INSIGHTS.GET_BY_ID(id));
  },
  async apply(id: string): Promise<any> {
    return api.post(API_ROUTES.INSIGHTS.APPLY(id));
  },
  async chat(message: string, contexto?: string): Promise<any> {
    return api.post(API_ROUTES.INSIGHTS.CHAT, { message, contexto });
  },
};

// ============================================================================
// ADMIN (NOVO)
// ============================================================================
// export const adminService = {
//   async getStats(): Promise<any> {
//     return api.get(API_ROUTES.ADMIN.STATS);
//   },
//   async getUsers(params?: { page?: number; limit?: number }): Promise<any> {
//     return api.get(API_ROUTES.ADMIN.USERS, { params });
//   },
// };
