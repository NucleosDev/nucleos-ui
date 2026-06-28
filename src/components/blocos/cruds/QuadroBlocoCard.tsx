"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Kanban, Loader2, Settings, X, Check, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useColecoes, useCampos, useItensColecao } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import { CriarTabelaRapidaModal } from "@/components/colecoes/CriarTabelaRapidaModal";
import { GerenciarCamposModal } from "@/components/colecoes/GerenciarCamposModal";
import { colecoesService } from "@/services/colecoes.service";
import type { Bloco } from "@/types/bloco";
import type { Campo, Item } from "@/types/colecao";

interface QuadroBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

// ── Coluna individual do kanban ───────────────────────────────────────────────
function KanbanColumn({
  colValue,
  items,
  otherCampos,
  groupByCampo,
  onAddItem,
  onDeleteItem,
}: {
  colValue: string;
  items: Item[];
  otherCampos: Campo[];
  groupByCampo: Campo;
  onAddItem: (valores: Record<string, any>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    const hasValue = Object.values(formValues).some((v) => v.trim());
    if (!hasValue) return;
    const valores: Record<string, any> = {
      [groupByCampo.id]: colValue,
      ...formValues,
    };
    setIsAdding(true);
    try {
      await onAddItem(valores);
      setFormValues({});
      setShowForm(false);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col w-60 shrink-0 rounded-xl border border-border/40 bg-muted/20 overflow-hidden">
      {/* Cabeçalho da coluna */}
      <div className="px-3 py-2.5 flex items-center justify-between bg-muted/40 border-b border-border/30">
        <span className="text-xs font-semibold text-foreground/80 truncate max-w-[140px]">
          {colValue || "Sem status"}
        </span>
        <span className="text-[10px] text-muted-foreground bg-background/60 border border-border/30 rounded-full px-1.5 py-0.5 tabular-nums">
          {items.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[360px]">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="group bg-card rounded-lg border border-border p-3 hover:border-orange-500/30 hover:shadow-sm transition-all"
            >
              <div className="space-y-1.5">
                {otherCampos.slice(0, 3).map((campo) => {
                  const val = item.valores?.[campo.id];
                  if (val === undefined || val === null || val === "") return null;
                  return (
                    <div key={campo.id}>
                      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wide leading-none mb-0.5">
                        {campo.nome}
                      </p>
                      <p className="text-xs font-medium text-foreground truncate">
                        {String(val)}
                      </p>
                    </div>
                  );
                })}
                {otherCampos.length === 0 && (
                  <p className="text-xs text-muted-foreground/40 italic">Item sem campos extras</p>
                )}
              </div>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="mt-2 flex items-center gap-1 text-[10px] text-destructive/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="h-2.5 w-2.5" />
                Remover
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Formulário inline para novo item */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/30 bg-card/50 p-2 space-y-1.5"
          >
            {otherCampos.slice(0, 3).map((campo) => (
              <Input
                key={campo.id}
                placeholder={campo.nome ?? ""}
                value={formValues[campo.id] || ""}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, [campo.id]: e.target.value }))
                }
                className="h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") setShowForm(false);
                }}
              />
            ))}
            <div className="flex gap-1 pt-0.5">
              <Button
                size="sm"
                className="flex-1 h-7 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleAdd}
                disabled={isAdding}
              >
                {isAdding ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                {isAdding ? "" : "Adicionar"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => setShowForm(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão adicionar */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="m-2 p-1.5 rounded-lg text-xs text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
        >
          <Plus className="h-3 w-3" />
          Adicionar
        </button>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export function QuadroBlocoCard({ bloco }: QuadroBlocoCardProps) {
  const [quickTableOpen, setQuickTableOpen] = useState(false);
  const [gerenciarCamposOpen, setGerenciarCamposOpen] = useState(false);
  const [groupByCampoId, setGroupByCampoId] = useState<string>("");
  const [extraColumns, setExtraColumns] = useState<string[]>([]);
  const [showNewColumn, setShowNewColumn] = useState(false);
  const [newColumnValue, setNewColumnValue] = useState("");

  const { colecoes, isLoading: loadingColecoes, criarColecao, isCreating } =
    useColecoes(bloco.id);

  const colecao = colecoes[0] ?? null;

  const { campos, isLoading: loadingCampos } = useCampos(colecao?.id ?? "");
  const { itens, criarItem, excluirItem } = useItensColecao(colecao?.id ?? "");

  const groupByCampo =
    campos.find((c) => c.id === groupByCampoId) ?? campos[0] ?? null;
  const otherCampos = campos.filter((c) => c.id !== groupByCampo?.id);

  const columns = useMemo(() => {
    if (!groupByCampo) return [];

    const seen = new Set<string>();
    const cols: { value: string; items: Item[] }[] = [];

    itens.forEach((item: Item) => {
      const val = String(item.valores?.[groupByCampo.id] ?? "");
      if (!seen.has(val)) {
        seen.add(val);
        cols.push({ value: val, items: [] });
      }
    });

    itens.forEach((item: Item) => {
      const val = String(item.valores?.[groupByCampo.id] ?? "");
      cols.find((c) => c.value === val)?.items.push(item);
    });

    extraColumns.forEach((val) => {
      if (!seen.has(val)) {
        cols.push({ value: val, items: [] });
      }
    });

    return cols;
  }, [itens, groupByCampo, extraColumns]);

  const handleQuickTable = async (
    nome: string,
    novoCampos: { nome: string; tipoCampo: string }[],
  ) => {
    try {
      const nova = await criarColecao({ nome });
      for (const campo of novoCampos) {
        await colecoesService.createCampo(nova.id, campo.nome, campo.tipoCampo);
      }
      setQuickTableOpen(false);
      toast({ title: "Quadro criado!" });
    } catch {
      toast({ title: "Erro ao criar quadro", variant: "destructive" });
    }
  };

  const handleAddItem = async (valores: Record<string, any>) => {
    try {
      await criarItem(valores);
    } catch {
      toast({ title: "Erro ao adicionar item", variant: "destructive" });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await excluirItem(itemId);
    } catch {
      toast({ title: "Erro ao remover item", variant: "destructive" });
    }
  };

  const handleAddColumn = () => {
    const val = newColumnValue.trim();
    if (val && !columns.some((c) => c.value === val)) {
      setExtraColumns((prev) => [...prev, val]);
    }
    setNewColumnValue("");
    setShowNewColumn(false);
  };

  // ── Estados de carregamento e vazio ──────────────────────────────────────

  if (loadingColecoes) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  if (!colecao) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4 bg-orange-500/10 border border-orange-500/20">
            <Kanban className="h-6 w-6 text-orange-500/60" />
          </div>
          <p className="text-sm font-medium text-foreground/70 mb-1">
            Nenhum quadro ainda
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-xs mb-5">
            Organize itens em colunas por status, categoria ou qualquer campo.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickTableOpen(true)}
            disabled={isCreating}
            className="border-orange-500/25 text-orange-600 hover:bg-orange-500/8"
          >
            {isCreating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Plus className="h-3.5 w-3.5 mr-1.5" />
            )}
            Criar quadro
          </Button>
        </div>
        <CriarTabelaRapidaModal
          open={quickTableOpen}
          onClose={() => setQuickTableOpen(false)}
          onConfirm={handleQuickTable}
          isSubmitting={isCreating}
        />
      </>
    );
  }

  if (loadingCampos) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  if (campos.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4 bg-orange-500/10 border border-orange-500/20">
            <Settings className="h-6 w-6 text-orange-500/40" />
          </div>
          <p className="text-sm font-medium text-foreground/70 mb-1">
            Configure os campos primeiro
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-xs mb-5">
            O campo pelo qual você agrupará os cards vira as colunas do quadro.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGerenciarCamposOpen(true)}
            className="border-orange-500/25 text-orange-600 hover:bg-orange-500/8"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Adicionar campos
          </Button>
        </div>
        <GerenciarCamposModal
          open={gerenciarCamposOpen}
          onClose={() => setGerenciarCamposOpen(false)}
          colecaoId={colecao.id}
          colecaoNome={colecao.nome}
        />
      </>
    );
  }

  // ── Kanban ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground/60">Agrupar por</span>
          <select
            value={groupByCampo?.id ?? ""}
            onChange={(e) => setGroupByCampoId(e.target.value)}
            className="text-xs border border-border/50 rounded-md px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-orange-500/40"
          >
            {campos.map((campo: Campo) => (
              <option key={campo.id} value={campo.id}>
                {campo.nome}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setGerenciarCamposOpen(true)}
        >
          <Settings className="h-3 w-3 mr-1" />
          Campos
        </Button>
      </div>

      {/* Board */}
      <div className="overflow-x-auto pb-3 -mx-1 px-1">
        <div className={cn("flex gap-3", columns.length === 0 && "min-w-0")}>
          {columns.length === 0 && !showNewColumn ? (
            <div className="flex flex-col items-center justify-center w-full py-10 text-center gap-2">
              <p className="text-xs text-muted-foreground/50">
                Nenhum item ainda. Adicione uma coluna para começar.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-orange-500/25 text-orange-600 hover:bg-orange-500/8"
                onClick={() => setShowNewColumn(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Nova coluna
              </Button>
            </div>
          ) : (
            <>
              {columns.map((col) => (
                <KanbanColumn
                  key={col.value}
                  colValue={col.value}
                  items={col.items}
                  otherCampos={otherCampos}
                  groupByCampo={groupByCampo!}
                  onAddItem={handleAddItem}
                  onDeleteItem={handleDeleteItem}
                />
              ))}

              {/* Botão/form de nova coluna */}
              {showNewColumn ? (
                <div className="w-60 shrink-0 rounded-xl border border-orange-500/30 border-dashed bg-orange-500/5 p-3 space-y-2">
                  <p className="text-[11px] font-medium text-orange-600/80">Nome da coluna</p>
                  <Input
                    placeholder={`ex: ${groupByCampo?.nome ?? "Status"}...`}
                    value={newColumnValue}
                    onChange={(e) => setNewColumnValue(e.target.value)}
                    className="h-8 text-xs"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn();
                      if (e.key === "Escape") setShowNewColumn(false);
                    }}
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="flex-1 h-7 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={handleAddColumn}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Criar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() => {
                        setShowNewColumn(false);
                        setNewColumnValue("");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewColumn(true)}
                  className="w-12 shrink-0 flex flex-col items-center justify-center gap-1 rounded-xl border border-border/30 border-dashed text-muted-foreground/30 hover:text-muted-foreground/60 hover:border-border/60 transition-colors py-8 self-start mt-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <GerenciarCamposModal
        open={gerenciarCamposOpen}
        onClose={() => setGerenciarCamposOpen(false)}
        colecaoId={colecao.id}
        colecaoNome={colecao.nome}
      />
    </>
  );
}
