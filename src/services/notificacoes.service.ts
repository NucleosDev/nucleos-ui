// import api from "./api";

// // Tipos
// export interface Notificacao {
//   id: string;
//   titulo: string;
//   mensagem: string;
//   tipo: "info" | "success" | "warning" | "error";
//   lida: boolean;
//   data: string;
//   link?: string;
//   acao?: string;
//   metadata?: Record<string, any>;
// }

// export interface CreateNotificacaoData {
//   titulo: string;
//   mensagem: string;
//   tipo?: "info" | "success" | "warning" | "error";
//   link?: string;
//   acao?: string;
//   metadata?: Record<string, any>;
// }

// export interface NotificacoesResponse {
//   notificacoes: Notificacao[];
//   totalNaoLidas: number;
//   total: number;
// }

// class NotificacoesService {
//   private baseUrl = "/notificacoes";

//   /**
//    * Busca todas as notificações do usuário
//    */
//   async getNotificacoes(params?: {
//     page?: number;
//     limit?: number;
//     apenasNaoLidas?: boolean;
//   }): Promise<Notificacao[]> {
//     try {
//       const response = await api.get(this.baseUrl, { params });
//       return response.data;
//     } catch (error) {
//       console.error("Erro ao buscar notificações:", error);
//       return [];
//     }
//   }

//   /**
//    * Busca notificações com paginação e estatísticas
//    */
//   async getNotificacoesComStats(params?: {
//     page?: number;
//     limit?: number;
//     apenasNaoLidas?: boolean;
//   }): Promise<NotificacoesResponse> {
//     try {
//       const response = await api.get(`${this.baseUrl}/com-stats`, { params });
//       return response.data;
//     } catch (error) {
//       console.error("Erro ao buscar notificações com stats:", error);
//       return {
//         notificacoes: [],
//         totalNaoLidas: 0,
//         total: 0,
//       };
//     }
//   }

//   /**
//    * Busca uma notificação específica
//    */
//   async getNotificacao(id: string): Promise<Notificacao | null> {
//     try {
//       const response = await api.get(`${this.baseUrl}/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Erro ao buscar notificação:", error);
//       return null;
//     }
//   }

//   /**
//    * Marca uma notificação como lida
//    */
//   async marcarComoLida(id: string): Promise<void> {
//     try {
//       await api.patch(`${this.baseUrl}/${id}/ler`);
//     } catch (error) {
//       console.error("Erro ao marcar notificação como lida:", error);
//       throw error;
//     }
//   }

//   /**
//    * Marca todas as notificações como lidas
//    */
//   async marcarTodasComoLidas(): Promise<void> {
//     try {
//       await api.patch(`${this.baseUrl}/marcar-todas-lidas`);
//     } catch (error) {
//       console.error("Erro ao marcar todas notificações como lidas:", error);
//       throw error;
//     }
//   }

//   /**
//    * Remove uma notificação
//    */
//   async removerNotificacao(id: string): Promise<void> {
//     try {
//       await api.delete(`${this.baseUrl}/${id}`);
//     } catch (error) {
//       console.error("Erro ao remover notificação:", error);
//       throw error;
//     }
//   }

//   /**
//    * Remove todas as notificações lidas
//    */
//   async removerTodasLidas(): Promise<void> {
//     try {
//       await api.delete(`${this.baseUrl}/remover-lidas`);
//     } catch (error) {
//       console.error("Erro ao remover notificações lidas:", error);
//       throw error;
//     }
//   }

//   /**
//    * Conta notificações não lidas
//    */
//   async contarNaoLidas(): Promise<number> {
//     try {
//       const response = await api.get(`${this.baseUrl}/nao-lidas/count`);
//       return response.data.count;
//     } catch (error) {
//       console.error("Erro ao contar notificações não lidas:", error);
//       return 0;
//     }
//   }

//   /**
//    * Cria uma nova notificação (para uso interno do sistema)
//    */
//   async criarNotificacao(data: CreateNotificacaoData): Promise<Notificacao | null> {
//     try {
//       const response = await api.post(this.baseUrl, data);
//       return response.data;
//     } catch (error) {
//       console.error("Erro ao criar notificação:", error);
//       return null;
//     }
//   }

//   /**
//    * Envia notificação em tempo real via WebSocket (se disponível)
//    */
//   enviarNotificacaoRealtime(notificacao: Notificacao): void {
//     if (typeof window !== "undefined" && (window as any).socket) {
//       (window as any).socket.emit("nova-notificacao", notificacao);
//     }
//   }
// }

// export const notificacoesService = new NotificacoesService();
// export default notificacoesService;

export async function getNotificacoes() {
  return [];
}
