// types/timer.ts
export interface Timer {
  id: string;
  nucleoId: string;
  titulo?: string;
  inicio?: string;
  fim?: string;
  duracaoSegundos?: number;
  modo?: "crescente" | "decrescente";
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimerPayload {
  nucleoId: string;
  titulo?: string;
  duracaoSegundos?: number;
  modo?: "crescente" | "decrescente";
}

export interface StartTimerPayload {
  nucleoId: string;
  titulo?: string;
  duracaoSegundos?: number;
  modo?: "crescente" | "decrescente";
}
