"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, CheckSquare, Calendar, Repeat2,
  Inbox, CheckCircle2, Loader2, X, ChevronRight,
  AlertCircle, List, Clock, FileText, Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNucleos } from "@/hooks/useNucleo";
import { useQueryClient } from "@tanstack/react-query";
import { blocosService } from "@/services/blocos.service";
import { tarefasService } from "@/services/tarefas.service";
import { habitosService } from "@/services/habitos.service";
import { listasService } from "@/services/lista.service";
import { calendarioService } from "@/services/calendario.service";
import { timersService } from "@/services/timers.service";
import { nucleosService } from "@/services/nucleos.service";
import { interpret, type OrbitCommand, type OrbitCommandType } from "@/lib/orbit/interpreter";
import { getPurgatoryItems, type PurgatoryItem } from "@/components/home/capture-field";
import { saveCorrection, applyOverrides } from "@/lib/orbit/user-corrections";
import { useAuth } from "@/auth";
import type { Nucleo } from "@/types/nucleo";

// ── Constantes ────────────────────────────────────────────────────────────────

const DEMO_FRASE =
  "reunião com cliente terça às 15h, pagar boleto da internet R$120, comprar leite e café, estudar React 1h todo dia, ligar pra minha mãe sábado";

const TYPE_CONFIG: Record<
  OrbitCommandType,
  { icon: React.ReactNode; label: string; cor: string }
> = {
  CREATE_TASK:  { icon: <CheckSquare  className="h-3.5 w-3.5" />, label: "Tarefa",  cor: "#4D7CFF" },
  CREATE_HABIT: { icon: <Repeat2      className="h-3.5 w-3.5" />, label: "Hábito",  cor: "#10B981" },
  CREATE_EVENT: { icon: <Calendar     className="h-3.5 w-3.5" />, label: "Evento",  cor: "#F59E0B" },
  CREATE_LIST:  { icon: <List         className="h-3.5 w-3.5" />, label: "Lista",   cor: "#8B5CF6" },
  CREATE_TIMER: { icon: <Clock        className="h-3.5 w-3.5" />, label: "Timer",   cor: "#06B6D4" },
  CREATE_NOTE:  { icon: <FileText     className="h-3.5 w-3.5" />, label: "Nota",    cor: "#EC4899" },
  CAPTURE:      { icon: <Inbox        className="h-3.5 w-3.5" />, label: "Captura", cor: "#9CA3AF" },
};

const LOW_CONFIDENCE_THRESHOLD = 0.65;

// ── Tipos internos ────────────────────────────────────────────────────────────

type CreationStatus = "idle" | "creating" | "done" | "error";
type EditOverrides = Record<string, Partial<OrbitCommand>>;

interface CommandResult {
  commandId: string;
  success: boolean;
  message: string;
}

// ── Helpers de criação ────────────────────────────────────────────────────────

async function ensureBloco(
  nucleoId: string,
  tipo: "tarefas" | "habitos" | "lista" | "notas",
  titulo: string,
  existingBlocos?: Nucleo["blocos"],
): Promise<string> {
  const existing = (existingBlocos ?? []).find((b) => b.tipo === tipo);
  if (existing) return existing.id;
  const created = await blocosService.criar({
    nucleoId,
    tipo,
    titulo,
    posicao: 0,
  });
  return created.id;
}

async function ensureNucleo(
  tipoNucleo: string | undefined,
  nucleos: Nucleo[],
  newNucleoCache: Record<string, Nucleo>,
): Promise<Nucleo | undefined> {
  if (!tipoNucleo) return undefined;

  // Já no cache local desta sessão
  if (newNucleoCache[tipoNucleo]) return newNucleoCache[tipoNucleo];

  // Já existe entre os núcleos do usuário
  const found = nucleos.find((n) => n.tipo === tipoNucleo);
  if (found) return found;

  // Cria automaticamente
  const nomeMap: Record<string, string> = {
    pessoal: "Pessoal", profissional: "Profissional", estudo: "Estudos",
    fitness: "Fitness", financas: "Finanças", hobby: "Hobby",
    projeto: "Projetos", idiomas: "Idiomas",
  };
  const corMap: Record<string, string> = {
    pessoal: "#F97316", profissional: "#4D7CFF", estudo: "#7C3AED",
    fitness: "#10B981", financas: "#F59E0B", hobby: "#8B5CF6",
    projeto: "#06B6D4", idiomas: "#EC4899",
  };
  const novo = await nucleosService.create({
    nome: nomeMap[tipoNucleo] ?? tipoNucleo,
    tipo: tipoNucleo as Nucleo["tipo"],
    corDestaque: corMap[tipoNucleo] ?? "#4D7CFF",
  });
  newNucleoCache[tipoNucleo] = novo;
  return novo;
}

// ── Componente principal ──────────────────────────────────────────────────────

export function OrbitWorkspace({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const userId = user?.userId ?? "anon";

  const [inputText, setInputText] = useState("");
  const [commands, setCommands] = useState<OrbitCommand[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editOverrides, setEditOverrides] = useState<EditOverrides>({});
  const [expandedEdit, setExpandedEdit] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [creationStatus, setCreationStatus] = useState<CreationStatus>("idle");
  const [results, setResults] = useState<CommandResult[]>([]);
  const [purgatoryItems, setPurgatoryItems] = useState<PurgatoryItem[]>(() =>
    getPurgatoryItems().filter((i) => !i.processed),
  );

  const { data: nucleos = [] } = useNucleos();
  const queryClient = useQueryClient();

  // ── Processar ────────────────────────────────────────────────────────────────

  const handleProcess = useCallback(() => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setHasProcessed(false);
    setResults([]);
    setEditOverrides({});
    setExpandedEdit(null);

    setTimeout(() => {
      const raw = interpret(inputText, nucleos);
      const withOverrides = applyOverrides(raw, userId);
      setCommands(withOverrides);
      setSelected(new Set(withOverrides.map((c) => c.id)));
      setIsProcessing(false);
      setHasProcessed(true);
    }, 1200);
  }, [inputText, nucleos, userId]);

  const handleProcessPurgatory = useCallback((item: PurgatoryItem) => {
    setInputText(item.text);
    setHasProcessed(false);
    setCommands([]);
    setEditOverrides({});
    setTimeout(() => {
      const raw = interpret(item.text, nucleos);
      const withOverrides = applyOverrides(raw, userId);
      setCommands(withOverrides);
      setSelected(new Set(withOverrides.map((c) => c.id)));
      setHasProcessed(true);
    }, 400);
  }, [nucleos, userId]);

  // ── Edição inline ────────────────────────────────────────────────────────────

  const updateOverride = useCallback(
    (commandId: string, patch: Partial<OrbitCommand>) => {
      setEditOverrides((prev) => ({
        ...prev,
        [commandId]: { ...(prev[commandId] ?? {}), ...patch },
      }));
    },
    [],
  );

  const handleDiscard = useCallback((commandId: string) => {
    setCommands((prev) => prev.filter((c) => c.id !== commandId));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(commandId);
      return next;
    });
    setEditOverrides((prev) => {
      const next = { ...prev };
      delete next[commandId];
      return next;
    });
  }, []);

  const handleNucleoOverride = useCallback(
    (cmd: OrbitCommand, nucleoId: string) => {
      const nucleo = nucleos.find((n: Nucleo) => n.id === nucleoId);
      if (!nucleo) return;
      updateOverride(cmd.id, {
        nucleoId: nucleo.id,
        nucleoNome: nucleo.nome,
        nucleoCor: nucleo.corDestaque ?? "#4D7CFF",
        tipoNucleo: nucleo.tipo,
      });
      // Salva correção na memória determinística
      const effective = { ...cmd, ...editOverrides[cmd.id], nucleoId: nucleo.id, nucleoNome: nucleo.nome, nucleoCor: nucleo.corDestaque ?? "#4D7CFF", tipoNucleo: nucleo.tipo };
      saveCorrection(userId, cmd.raw, effective as OrbitCommand);
    },
    [nucleos, userId, editOverrides, updateOverride],
  );

  const handleTypeOverride = useCallback(
    (cmd: OrbitCommand, tipo: OrbitCommandType) => {
      updateOverride(cmd.id, { type: tipo });
      const effective = { ...cmd, ...editOverrides[cmd.id], type: tipo };
      saveCorrection(userId, cmd.raw, effective as OrbitCommand);
    },
    [userId, editOverrides, updateOverride],
  );

  // ── Criar ────────────────────────────────────────────────────────────────────

  const handleCreate = useCallback(async () => {
    const toCreate = commands
      .filter((c) => selected.has(c.id))
      .map((c) => ({ ...c, ...editOverrides[c.id] }));

    if (toCreate.length === 0) return;

    setCreationStatus("creating");
    const createdResults: CommandResult[] = [];
    const newNucleoCache: Record<string, Nucleo> = {};

    for (const cmd of toCreate) {
      try {
        // Resolve núcleo (usa o do override, ou auto-cria)
        let nucleoId = cmd.nucleoId;
        let resolvedNucleo: Nucleo | undefined;

        if (!nucleoId && cmd.tipoNucleo) {
          resolvedNucleo = await ensureNucleo(cmd.tipoNucleo, nucleos, newNucleoCache);
          nucleoId = resolvedNucleo?.id;
        } else if (nucleoId) {
          resolvedNucleo = nucleos.find((n: Nucleo) => n.id === nucleoId) ?? newNucleoCache[cmd.tipoNucleo ?? ""];
        }

        if (!nucleoId) {
          createdResults.push({ commandId: cmd.id, success: true, message: `"${cmd.titulo}" salvo na fila (sem núcleo)` });
          continue;
        }

        // Combina data + hora em ISO string para eventos
        const buildDataEvento = (): string => {
          const base = cmd.dataVencimento ?? new Date().toISOString().split("T")[0];
          const hora = cmd.horaExata ?? "09:00";
          return `${base}T${hora}:00`;
        };

        switch (cmd.type) {
          case "CREATE_TASK": {
            const blocoId = await ensureBloco(nucleoId, "tarefas", "Tarefas", resolvedNucleo?.blocos);
            await tarefasService.createTarefa({
              blocoId,
              titulo: cmd.titulo,
              prioridade: cmd.prioridade,
              dataVencimento: cmd.dataVencimento ? new Date(cmd.dataVencimento) : undefined,
            });
            createdResults.push({ commandId: cmd.id, success: true, message: `Tarefa "${cmd.titulo}" criada` });
            break;
          }

          case "CREATE_HABIT": {
            const blocoId = await ensureBloco(nucleoId, "habitos", "Hábitos", resolvedNucleo?.blocos);
            await habitosService.criar({
              blocoId,
              nome: cmd.titulo,
              frequencia: cmd.frequencia ?? "diaria",
              diasSemana: cmd.diasSemana ?? [0,1,2,3,4,5,6],
              metaVezes: 1,
            });
            createdResults.push({ commandId: cmd.id, success: true, message: `Hábito "${cmd.titulo}" criado` });
            break;
          }

          case "CREATE_EVENT": {
            await calendarioService.criar({
              nucleoId,
              titulo: cmd.titulo,
              dataEvento: buildDataEvento(),
              duracaoMinutos: cmd.duracaoMinutos ?? 60,
            });
            createdResults.push({ commandId: cmd.id, success: true, message: `Evento "${cmd.titulo}" criado` });
            break;
          }

          case "CREATE_LIST": {
            const blocoId = await ensureBloco(nucleoId, "lista", cmd.tipoLista === "compras" ? "Compras" : "Lista", resolvedNucleo?.blocos);
            const lista = await listasService.criar({
              blocoId,
              nome: cmd.titulo || (cmd.tipoLista === "compras" ? "Compras" : "Lista"),
              tipoLista: cmd.tipoLista ?? "generico",
            });
            // Cria os itens da lista
            if (cmd.listaItems && cmd.listaItems.length > 0) {
              for (const itemNome of cmd.listaItems) {
                await listasService.criarItem({
                  listaId: lista.id,
                  nome: itemNome,
                  valorUnitario: cmd.tipoLista === "financeiro" ? cmd.valorFinanceiro : undefined,
                });
              }
            }
            createdResults.push({ commandId: cmd.id, success: true, message: `Lista "${lista.nome}" criada com ${cmd.listaItems?.length ?? 0} itens` });
            break;
          }

          case "CREATE_TIMER": {
            await timersService.start({
              nucleoId,
              titulo: cmd.titulo,
              duracaoSegundos: (cmd.duracaoMinutos ?? 25) * 60,
              modo: "decrescente",
            });
            createdResults.push({ commandId: cmd.id, success: true, message: `Timer "${cmd.titulo}" (${cmd.duracaoMinutos ?? 25} min) iniciado` });
            break;
          }

          case "CREATE_NOTE": {
            const bloco = await blocosService.criar({ nucleoId, tipo: "notas", titulo: cmd.titulo, posicao: 0 });
            await blocosService.patchContent(bloco.id, `<p>${cmd.conteudo ?? cmd.titulo}</p>`, "notas");
            createdResults.push({ commandId: cmd.id, success: true, message: `Nota "${cmd.titulo}" criada` });
            break;
          }

          default: {
            createdResults.push({ commandId: cmd.id, success: true, message: `"${cmd.titulo}" capturado` });
          }
        }
      } catch (err) {
        console.error("Orbit create error:", err);
        createdResults.push({
          commandId: cmd.id,
          success: false,
          message: `Erro ao criar "${cmd.titulo}"${err instanceof Error ? `: ${err.message}` : ""}`,
        });
      }
    }

    // Invalida caches
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["nucleos"] }),
      queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
      queryClient.invalidateQueries({ queryKey: ["tarefas", "vencendo"] }),
      queryClient.invalidateQueries({ queryKey: ["habitos"] }),
      queryClient.invalidateQueries({ queryKey: ["listas"] }),
      queryClient.invalidateQueries({ queryKey: ["calendario"] }),
      queryClient.invalidateQueries({ queryKey: ["timers"] }),
    ]);

    setResults(createdResults);
    setCreationStatus("done");
    setSelected(new Set());
  }, [commands, selected, editOverrides, nucleos, queryClient]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleProcess();
    }
  };

  const toggleCommand = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedCount = selected.size;
  const hasPending = purgatoryItems.length > 0;

  // Estatísticas por tipo
  const typeCounts = useMemo(() => {
    return (Object.keys(TYPE_CONFIG) as OrbitCommandType[]).reduce(
      (acc, type) => {
        acc[type] = commands.filter((c) => c.type === type).length;
        return acc;
      },
      {} as Record<OrbitCommandType, number>,
    );
  }, [commands]);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className={compact ? "space-y-6" : "max-w-[760px] mx-auto px-5 md:px-8 py-8 space-y-8"}>

      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(77,124,255,0.22), rgba(0,201,167,0.14))",
                border: "1px solid rgba(77,124,255,0.22)",
              }}
            >
              <Sparkles className="h-4.5 w-4.5 text-primary" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Orbit</h1>
              <p className="text-xs text-muted-foreground/50">Despeje seu caos — o sistema organiza.</p>
            </div>
          </div>

          {/* Chip Exemplo */}
          <button
            onClick={() => {
              setInputText(DEMO_FRASE);
              setHasProcessed(false);
              setCommands([]);
              setEditOverrides({});
            }}
            className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/6 px-3 py-1.5 text-[11px] font-semibold text-primary/70 hover:bg-primary/10 transition-colors duration-150"
          >
            <Sparkles className="h-3 w-3" />
            Ver exemplo
          </button>
        </div>
      </div>

      {/* Itens do Purgatório pendentes */}
      <AnimatePresence>
        {hasPending && creationStatus === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-primary/15 bg-primary/4 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Inbox className="h-4 w-4 text-primary/70" />
              <span className="text-sm font-semibold text-foreground/80">
                {purgatoryItems.length} {purgatoryItems.length === 1 ? "item capturado" : "itens capturados"} aguardando
              </span>
            </div>
            <div className="space-y-2">
              {purgatoryItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-background/50 px-3 py-2.5 cursor-pointer group hover:bg-background/80 transition-colors duration-150"
                  onClick={() => handleProcessPurgatory(item)}
                >
                  <span className="flex-1 text-sm text-foreground/70 line-clamp-1">{item.text}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary/60 transition-colors" />
                </div>
              ))}
              {purgatoryItems.length > 3 && (
                <p className="text-xs text-muted-foreground/40 text-center pt-1">
                  +{purgatoryItems.length - 3} outros
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input principal */}
      <AnimatePresence mode="wait">
        {creationStatus !== "done" ? (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div
              className={cn(
                "relative rounded-2xl border bg-background/50 backdrop-blur-sm transition-all duration-200",
                inputText ? "border-primary/25 shadow-[0_0_0_2px_rgba(77,124,255,0.08)]" : "border-border/30",
              )}
            >
              {!inputText && (
                <p className="pointer-events-none absolute top-5 left-5 text-base text-muted-foreground/30 select-none leading-relaxed">
                  {"Exemplo: \"hoje preciso terminar o relatório, comprar pão e leite, ir à academia às 18h\""}
                </p>
              )}
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (hasProcessed) { setHasProcessed(false); setCommands([]); }
                }}
                onKeyDown={handleKeyDown}
                rows={4}
                className="w-full resize-none bg-transparent px-5 py-5 text-base leading-relaxed text-foreground outline-none placeholder:text-transparent"
                placeholder=" "
                aria-label="Campo de entrada do Orbit"
              />
              <div className="flex items-center justify-between px-5 py-3 border-t border-border/15">
                <span className="text-[11px] text-muted-foreground/30 hidden sm:block">⌘↵ para processar</span>
                <motion.button
                  whileHover={inputText.trim() ? { scale: 1.03 } : {}}
                  whileTap={inputText.trim() ? { scale: 0.97 } : {}}
                  disabled={!inputText.trim() || isProcessing}
                  onClick={handleProcess}
                  className={cn(
                    "ml-auto flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                    inputText.trim() && !isProcessing
                      ? "bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(77,124,255,0.35)]"
                      : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed",
                  )}
                >
                  {isProcessing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analisando...</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Processar</>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Processing dots */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/12 px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-primary/70">Identificando intenções, categorias e contexto...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resultados da interpretação */}
            <AnimatePresence>
              {hasProcessed && commands.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  {/* Summary chips */}
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(TYPE_CONFIG) as OrbitCommandType[]).map((type) =>
                      typeCounts[type] > 0 ? (
                        <SummaryChip key={type} type={type} count={typeCounts[type]} />
                      ) : null,
                    )}
                    {commands.filter((c) => !c.nucleoId && editOverrides[c.id]?.nucleoId === undefined).length > 0 && (
                      <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
                        style={{ background: "#9CA3AF14", color: "#9CA3AF", border: "1px solid #9CA3AF24" }}>
                        <Inbox className="h-3.5 w-3.5" />
                        {commands.filter((c) => !c.nucleoId && editOverrides[c.id]?.nucleoId === undefined).length} sem núcleo
                      </div>
                    )}
                  </div>

                  {/* Command cards */}
                  <div className="space-y-2">
                    {commands.map((cmd, idx) => (
                      <CommandCard
                        key={cmd.id}
                        command={{ ...cmd, ...editOverrides[cmd.id] }}
                        originalCommand={cmd}
                        isSelected={selected.has(cmd.id)}
                        isEditExpanded={expandedEdit === cmd.id}
                        nucleos={nucleos}
                        onToggle={() => toggleCommand(cmd.id)}
                        onToggleEdit={(e) => {
                          e.stopPropagation();
                          setExpandedEdit((prev) => (prev === cmd.id ? null : cmd.id));
                        }}
                        onDiscard={(e) => { e.stopPropagation(); handleDiscard(cmd.id); }}
                        onTypeChange={(tipo) => handleTypeOverride(cmd, tipo)}
                        onNucleoChange={(nucleoId) => handleNucleoOverride(cmd, nucleoId)}
                        onDateChange={(date) => updateOverride(cmd.id, { dataVencimento: date || undefined })}
                        delay={idx * 0.04}
                      />
                    ))}
                  </div>

                  {/* CTA criar */}
                  <div className="flex items-center gap-3 pt-1">
                    <button onClick={() => setSelected(new Set(commands.map((c) => c.id)))}
                      className="text-xs text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors">
                      Selecionar todos
                    </button>
                    <button onClick={() => setSelected(new Set())}
                      className="text-xs text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors">
                      Limpar seleção
                    </button>
                    <motion.button
                      whileHover={selectedCount > 0 ? { scale: 1.02 } : {}}
                      whileTap={selectedCount > 0 ? { scale: 0.98 } : {}}
                      disabled={selectedCount === 0 || creationStatus === "creating"}
                      onClick={handleCreate}
                      className={cn(
                        "ml-auto flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                        selectedCount > 0
                          ? "bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(77,124,255,0.35)]"
                          : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed",
                      )}
                    >
                      {creationStatus === "creating" ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Criando...</>
                      ) : (
                        <><ArrowRight className="h-4 w-4" /> Criar {selectedCount > 0 ? `${selectedCount} ` : ""}{selectedCount === 1 ? "item" : "itens"}</>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {hasProcessed && commands.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-3 rounded-2xl border border-border/20 bg-muted/10 px-5 py-4">
                  <AlertCircle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Não consegui extrair ações claras</p>
                    <p className="text-xs text-muted-foreground/50 mt-0.5">
                      Tente: "comprar leite", "estudar React todo dia", "reunião sexta às 14h"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Done state */
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-base font-semibold text-foreground/90">Sistema atualizado</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                {results.filter((r) => r.success).length} {results.filter((r) => r.success).length === 1 ? "item criado" : "itens criados"} com sucesso
              </p>
            </div>

            <div className="space-y-1.5">
              {results.map((r) => (
                <div key={r.commandId}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-2.5",
                    r.success ? "bg-emerald-500/8 text-emerald-400" : "bg-red-500/8 text-red-400",
                  )}>
                  {r.success
                    ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    : <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  }
                  <span className="text-xs font-medium">{r.message}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setInputText(""); setCommands([]); setSelected(new Set());
                setHasProcessed(false); setCreationStatus("idle"); setResults([]);
                setEditOverrides({}); setExpandedEdit(null);
                setPurgatoryItems(getPurgatoryItems().filter((i) => !i.processed));
              }}
              className="w-full rounded-2xl border border-border/25 bg-background/50 py-3 text-sm font-medium text-foreground/60 hover:text-foreground/80 hover:border-border/40 transition-all duration-150"
            >
              Processar mais
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SummaryChip ───────────────────────────────────────────────────────────────

function SummaryChip({ type, count }: { type: OrbitCommandType; count: number }) {
  const { icon, label, cor } = TYPE_CONFIG[type];
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
      style={{ background: `${cor}14`, color: cor, border: `1px solid ${cor}24` }}
    >
      {icon}
      {count} {count === 1 ? label.toLowerCase() : `${label.toLowerCase()}s`}
    </div>
  );
}

// ── CommandCard ───────────────────────────────────────────────────────────────

interface CommandCardProps {
  command: OrbitCommand;
  originalCommand: OrbitCommand;
  isSelected: boolean;
  isEditExpanded: boolean;
  nucleos: Nucleo[];
  onToggle: () => void;
  onToggleEdit: (e: React.MouseEvent) => void;
  onDiscard: (e: React.MouseEvent) => void;
  onTypeChange: (tipo: OrbitCommandType) => void;
  onNucleoChange: (nucleoId: string) => void;
  onDateChange: (date: string) => void;
  delay?: number;
}

function CommandCard({
  command, originalCommand, isSelected, isEditExpanded,
  nucleos, onToggle, onToggleEdit, onDiscard,
  onTypeChange, onNucleoChange, onDateChange, delay = 0,
}: CommandCardProps) {
  const cfg = TYPE_CONFIG[command.type] ?? TYPE_CONFIG.CREATE_TASK;
  const cor = command.nucleoCor || cfg.cor;
  const isLowConfidence = originalCommand.confidence < LOW_CONFIDENCE_THRESHOLD;

  const formatDate = (iso?: string) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay }}
      className={cn(
        "relative rounded-xl border overflow-hidden transition-all duration-150",
        isSelected ? "bg-background/80 shadow-sm" : "bg-muted/10 opacity-60",
        isLowConfidence ? "border-orange-400/40" : "border-border/25",
      )}
    >
      {/* Color accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: isSelected ? cor : "transparent", transition: "background 0.15s" }} />

      {/* Main row — click to toggle selection */}
      <div className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer" onClick={onToggle}>
        {/* Checkbox */}
        <div className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-all duration-150",
          isSelected ? "border-primary bg-primary" : "border-border/40 bg-transparent",
        )}>
          {isSelected && (
            <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          )}
        </div>

        {/* Type icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${cor}18`, color: cor }}>
          {cfg.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: `${cor}99` }}>
              {cfg.label}
            </span>
            {command.nucleoNome ? (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${cor}14`, color: cor, border: `1px solid ${cor}22` }}>
                {command.nucleoNome}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/40 italic">sem núcleo</span>
            )}
            {isLowConfidence && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-400/12 text-orange-400 border border-orange-400/20">
                Revisar
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground/85 mt-0.5 truncate">{command.titulo}</p>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {command.prioridade === "alta" && <span className="text-[11px] font-medium text-red-400">Alta prioridade</span>}
            {command.dataVencimento && (
              <span className="text-[11px] text-muted-foreground/40">{formatDate(command.dataVencimento)}</span>
            )}
            {command.horaExata && <span className="text-[11px] text-muted-foreground/40">{command.horaExata}</span>}
            {command.periodo && (
              <span className="text-[11px] text-muted-foreground/40 capitalize">
                {command.periodo === "manha" ? "Manhã" : command.periodo === "tarde" ? "Tarde" : "Noite"}
              </span>
            )}
            {command.frequencia && <span className="text-[11px] text-emerald-500/70">{command.frequencia === "diaria" ? "Diário" : "Semanal"}</span>}
            {command.tipoLista === "compras" && command.listaItems && (
              <span className="text-[11px] text-muted-foreground/40">{command.listaItems.length} itens</span>
            )}
            {command.tipoLista === "financeiro" && command.valorFinanceiro && (
              <span className="text-[11px] text-amber-500/70">R$ {command.valorFinanceiro.toFixed(2)}</span>
            )}
            {command.duracaoMinutos && command.type === "CREATE_TIMER" && (
              <span className="text-[11px] text-cyan-500/70">{command.duracaoMinutos} min</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={onToggleEdit}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-150",
              isEditExpanded ? "bg-primary/15 text-primary" : "hover:bg-muted/30 text-muted-foreground/40 hover:text-muted-foreground/70",
            )}>
            <Edit2 className="h-3 w-3" />
          </button>
          <button onClick={onDiscard}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground/40 hover:text-red-400 transition-colors duration-150">
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Edit panel */}
      <AnimatePresence>
        {isEditExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/15"
          >
            <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3" onClick={(e) => e.stopPropagation()}>
              {/* Tipo */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Tipo</label>
                <select
                  value={command.type}
                  onChange={(e) => onTypeChange(e.target.value as OrbitCommandType)}
                  className="w-full rounded-lg border border-border/30 bg-background/60 px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary/40"
                >
                  {(Object.keys(TYPE_CONFIG) as OrbitCommandType[])
                    .filter((t) => t !== "CAPTURE")
                    .map((t) => (
                      <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
                    ))}
                </select>
              </div>

              {/* Núcleo */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Núcleo</label>
                <select
                  value={command.nucleoId ?? ""}
                  onChange={(e) => { if (e.target.value) onNucleoChange(e.target.value); }}
                  className="w-full rounded-lg border border-border/30 bg-background/60 px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary/40"
                >
                  <option value="">Sem núcleo</option>
                  {nucleos.map((n: Nucleo) => (
                    <option key={n.id} value={n.id}>{n.nome}</option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Data</label>
                <input
                  type="date"
                  value={command.dataVencimento ?? ""}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full rounded-lg border border-border/30 bg-background/60 px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary/40"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
