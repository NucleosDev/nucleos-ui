// src/components/colecoes/VisualizarItensModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useItensColecao } from "@/hooks/useColecoes";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Campo } from "@/types/colecao";
import { useState } from "react";
import { AdicionarItemColecaoModal } from "./AdicionarItemColecaoModal";

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
  const [itemEditando, setItemEditando] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este item?")) return;
    try {
      await excluirItem(id);
      toast({ title: "Item excluído!" });
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const formatValor = (valor: any, tipo: string): string => {
    if (valor === null || valor === undefined) return "-";
    if (tipo === "booleano") return valor ? "Sim" : "Não";
    if (tipo === "data") return new Date(valor).toLocaleDateString("pt-BR");
    return String(valor);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Itens da Coleção</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {itens.length} {itens.length === 1 ? "item" : "itens"}
            </p>
          </DialogHeader>
          <div className="max-h-[500px] overflow-auto rounded-lg border border-slate-200">
            {itens.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">Nenhum item ainda na coleção.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="sticky top-0 bg-slate-50">
                  <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-700 w-12">
                      #
                    </TableHead>
                    {campos.map((c) => (
                      <TableHead
                        key={c.id}
                        className="font-semibold text-slate-700"
                      >
                        {c.nome}
                      </TableHead>
                    ))}
                    <TableHead className="w-24 font-semibold text-slate-700 text-right pr-4">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item, idx) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-blue-50 transition-colors group"
                    >
                      <TableCell className="text-xs text-muted-foreground font-medium">
                        {idx + 1}
                      </TableCell>
                      {campos.map((c) => (
                        <TableCell
                          key={c.id}
                          className="text-slate-700 font-medium"
                        >
                          {formatValor(item.valores[c.id], c.tipoCampo)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-600 hover:bg-blue-100"
                            onClick={() => setItemEditando(item)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {itemEditando && (
        <AdicionarItemColecaoModal
          open={!!itemEditando}
          onClose={() => {
            setItemEditando(null);
            onRefresh?.();
          }}
          colecaoId={colecaoId}
          campos={campos}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
