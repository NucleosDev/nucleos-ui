export interface CalendarioEvento {
  id: string;
  nucleoId: string;
  titulo: string;
  descricao?: string;
  dataEvento: string | Date;
  duracaoMinutos: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEventoPayload {
  nucleoId: string;
  titulo: string;
  descricao?: string;
  dataEvento: string | Date;
  duracaoMinutos?: number;
}

export interface UpdateEventoPayload extends Partial<CreateEventoPayload> {}
