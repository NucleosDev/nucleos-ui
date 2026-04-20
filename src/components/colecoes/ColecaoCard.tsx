"use client";

import { useState } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCampos, useItensColecao } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import type { Colecao, Campo } from "@/types/colecao";
import { GerenciarCamposModal } from "./GerenciarCamposModal";
import { cn } from "@/lib/utils";

interface ColecaoCardProps {
  colecao: Colecao;
  nucleoId: string;
  blocoId: string;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function ColecaoCard({
  colecao,
  nucleoId,
  blocoId,
  onEdit,
  onDelete,
}: ColecaoCardProps) {
  const [expandido, setExpandido] = useState(false);
  const [gerenciarCamposOpen, setGerenciarCamposOpen] = useState(false);
  const [novoItem, setNovoItem] = useState<Record<string, any>>({});
  const [mostrarFormAdicao, setMostrarFormAdicao] = useState(false);

  const { campos, isLoading: loadingCampos } = useCampos(colecao.id);
  const { itens, criarItem, atualizarItem, excluirItem } = useItensColecao(
    colecao.id,
  );

  const handleAddItem = async () => {
    if (Object.keys(novoItem).length === 0) return;
    try {
      await criarItem(novoItem);
      setNovoItem({});
      setMostrarFormAdicao(false);
      toast({ title: "Item adicionado!" });
    } catch (error) {
      toast({ title: "Erro ao adicionar", variant: "destructive" });
    }
  };

  const handleUpdateItem = async (
    itemId: string,
    campoId: string,
    valor: any,
  ) => {
    const item = itens.find((i) => i.id === itemId);
    if (!item) return;
    const novosValores = { ...item.valores, [campoId]: valor };
    try {
      await atualizarItem({ id: itemId, valores: novosValores });
    } catch (error) {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Excluir este item?")) return;
    try {
      await excluirItem(itemId);
    } catch (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow border-border/50">
        <CardHeader
          className="cursor-pointer pb-3"
          onClick={() => setExpandido(!expandido)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {expandido ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
              <CardTitle className="text-xl font-semibold">
                {colecao.nome}
              </CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Renomear
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setGerenciarCamposOpen(true);
                  }}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Gerenciar campos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(colecao.id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir coleção
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(colecao.createdAt).toLocaleDateString("pt-BR")}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {campos.length} campo{campos.length !== 1 ? "s" : ""}
            </span>
            <span>{itens.length} itens</span>
          </div>
        </CardHeader>

        {expandido && (
          <CardContent className="border-t pt-4 px-6">
            {loadingCampos ? (
              <div className="py-8 text-center">Carregando campos...</div>
            ) : campos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Esta coleção ainda não tem campos definidos.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setGerenciarCamposOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar campos
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        {campos.map((campo) => (
                          <TableHead key={campo.id} className="font-medium">
                            {campo.nome}
                          </TableHead>
                        ))}
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itens.map((item) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          {campos.map((campo) => (
                            <TableCell key={campo.id} className="py-3">
                              <CellEditor
                                campo={campo}
                                valor={item.valores[campo.id]}
                                onChange={(valor) =>
                                  handleUpdateItem(item.id, campo.id, valor)
                                }
                              />
                            </TableCell>
                          ))}
                          <TableCell className="py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Linha de adição rápida */}
                      {mostrarFormAdicao ? (
                        <TableRow>
                          {campos.map((campo) => (
                            <TableCell key={campo.id} className="py-3">
                              <CellEditor
                                campo={campo}
                                valor={novoItem[campo.id]}
                                onChange={(valor) =>
                                  setNovoItem((prev) => ({
                                    ...prev,
                                    [campo.id]: valor,
                                  }))
                                }
                                placeholder={`Novo ${campo.nome}`}
                                autoFocus
                              />
                            </TableCell>
                          ))}
                          <TableCell className="py-3">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={handleAddItem}
                                disabled={Object.keys(novoItem).length === 0}
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setMostrarFormAdicao(false);
                                  setNovoItem({});
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={campos.length + 1}
                            className="py-2 px-4"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => setMostrarFormAdicao(true)}
                            >
                              <Plus className="mr-2 h-4 w-4" /> New
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGerenciarCamposOpen(true)}
                  >
                    <Layers className="mr-2 h-4 w-4" /> Gerenciar campos
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <GerenciarCamposModal
        open={gerenciarCamposOpen}
        onClose={() => setGerenciarCamposOpen(false)}
        colecaoId={colecao.id}
        colecaoNome={colecao.nome}
      />
    </>
  );
}

// CellEditor melhorado
function CellEditor({
  campo,
  valor,
  onChange,
  placeholder,
  autoFocus = false,
}: {
  campo: Campo;
  valor: any;
  onChange: (valor: any) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  if (campo.tipoCampo === "texto") {
    return (
      <Textarea
        value={valor || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[60px] resize-none text-sm"
        autoFocus={autoFocus}
      />
    );
  }
  if (campo.tipoCampo === "numero") {
    return (
      <Input
        type="number"
        value={valor ?? ""}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        placeholder={placeholder}
        className="h-9"
        autoFocus={autoFocus}
      />
    );
  }
  if (campo.tipoCampo === "data") {
    return (
      <Input
        type="date"
        value={valor || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-9"
        autoFocus={autoFocus}
      />
    );
  }
  if (campo.tipoCampo === "booleano") {
    return (
      <div className="flex items-center gap-2 h-9">
        <Switch checked={valor || false} onCheckedChange={onChange} />
        <span className="text-sm text-muted-foreground">
          {valor ? "Sim" : "Não"}
        </span>
      </div>
    );
  }
  return (
    <Input
      value={valor || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9"
      autoFocus={autoFocus}
    />
  );
}
