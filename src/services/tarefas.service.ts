import api from "./api";
import { API_ROUTES } from "@/constants/routes";
import type {
  Lista,
  ItemLista,
  Categoria,
  CreateListaPayload,
  CreateItemListaPayload,
} from "@/types/index";

export interface Tarefa {
  id: string;
  blocoId: string;
  titulo: string;
  descricao?: string;
  prioridade: "baixa" | "media" | "alta" | "urgente";
  status: "pendente" | "concluida" | "atrasada" | "em_progresso" | "cancelada";
  dataVencimento?: string;
  concluidaEm?: string;
  posicao: number;
  createdAt: string;
}

export interface Habito {
  id: string;
  blocoId: string;
  nome: string;
  frequencia: string;
  metaVezes?: number;
  createdAt: string;
}

export interface HabitoRegistro {
  id: string;
  habitoId: string;
  data: string;
  vezesCompletadas: number;
}

export const tarefasService = {
  async getTarefas(blocoId: string): Promise<Tarefa[]> {
    const r = await api.get<Tarefa[]>(API_ROUTES.TAREFAS.BY_BLOCO(blocoId));
    return r.data;
  },
  async createTarefa(data: Partial<Tarefa>): Promise<Tarefa> {
    const r = await api.post<Tarefa>(API_ROUTES.TAREFAS.BASE, data);
    return r.data;
  },
  async updateTarefa(id: string, data: Partial<Tarefa>): Promise<Tarefa> {
    const r = await api.put<Tarefa>(API_ROUTES.TAREFAS.BY_ID(id), data);
    return r.data;
  },
  async deleteTarefa(id: string): Promise<void> {
    await api.delete(API_ROUTES.TAREFAS.BY_ID(id));
  },
  async concluirTarefa(id: string): Promise<void> {
    await api.post(API_ROUTES.TAREFAS.CONCLUDE(id));
  },
  async getTarefasVencendo(): Promise<Tarefa[]> {
    const r = await api.get<Tarefa[]>(API_ROUTES.TAREFAS.VENCENDO);
    return r.data;
  },
};

export const habitosService = {
  async getHabitos(blocoId: string): Promise<Habito[]> {
    const r = await api.get<Habito[]>(API_ROUTES.HABITOS.BY_BLOCO(blocoId));
    return r.data;
  },
  async createHabito(data: Partial<Habito>): Promise<Habito> {
    const r = await api.post<Habito>(API_ROUTES.HABITOS.BASE, data);
    return r.data;
  },
  async updateHabito(id: string, data: Partial<Habito>): Promise<Habito> {
    const r = await api.put<Habito>(API_ROUTES.HABITOS.BY_ID(id), data);
    return r.data;
  },
  async deleteHabito(id: string): Promise<void> {
    await api.delete(API_ROUTES.HABITOS.BY_ID(id));
  },
  async registrarHabito(
    id: string,
    data: { data: string; vezesCompletadas: number },
  ): Promise<void> {
    await api.post(API_ROUTES.HABITOS.REGISTER(id), data);
  },
};

// export const listasService = {
//   async getListas(blocoId: string): Promise<Lista[]> {
//     const r = await api.get<any[]>(API_ROUTES.LISTAS.BY_BLOCO(blocoId));
//     // Garantir que updatedAt exista
//     return r.data.map((item) => ({
//       ...item,
//       updatedAt: item.updatedAt || new Date().toISOString(),
//     }));
//   },

//   async createLista(data: Partial<Lista>): Promise<Lista> {
//     const r = await api.post<any>(API_ROUTES.LISTAS.BASE, data);
//     return {
//       ...r.data,
//       updatedAt: r.data.updatedAt || new Date().toISOString(),
//     };
//   },

//   async updateLista(id: string, data: Partial<Lista>): Promise<Lista> {
//     const r = await api.put<any>(API_ROUTES.LISTAS.BY_ID(id), data);
//     return {
//       ...r.data,
//       updatedAt: r.data.updatedAt || new Date().toISOString(),
//     };
//   },

//   async deleteLista(id: string): Promise<void> {
//     await api.delete(API_ROUTES.LISTAS.BY_ID(id));
//   },

//   async getItens(listaId: string): Promise<ItemLista[]> {
//     const r = await api.get<any[]>(API_ROUTES.LISTAS.ITENS(listaId));
//     return r.data.map((item) => ({
//       ...item,
//       updatedAt: item.updatedAt || new Date().toISOString(),
//     }));
//   },

//   async createItem(payload: CreateItemListaPayload): Promise<ItemLista> {
//     const backendPayload = {
//       listaId: payload.listaId,
//       nome: payload.nome.trim(),
//       quantidade: payload.quantidade ?? 1,
//       valorUnitario: payload.valorUnitario ?? 0,
//       categoriaId: payload.categoriaId ?? null,
//     };

//     try {
//       const r = await api.post(API_ROUTES.LISTAS.ITEM_CREATE, backendPayload);
//       return r.data;
//     } catch (error: any) {
//       // Exibe detalhes do erro do backend
//       console.error("Backend error:", error.response?.data);
//       const message = error.response?.data?.message || error.message;
//       throw new Error(message);
//     }
//   },

//   async updateItem(id: string, data: Partial<ItemLista>): Promise<ItemLista> {
//     const r = await api.put<any>(API_ROUTES.LISTAS.ITEM_UPDATE(id), data);
//     return {
//       ...r.data,
//       updatedAt: r.data.updatedAt || new Date().toISOString(),
//     };
//   },

//   async toggleItem(id: string): Promise<ItemLista> {
//     const r = await api.patch<any>(API_ROUTES.LISTAS.ITEM_TOGGLE(id));
//     return {
//       ...r.data,
//       updatedAt: r.data.updatedAt || new Date().toISOString(),
//     };
//   },

//   async deleteItem(id: string): Promise<void> {
//     await api.delete(API_ROUTES.LISTAS.ITEM_DELETE(id));
//   },
// };

export const listasService = {
  // Listas
  async getListas(blocoId: string): Promise<Lista[]> {
    const r = await api.get(API_ROUTES.LISTAS.BY_BLOCO(blocoId));
    return r.data;
  },
  async createLista(data: CreateListaPayload): Promise<Lista> {
    const r = await api.post(API_ROUTES.LISTAS.BASE, data);
    return r.data;
  },
  async updateLista(id: string, data: Partial<Lista>): Promise<Lista> {
    const r = await api.put(API_ROUTES.LISTAS.BY_ID(id), data);
    return r.data;
  },
  async deleteLista(id: string): Promise<void> {
    await api.delete(API_ROUTES.LISTAS.BY_ID(id));
  },

  // Itens
  async getItens(listaId: string): Promise<ItemLista[]> {
    const r = await api.get(API_ROUTES.LISTAS.ITENS(listaId));
    return r.data;
  },
  async createItem(payload: CreateItemListaPayload): Promise<ItemLista> {
    const backendPayload = {
      listaId: payload.listaId,
      nome: payload.nome.trim(),
      quantidade: payload.quantidade ?? 1,
      valorUnitario: payload.valorUnitario ?? 0,
      categoriaId: payload.categoriaId ?? null,
    };

    try {
      const r = await api.post(API_ROUTES.LISTAS.ITEM_CREATE, backendPayload);
      return r.data;
    } catch (error: any) {
      console.error("❌ ERRO BACKEND:", error.response?.data);
      throw error;
    }
  },
  async updateItem(id: string, data: Partial<ItemLista>): Promise<ItemLista> {
    const r = await api.put(API_ROUTES.LISTAS.ITEM_UPDATE(id), data);
    return r.data;
  },
  async toggleItem(id: string): Promise<ItemLista> {
    const r = await api.patch(API_ROUTES.LISTAS.ITEM_TOGGLE(id));
    return r.data;
  },
  async deleteItem(id: string): Promise<void> {
    await api.delete(API_ROUTES.LISTAS.ITEM_DELETE(id));
  },

  // Categorias
  async getCategorias(listaId: string): Promise<Categoria[]> {
    const r = await api.get(API_ROUTES.LISTAS.CATEGORIAS(listaId));
    return r.data;
  },
  async createCategoria(payload: CreateCategoriaPayload): Promise<Categoria> {
    const r = await api.post(API_ROUTES.LISTAS.CATEGORIA_CREATE, payload);
    return r.data;
  },
  async deleteCategoria(id: string): Promise<void> {
    await api.delete(API_ROUTES.LISTAS.CATEGORIA_DELETE(id));
  },
};
