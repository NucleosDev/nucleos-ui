// /components/nucleos/types/bloco-components.types.ts
import { Bloco, Colecao, Campo, Item, ItemValor } from "@/types/bloco"
import { CalendarioEvento, Timer } from "@/types/calendar"

export type BlocoTipo = 'texto' | 'colecao' | 'calendario' | 'timer' | 'quadro' | 'arquivo'

export interface BlocoWithData extends Bloco {
  tipo: BlocoTipo
  dados?: any
}

export interface BlocoTexto extends BlocoWithData {
  tipo: 'texto'
  dados: {
    conteudo: string
  }
}

export interface BlocoColecao extends BlocoWithData {
  tipo: 'colecao'
  dados: {
    colecao: Colecao
    campos: Campo[]
    itens: Item[]
  }
}

export interface BlocoCalendario extends BlocoWithData {
  tipo: 'calendario'
  dados: {
    eventos: CalendarioEvento[]
  }
}

export interface BlocoTimer extends BlocoWithData {
  tipo: 'timer'
  dados: {
    timers: Timer[]
  }
}

export interface NucleoDetailProps {
  nucleoId: string
  nucleo: any
  blocos: BlocoWithData[]
  onAddBloco?: (tipo: BlocoTipo) => void
  onEditBloco?: (blocoId: string, data: any) => void
  onDeleteBloco?: (blocoId: string) => void
  onReorderBlocos?: (blocoIds: string[]) => void
}