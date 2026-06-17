// src/components/colecoes/ColecaoBoard.tsx
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
  Copy,
  X,
  Check,
  GripVertical,
  Table2,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCampos, useItensColecao, useColecoes } from "@/hooks/useColecoes";
import { useBlocos } from "@/hooks/useBlocos";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { Colecao, Campo, Item } from "@/types/colecao";
import { GerenciarCamposModal } from "./GerenciarCamposModal";
import { EditableTableCell } from "./EditableTableCell";

interface ColecaoBoardProps {
  colecao: Colecao;
  blocoId: string;
  onRefresh?: () => void;
}

// ── Ícones de tipo (movido para fora do componente) ──────────────────────
const TIPO_ICONS: Record<string, React.ReactElement> = {
  texto: <span className="text-xs font-semibold text-primary">Aa</span>,
  numero: <span className="text-xs font-semibold text-green-600">#</span>,
  data: <span className="text-xs font-semibold text-purple-600">📅</span>,
  booleano: <span className="text-xs font-semibold text-orange-600">✓</span>,
};

export function ColecaoBoard({
  colecao,
  blocoId,
  onRefresh,
}: ColecaoBoardProps) {
  const { update: updateBloco } = useBlocos();
  const { atualizarColecao, excluirColecao } = useColecoes(blocoId);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editNome, setEditNome] = useState(colecao.nome);
  const [showAddForm, setShowAddForm] = useState(false);
  const [novoItem, setNovoItem] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [gerenciarCamposOpen, setGerenciarCamposOpen] = useState(false);

  const { campos, isLoading: loadingCampos } = useCampos(colecao.id);
  const { itens, criarItem, excluirItem, atualizarItem } = useItensColecao(
    colecao.id,
  );

  useEffect(() => {
    if (campos.length > 0 && Object.keys(novoItem).length === 0) {
      const initialValues: Record<string, any> = {};
      campos.forEach((campo: Campo) => {
        if (campo.tipoCampo === "booleano") initialValues[campo.id] = false;
        else initialValues[campo.id] = "";
      });
      setNovoItem(initialValues);
    }
  }, [campos]);

  const handleAddItem = async () => {
    const valuesToSend: Record<string, any> = {};
    campos.forEach((campo: Campo) => {
      const val = novoItem[campo.id];
      if (val !== undefined && val !== "") {
        valuesToSend[campo.id] = val;
      }
    });
    if (Object.keys(valuesToSend).length === 0) return;
    try {
      await criarItem(valuesToSend);
      const resetValues: Record<string, any> = {};
      campos.forEach((campo: Campo) => {
        if (campo.tipoCampo === "booleano") resetValues[campo.id] = false;
        else resetValues[campo.id] = "";
      });
      setNovoItem(resetValues);
      setShowAddForm(false);
      toast({ title: "Item adicionado" });
    } catch {
      toast({ title: "Erro ao adicionar", variant: "destructive" });
    }
  };

  const handleUpdateNome = async () => {
    if (!editNome.trim()) return;
    try {
      await atualizarColecao({ id: colecao.id, nome: editNome });
      setIsEditing(false);
      toast({ title: "Nome atualizado" });
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
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

  const getCampoValue = (item: any, campo: Campo) => {
    const valor = item.valores?.[campo.id];
    if (valor === undefined || valor === null) return "-";
    if (campo.tipoCampo === "booleano") return valor ? "✓" : "✗";
    if (campo.tipoCampo === "data")
      return new Date(valor).toLocaleDateString("pt-BR");
    return String(valor);
  };

  const getTipoIcon = (tipo: string): React.ReactElement => {
    return TIPO_ICONS[tipo] || <span className="text-xs">•</span>;
  };

  if (loadingCampos) {
    return (
      <div className="bg-card rounded-xl border animate-pulse">
        <div className="h-12 bg-muted/50 rounded-t-xl" />
        <div className="p-4 space-y-2">
          <div className="h-16 bg-muted/30 rounded" />
          <div className="h-16 bg-muted/30 rounded" />
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border overflow-hidden"
      >
        {/* Header */}
        <div
          className="px-6 py-3 bg-primary/5 border-b flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
            {isEditing ? (
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="h-7 w-48 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdateNome();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={handleUpdateNome}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Table2 className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-base text-foreground">
                  {colecao.nome}
                </h4>
              </div>
            )}
            <Badge variant="outline" className="text-xs">
              {itens.length} {itens.length === 1 ? "item" : "itens"}
            </Badge>
            {campos.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {campos.length} campos
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* View Toggle */}
            <div className="flex items-center gap-0.5 bg-muted/50 rounded-md p-0.5 mr-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode("board");
                }}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  viewMode === "board" && "bg-background shadow-sm",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode("table");
                }}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  viewMode === "table" && "bg-background shadow-sm",
                )}
              >
                <Table2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddForm(!showAddForm);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setGerenciarCamposOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Gerenciar campos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Renomear
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDeleteColecao}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir coleção
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {campos.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/30 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Adicione campos para começar
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGerenciarCamposOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar campo
                  </Button>
                </div>
              ) : viewMode === "board" ? (
                /* ═══════════════ MODO BOARD ═══════════════ */
                <div className="p-6">
                  {itens.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="p-4 rounded-full bg-muted mb-4">
                        <LayoutGrid className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Nenhum item ainda
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddForm(true)}
                        className="border-primary/30 text-primary hover:bg-primary/5"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Adicionar primeiro item
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {itens.map((item: Item) => (
                        <div
                          key={item.id}
                          className="group bg-card rounded-lg border border-border p-4 hover:shadow-lg hover:border-primary/40 transition-all"
                        >
                          <div className="space-y-3">
                            {campos.slice(0, 3).map((campo: Campo) => (
                              <div key={campo.id} className="text-sm">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  {campo.nome ?? "Sem nome"}
                                </span>
                                <p className="font-semibold text-foreground truncate mt-0.5">
                                  {getCampoValue(item, campo)}
                                </p>
                              </div>
                            ))}
                            {campos.length > 3 && (
                              <p className="text-xs text-muted-foreground font-medium pt-1">
                                +{campos.length - 3} mais{" "}
                                {campos.length - 3 === 1 ? "campo" : "campos"}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 flex items-center justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-opacity"
                              onClick={() => excluirItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(showAddForm || itens.length === 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20"
                    >
                      <h4 className="text-sm font-semibold text-foreground mb-4">
                        Novo Item
                      </h4>
                      <div className="space-y-3">
                        {campos.slice(0, 4).map((campo: Campo) => (
                          <div key={campo.id}>
                            <label className="text-xs font-semibold text-foreground/80 block mb-1.5 uppercase tracking-wide">
                              {campo.nome ?? "Sem nome"}
                            </label>
                            {campo.tipoCampo === "booleano" ? (
                              <button
                                onClick={() =>
                                  setNovoItem((prev) => ({
                                    ...prev,
                                    [campo.id]: !prev[campo.id],
                                  }))
                                }
                                className={cn(
                                  "px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-center",
                                  novoItem[campo.id]
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground/80 border border-border",
                                )}
                              >
                                {novoItem[campo.id] ? "Ativado" : "Desativado"}
                              </button>
                            ) : (
                              <Input
                                value={novoItem[campo.id] || ""}
                                onChange={(e) =>
                                  setNovoItem((prev) => ({
                                    ...prev,
                                    [campo.id]: e.target.value,
                                  }))
                                }
                                placeholder={`Digite ${(campo.nome ?? "").toLowerCase()}`}
                                className="h-9 text-sm  border-primary/30 focus:border-primary"
                              />
                            )}
                          </div>
                        ))}
                        {campos.length > 4 && (
                          <p className="text-xs text-muted-foreground">
                            +{campos.length - 4} mais{" "}
                            {campos.length - 4 === 1 ? "campo" : "campos"}
                          </p>
                        )}
                        <div className="flex gap-2 pt-3 border-t border-primary/20">
                          <Button
                            size="sm"
                            onClick={handleAddItem}
                            className="bg-primary hover:bg-primary/90 flex-1"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Adicionar Item
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowAddForm(false)}
                            className="border-primary/30 text-primary hover:bg-primary/5"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!showAddForm && itens.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 text-muted-foreground"
                      onClick={() => setShowAddForm(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar item
                    </Button>
                  )}
                </div>
              ) : (
                /* ═══════════════ MODO TABELA ═══════════════ */
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/30 border-b border-border z-10">
                      <tr>
                        <th className="px-4 py-3 text-left w-12">
                          <div className="text-xs text-muted-foreground">#</div>
                        </th>
                        {campos.map((campo: Campo) => (
                          <th
                            key={campo.id}
                            className="px-4 py-3 text-left font-medium text-foreground/80 space-nowrap"
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
                                {getTipoIcon(campo.tipoCampo)}
                              </div>
                              <span>{campo.nome ?? "Sem nome"}</span>
                            </div>
                          </th>
                        ))}
                        <th className="px-4 py-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {itens.map((item: Item, idx: number) => (
                        <tr
                          key={item.id}
                          className="hover:bg-primary/5 transition-colors group"
                        >
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {idx + 1}
                          </td>
                          {campos.map((campo: Campo) => (
                            <td key={campo.id} className="px-1 py-1">
                              <EditableTableCell
                                valor={item.valores?.[campo.id]}
                                campo={campo}
                                onSave={async (novoValor) => {
                                  await atualizarItem({
                                    id: item.id,
                                    valores: { [campo.id]: novoValor },
                                  });
                                }}
                              />
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => excluirItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {showAddForm && (
                        <tr className="bg-primary/5 border-t-2 border-primary/20">
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            +
                          </td>
                          {campos.map((campo: Campo) => (
                            <td key={campo.id} className="px-4 py-3">
                              {campo.tipoCampo === "booleano" ? (
                                <button
                                  onClick={() =>
                                    setNovoItem((prev) => ({
                                      ...prev,
                                      [campo.id]: !prev[campo.id],
                                    }))
                                  }
                                  className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                                    novoItem[campo.id]
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-foreground/80",
                                  )}
                                >
                                  {novoItem[campo.id] ? "Sim" : "Não"}
                                </button>
                              ) : (
                                <Input
                                  value={novoItem[campo.id] || ""}
                                  onChange={(e) =>
                                    setNovoItem((prev) => ({
                                      ...prev,
                                      [campo.id]: e.target.value,
                                    }))
                                  }
                                  placeholder={campo.nome ?? ""}
                                  className="h-8 text-sm  border-primary/30 focus:border-primary"
                                />
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={handleAddItem}
                                className="bg-primary hover:bg-primary/90"
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowAddForm(false)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {!showAddForm && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground"
                        onClick={() => setShowAddForm(true)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar item
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <GerenciarCamposModal
        open={gerenciarCamposOpen}
        onClose={() => setGerenciarCamposOpen(false)}
        colecaoId={colecao.id}
        colecaoNome={colecao.nome}
        onRefresh={onRefresh}
      />
    </>
  );
}
