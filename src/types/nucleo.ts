// src/types/nucleo.ts
import { Bloco } from "./bloco";
import { User } from "./user";

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
  icon?: NucleoIcon;
  blocos?: Bloco[];
  achievements?: NucleoAchievement[];
  relations?: NucleoRelation[];
  user?: User;
}

export interface NucleoIcon {
  id: string;
  name?: string;
  iconUrl?: string;
  createdAt: string;
}

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
