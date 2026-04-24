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
            <DialogTitle>Itens da coleção</DialogTitle>
          </DialogHeader>
          <div className="max-h-[500px] overflow-auto">
            {itens.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhum item ainda.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {campos.map((c) => (
                      <TableHead key={c.id}>{c.nome}</TableHead>
                    ))}
                    <TableHead className="w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item) => (
                    <TableRow key={item.id}>
                      {campos.map((c) => (
                        <TableCell key={c.id}>
                          {formatValor(item.valores[c.id], c.tipoCampo)}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setItemEditando(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
