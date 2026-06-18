"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Rows3, Trash2, Pencil, AlertTriangle, X, Plus } from "lucide-react";
import { useItensColecao } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import type { Campo } from "@/types/colecao";
import { AdicionarItemColecaoModal } from "./AdicionarItemColecaoModal";
import { cn } from "@/lib/utils";

interface VisualizarItensModalProps {
  open: boolean;
  onClose: () => void;
  colecaoId: string;
  campos: Campo[];
  onRefresh?: () => void;
}

export function VisualizarItensModal({
  open,
  onClose,
  colecaoId,
  campos,
  onRefresh,
}: VisualizarItensModalProps) {
  const { itens, excluirItem } = useItensColecao(colecaoId);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [itemEditando, setItemEditando] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await excluirItem(id);
      setConfirmDeleteId(null);
      toast({ title: "Item excluído" });
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatValor = (valor: any, tipo: string): string => {
    if (valor === null || valor === undefined) return "—";
    if (tipo === "booleano") return valor ? "Sim" : "Não";
    if (tipo === "data")
      return new Date(valor).toLocaleDateString("pt-BR", { timeZone: "UTC" });
    return String(valor);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Rows3 className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-sm font-semibold">
                  Itens da coleção
                </DialogTitle>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {itens.length} {itens.length === 1 ? "item" : "itens"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-3.5 w-3.5" />
              Novo item
            </button>
          </div>

          {/* Confirm delete banner */}
          {confirmDeleteId && (
            <div className="flex items-center gap-3 px-5 py-3 bg-destructive/8 border-b border-destructive/20">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive font-medium flex-1">
                Excluir este item permanentemente?
              </p>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={isDeleting}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Excluir
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Table */}
          <div className="max-h-[60vh] overflow-auto">
            {itens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Rows3 className="h-8 w-8 mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground/60 font-medium">
                  Nenhum item ainda
                </p>
                <p className="text-xs text-muted-foreground/40 mt-0.5">
                  Clique em "Novo item" para adicionar.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-10 text-muted-foreground/50 font-medium text-xs">
                      #
                    </TableHead>
                    {campos.map((c) => (
                      <TableHead
                        key={c.id}
                        className="text-muted-foreground/70 font-medium text-xs"
                      >
                        {c.nome}
                      </TableHead>
                    ))}
                    <TableHead className="w-20 text-right" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item, idx) => (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "border-border/40 transition-colors group",
                        confirmDeleteId === item.id && "bg-destructive/5",
                      )}
                    >
                      <TableCell className="text-xs text-muted-foreground/40 font-medium">
                        {idx + 1}
                      </TableCell>
                      {campos.map((c) => (
                        <TableCell
                          key={c.id}
                          className="text-sm text-foreground/80"
                        >
                          {formatValor(item.valores[c.id], c.tipoCampo)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setItemEditando(item)}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex items-center justify-end px-4 py-3 border-t border-border/40 bg-muted/20">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AdicionarItemColecaoModal
        open={addOpen || !!itemEditando}
        onClose={() => {
          setAddOpen(false);
          setItemEditando(null);
        }}
        colecaoId={colecaoId}
        campos={campos}
        initialValores={itemEditando?.valores}
        onSuccess={() => {
          setItemEditando(null);
          onRefresh?.();
        }}
      />
    </>
  );
}
