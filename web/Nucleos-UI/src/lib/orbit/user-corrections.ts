/**
 * Memória de correção determinística do Orbit.
 * Sem IA — persiste overrides do usuário no localStorage.
 * Quando o usuário corrige o tipo/núcleo de um item na revisão,
 * salva o mapeamento padrão → correção. Na próxima interpretação,
 * aplica os overrides antes da heurística normal.
 */

import type { OrbitCommand } from "./interpreter";

export interface CorrectionOverride {
  pattern: string; // lowercase keywords extraídos do texto original
  tipo: OrbitCommand["type"];
  nucleoId?: string;
  nucleoNome?: string;
  nucleoCor?: string;
  tipoNucleo?: string;
}

type CorrectionsMap = Record<string, CorrectionOverride>;

const STOP_WORDS = new Set([
  "de", "da", "do", "dos", "das", "e", "em", "no", "na", "por", "para", "com", "um", "uma",
  "o", "a", "os", "as", "que", "se", "mas", "ao", "à", "às", "aos",
]);

/** Extrai 2-3 palavras significativas do texto para usar como padrão de reconhecimento */
export function extractPattern(rawText: string): string {
  return rawText
    .toLowerCase()
    .replace(/[^a-záéíóúâêîôûãõç\s]/gi, "")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
    .slice(0, 3)
    .join(" ");
}

function getStorageKey(userId: string): string {
  return `nucleos:orbit:corrections:${userId}`;
}

export function getCorrections(userId: string): CorrectionsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCorrection(
  userId: string,
  rawText: string,
  override: Pick<OrbitCommand, "type" | "nucleoId" | "nucleoNome" | "nucleoCor" | "tipoNucleo">,
): void {
  if (typeof window === "undefined") return;
  const pattern = extractPattern(rawText);
  if (!pattern) return;

  const corrections = getCorrections(userId);
  corrections[pattern] = {
    pattern,
    tipo: override.type,
    nucleoId: override.nucleoId,
    nucleoNome: override.nucleoNome,
    nucleoCor: override.nucleoCor,
    tipoNucleo: override.tipoNucleo,
  };

  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(corrections));
  } catch {
    // ignora erros de storage cheio
  }
}

/** Aplica os overrides do usuário sobre os comandos interpretados */
export function applyOverrides(
  commands: OrbitCommand[],
  userId: string,
): OrbitCommand[] {
  const corrections = getCorrections(userId);
  if (Object.keys(corrections).length === 0) return commands;

  return commands.map((cmd) => {
    const pattern = extractPattern(cmd.raw);
    const override = corrections[pattern];
    if (!override) return cmd;

    return {
      ...cmd,
      type: override.tipo,
      nucleoId: override.nucleoId,
      nucleoNome: override.nucleoNome,
      nucleoCor: override.nucleoCor ?? cmd.nucleoCor,
      tipoNucleo: (override.tipoNucleo as OrbitCommand["tipoNucleo"]) ?? cmd.tipoNucleo,
      confidence: Math.min(cmd.confidence + 0.2, 1), // boost ao aplicar override
    };
  });
}
