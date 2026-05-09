"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Settings,
  Check,
  X,
  Table2,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCampos, useItensColecao, useColecoes } from "@/hooks/useColecoes";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { Colecao, Campo } from "@/types/colecao";
import { GerenciarCamposModal } from "./GerenciarCamposModal";
import { EditableTableCell } from "./EditableTableCell";

const ACCENT = "#10b981";

const TIPO_SYMBOL: Record<string, string> = {
  texto:    "Aa",
  numero:   "#",
  data:     "📅",
  booleano: "✓",
  arquivo:  "📎",
  select:   "▾",
  relacao:  "↗",
};

interface ColecaoBoardProps {
  colecao: Colecao;
  blocoId: string;
  onRefresh?: () => void;
}

function getCampoValue(item: any, campo: Campo): string {
  const valor = item.valores?.[campo.id];
  if (valor === undefined || valor === null) return "—";
  if (campo.tipoCampo === "booleano") return valor ? "✓" : "✗";
  if (campo.tipoCampo === "data") return new Date(valor).toLocaleDateString("pt-BR");
  return String(valor);
}

export function ColecaoBoard({ colecao, blocoId, onRefresh }: ColecaoBoardProps) {
  const { atualizarColecao, excluirColecao } = useColecoes(blocoId);
  const [isExpanded,        setIsExpanded]        = useState(true);
  const [isEditing,         setIsEditing]         = useState(false);
  const [editNome,          setEditNome]          = useState(colecao.nome);
  const [showAddForm,       setShowAddForm]       = useState(false);
  const [novoItem,          setNovoItem]          = useState<Record<string, any>>({});
  const [viewMode,          setViewMode]          = useState<"board" | "table">("board");
  const [gerenciarOpen,     setGerenciarOpen]     = useState(false);
  const [isSavingNome,      setIsSavingNome]      = useState(false);
  const [isAddingItem,      setIsAddingItem]      = useState(false);

  const { campos, isLoading: loadingCampos } = useCampos(colecao.id);
  const { itens, criarItem, atualizarItem, excluirItem } = useItensColecao(colecao.id);

  useEffect(() => {
    if (campos.length > 0 && Object.keys(novoItem).length === 0) {
      const init: Record<string, any> = {};
      campos.forEach((c) => { init[c.id] = c.tipoCampo === "booleano" ? false : ""; });
      setNovoItem(init);
    }
  }, [campos]);

  const handleUpdateNome = async () => {
    if (!editNome.trim()) return;
    setIsSavingNome(true);
    try {
      await atualizarColecao({ id: colecao.id, nome: editNome });
      setIsEditing(false);
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    } finally {
      setIsSavingNome(false);
    }
  };

  const handleDeleteColecao = async () => {
    if (!confirm("Tem certeza que deseja excluir esta coleção?")) return;
    try {
      await excluirColecao(colecao.id);
      toast({ title: "Coleção excluída" });
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleAddItem = async () => {
    const payload: Record<string, any> = {};
    campos.forEach((c) => {
      const val = novoItem[c.id];
      if (val !== undefined && val !== "") payload[c.id] = val;
    });
    if (Object.keys(payload).length === 0) return;
    setIsAddingItem(true);
    try {
      await criarItem(payload);
      const reset: Record<string, any> = {};
      campos.forEach((c) => { reset[c.id] = c.tipoCampo === "booleano" ? false : ""; });
      setNovoItem(reset);
      setShowAddForm(false);
    } catch {
      toast({ title: "Erro ao adicionar", variant: "destructive" });
    } finally {
      setIsAddingItem(false);
    }
  };

  if (loadingCampos) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/60 animate-pulse overflow-hidden">
        <div className="h-12 bg-muted/40 rounded-t-xl" />
        <div className="p-4 space-y-2">
          <div className="h-16 bg-muted/20 rounded-lg" />
          <div className="h-16 bg-muted/20 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
      >
        {/* ── Header ── */}
        <div
          className="relative flex items-center justify-between px-4 py-2.5 cursor-pointer select-none"
          style={{ background: `${ACCENT}08` }}
          onClick={() => !isEditing && setIsExpanded(!isExpanded)}
        >
          {/* Accent left rail */}
          <div
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
            style={{ background: ACCENT, opacity: 0.7 }}
          />

          <div className="flex items-center gap-2.5 pl-2">
            {/* Collapse indicator */}
            <span className="text-muted-foreground/50">
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>

            {/* Icon */}
            {!isEditing && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ background: `${ACCENT}18` }}
              >
                <Table2 className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              </div>
            )}

            {/* Name — editable */}
            {isEditing ? (
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdateNome();
                    if (e.key === "Escape") { setEditNome(colecao.nome); setIsEditing(false); }
                  }}
                  className="h-7 w-44 px-2 text-sm font-semibold bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": `${ACCENT}40` } as any}
                />
                <button
                  onClick={handleUpdateNome}
                  disabled={isSavingNome}
                  className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent text-muted-foreground transition-colors disabled:opacity-50"
                >
                  {isSavingNome ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => { setEditNome(colecao.nome); setIsEditing(false); }}
                  className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent text-muted-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <span className="text-sm font-semibold text-foreground">{colecao.nome}</span>
            )}

            {/* Counts */}
            {!isEditing && (
              <div className="flex items-center gap-1">
                <span
                  className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
                  style={{ background: `${ACCENT}18`, color: ACCENT }}
                >
                  {itens.length} {itens.length === 1 ? "item" : "itens"}
                </span>
                {campos.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-muted/60 text-muted-foreground/70">
                    {campos.length} campos
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            {/* View toggle */}
            <div className="flex items-center gap-px bg-muted/50 rounded-md p-0.5 mr-1">
              <button
                onClick={() => setViewMode("board")}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  viewMode === "board" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  viewMode === "table" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground",
                )}
              >
                <Table2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 text-sm">
                <DropdownMenuItem onClick={() => setGerenciarOpen(true)} className="gap-2">
                  <Settings className="h-3.5 w-3.5" /> Gerenciar campos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setIsEditing(true); setIsExpanded(true); }} className="gap-2">
                  <Pencil className="h-3.5 w-3.5" /> Renomear
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteColecao} className="gap-2 text-destructive focus:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" /> Excluir coleção
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── Collapsible body ── */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              {campos.length === 0 ? (
                /* Empty state — no fields yet */
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted/30">
                    <Settings className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground/60 mb-3">Adicione campos para começar</p>
                  <button
                    onClick={() => setGerenciarOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar campo
                  </button>
                </div>
              ) : viewMode === "board" ? (
                /* ── Board view ── */
                <div className="p-4 space-y-3">
                  {itens.length === 0 && !showAddForm ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div
                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ background: `${ACCENT}12` }}
                      >
                        <LayoutGrid className="h-5 w-5" style={{ color: ACCENT }} />
                      </div>
                      <p className="text-sm text-muted-foreground/60 mb-3">Nenhum item ainda</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: ACCENT }}
                      >
                        <Plus className="h-3 w-3" />
                        Adicionar primeiro item
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {itens.map((item) => (
                        <div
                          key={item.id}
                          className="group relative rounded-xl border border-border/40 bg-background/60 p-3.5 hover:border-border/80 hover:shadow-sm transition-all"
                        >
                          <div className="space-y-2.5">
                            {campos.slice(0, 3).map((campo) => (
                              <div key={campo.id} className="text-sm">
                                <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider mb-0.5">
                                  {campo.nome ?? "Sem nome"}
                                </p>
                                <p className="font-medium text-foreground truncate">
                                  {getCampoValue(item, campo)}
                                </p>
                              </div>
                            ))}
                            {campos.length > 3 && (
                              <p className="text-[10px] text-muted-foreground/40">
                                +{campos.length - 3} {campos.length - 3 === 1 ? "campo" : "campos"}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => excluirItem(item.id)}
                            className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add item form */}
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-border/50 bg-background/80 p-4 space-y-3"
                    >
                      <p className="text-xs font-semibold text-foreground/70">Novo item</p>
                      <div className="space-y-2.5">
                        {campos.slice(0, 4).map((campo) => (
                          <div key={campo.id}>
                            <label className="block text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1">
                              {campo.nome ?? "Sem nome"}
                            </label>
                            {campo.tipoCampo === "booleano" ? (
                              <button
                                onClick={() => setNovoItem((p) => ({ ...p, [campo.id]: !p[campo.id] }))}
                                className={cn(
                                  "w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                  novoItem[campo.id]
                                    ? "text-white"
                                    : "bg-muted/50 text-muted-foreground border border-border/50",
                                )}
                                style={novoItem[campo.id] ? { background: ACCENT } : {}}
                              >
                                {novoItem[campo.id] ? "Ativado" : "Desativado"}
                              </button>
                            ) : (
                              <input
                                value={novoItem[campo.id] || ""}
                                onChange={(e) => setNovoItem((p) => ({ ...p, [campo.id]: e.target.value }))}
                                placeholder={`Digite ${(campo.nome ?? "").toLowerCase()}`}
                                className="w-full px-3 py-1.5 text-sm rounded-lg bg-background border border-border/50 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-muted-foreground/40"
                                style={{ "--tw-ring-color": `${ACCENT}40` } as any}
                              />
                            )}
                          </div>
                        ))}
                        {campos.length > 4 && (
                          <p className="text-[10px] text-muted-foreground/40">
                            +{campos.length - 4} {campos.length - 4 === 1 ? "campo" : "campos"} não exibidos
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleAddItem}
                          disabled={isAddingItem}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                          style={{ background: ACCENT }}
                        >
                          {isAddingItem ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                          Adicionar
                        </button>
                        <button
                          onClick={() => setShowAddForm(false)}
                          className="px-3 py-1.5 rounded-lg border border-border/50 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {!showAddForm && itens.length > 0 && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex w-full items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-border/40 text-xs text-muted-foreground/50 hover:text-muted-foreground hover:border-border/60 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Adicionar item
                    </button>
                  )}
                </div>
              ) : (
                /* ── Table view ── */
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/20">
                        <th className="px-4 py-2.5 text-left w-10">
                          <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">#</span>
                        </th>
                        {campos.map((campo) => (
                          <th key={campo.id} className="px-4 py-2.5 text-left">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-[10px] font-bold w-4 text-center"
                                style={{ color: ACCENT }}
                              >
                                {TIPO_SYMBOL[campo.tipoCampo] ?? "•"}
                              </span>
                              <span className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider whitespace-nowrap">
                                {campo.nome ?? "Sem nome"}
                              </span>
                            </div>
                          </th>
                        ))}
                        <th className="px-4 py-2.5 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((item, idx) => (
                        <tr
                          key={item.id}
                          className="group border-b border-border/30 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-2.5 text-xs text-muted-foreground/40 tabular-nums">
                            {idx + 1}
                          </td>
                          {campos.map((campo) => (
                            <td key={campo.id} className="px-2 py-1">
                              <EditableTableCell
                                valor={item.valores?.[campo.id]}
                                campo={campo}
                                onSave={async (novoValor) => {
                                  await atualizarItem({ id: item.id, valores: { [campo.id]: novoValor } });
                                }}
                              />
                            </td>
                          ))}
                          <td className="px-4 py-2.5">
                            <button
                              onClick={() => excluirItem(item.id)}
                              className="flex h-5 w-5 items-center justify-center rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {showAddForm && (
                        <tr className="border-b border-border/30 bg-muted/10">
                          <td className="px-4 py-2 text-xs text-muted-foreground/40">+</td>
                          {campos.map((campo) => (
                            <td key={campo.id} className="px-2 py-2">
                              {campo.tipoCampo === "booleano" ? (
                                <button
                                  onClick={() => setNovoItem((p) => ({ ...p, [campo.id]: !p[campo.id] }))}
                                  className={cn(
                                    "px-2 py-1 rounded-md text-xs font-medium transition-colors",
                                    novoItem[campo.id] ? "text-white" : "bg-muted/50 text-muted-foreground",
                                  )}
                                  style={novoItem[campo.id] ? { background: ACCENT } : {}}
                                >
                                  {novoItem[campo.id] ? "Sim" : "Não"}
                                </button>
                              ) : (
                                <input
                                  value={novoItem[campo.id] || ""}
                                  onChange={(e) => setNovoItem((p) => ({ ...p, [campo.id]: e.target.value }))}
                                  placeholder={campo.nome ?? ""}
                                  className="w-full px-2 py-1 text-sm rounded-lg bg-background border border-border/50 focus:outline-none focus:ring-1 placeholder:text-muted-foreground/30"
                                />
                              )}
                            </td>
                          ))}
                          <td className="px-2 py-2">
                            <div className="flex gap-1">
                              <button
                                onClick={handleAddItem}
                                disabled={isAddingItem}
                                className="flex h-6 w-6 items-center justify-center rounded-md text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                                style={{ background: ACCENT }}
                              >
                                {isAddingItem ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                              </button>
                              <button
                                onClick={() => setShowAddForm(false)}
                                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {!showAddForm && (
                    <div className="border-t border-border/30">
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="flex w-full items-center gap-1.5 px-4 py-2 text-xs text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/20 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Adicionar item
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <GerenciarCamposModal
        open={gerenciarOpen}
        onClose={() => setGerenciarOpen(false)}
        colecaoId={colecao.id}
        colecaoNome={colecao.nome}
        onRefresh={onRefresh}
      />
    </>
  );
}
