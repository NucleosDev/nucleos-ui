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
  AlignLeft,
  Hash,
  Calendar as CalendarIcon,
  ToggleLeft,
  FileText,
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

  // Ícone para cada tipo de campo
  const getCampoIcon = (tipo: string) => {
    switch (tipo) {
      case "texto":
        return <AlignLeft className="h-4 w-4" />;
      case "numero":
        return <Hash className="h-4 w-4" />;
      case "data":
        return <CalendarIcon className="h-4 w-4" />;
      case "booleano":
        return <ToggleLeft className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow border-border/50 overflow-hidden">
        <CardHeader
          className="cursor-pointer pb-3 bg-muted/20 border-b"
          onClick={() => setExpandido(!expandido)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {expandido ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {colecao.nome}
                </CardTitle>
              </div>
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
            <span>
              {itens.length} item{itens.length !== 1 ? "ns" : ""}
            </span>
          </div>
        </CardHeader>

        {expandido && (
          <CardContent className="pt-4 px-6 pb-6 bg-muted/5">
            {loadingCampos ? (
              <div className="py-12 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                </div>
              </div>
            ) : campos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                  <Layers className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">Coleção vazia</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Esta coleção ainda não tem campos definidos. Adicione campos
                  para começar a organizar seus dados.
                </p>
                <Button
                  variant="default"
                  onClick={() => setGerenciarCamposOpen(true)}
                  className="shadow-sm"
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar campos
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Visualização em cards para mobile */}
                <div className="block sm:hidden space-y-4">
                  {itens.map((item) => (
                    <div
                      key={item.id}
                      className="bg-background rounded-lg border p-4 space-y-3"
                    >
                      {campos.map((campo) => (
                        <div key={campo.id} className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {getCampoIcon(campo.tipoCampo)}
                            <span>{campo.nome}</span>
                          </div>
                          <CellEditor
                            campo={campo}
                            valor={item.valores[campo.id]}
                            onChange={(valor) =>
                              handleUpdateItem(item.id, campo.id, valor)
                            }
                          />
                        </div>
                      ))}
                      <div className="flex justify-end pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}

                  {mostrarFormAdicao ? (
                    <div className="bg-primary/5 rounded-lg border-2 border-dashed border-primary/30 p-4 space-y-3">
                      <p className="text-sm font-medium text-primary">
                        Novo item
                      </p>
                      {campos.map((campo) => (
                        <div key={campo.id} className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {getCampoIcon(campo.tipoCampo)}
                            <span>{campo.nome}</span>
                          </div>
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
                        </div>
                      ))}
                      <div className="flex gap-2 justify-end pt-2">
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
                        <Button
                          size="sm"
                          onClick={handleAddItem}
                          disabled={Object.keys(novoItem).length === 0}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={() => setMostrarFormAdicao(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novo item
                    </Button>
                  )}
                </div>

                {/* Visualização em tabela para desktop */}
                <div className="hidden sm:block">
                  <div className="rounded-lg border bg-background overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30 border-b">
                            {campos.map((campo) => (
                              <TableHead
                                key={campo.id}
                                className="font-medium py-3"
                              >
                                <div className="flex items-center gap-1.5">
                                  {getCampoIcon(campo.tipoCampo)}
                                  <span>{campo.nome}</span>
                                </div>
                              </TableHead>
                            ))}
                            <TableHead className="w-16"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {itens.map((item) => (
                            <TableRow
                              key={item.id}
                              className="hover:bg-muted/20 transition-colors border-b"
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

                          {mostrarFormAdicao ? (
                            <TableRow className="bg-primary/5">
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
                                    placeholder={campo.nome}
                                    autoFocus
                                  />
                                </TableCell>
                              ))}
                              <TableCell className="py-3">
                                <div className="flex gap-1">
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
                                  <Button
                                    size="sm"
                                    onClick={handleAddItem}
                                    disabled={
                                      Object.keys(novoItem).length === 0
                                    }
                                  >
                                    Salvar
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={campos.length + 1}
                                className="py-2 px-4 bg-muted/10"
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground w-full justify-center"
                                  onClick={() => setMostrarFormAdicao(true)}
                                >
                                  <Plus className="mr-2 h-4 w-4" /> Adicionar
                                  novo item
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
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

// CellEditor com campos maiores e melhor UX
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
        placeholder={placeholder || "Digite aqui..."}
        className="min-h-[100px] resize-y text-sm bg-background border-muted-foreground/20 focus:border-primary/50 transition-colors"
        autoFocus={autoFocus}
      />
    );
  }
  if (campo.tipoCampo === "numero") {
    return (
      <Input
        type="number"
        value={valor ?? ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || null)}
        placeholder={placeholder || "0"}
        className="h-10 bg-background border-muted-foreground/20 focus:border-primary/50 transition-colors"
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
        className="h-10 bg-background border-muted-foreground/20 focus:border-primary/50 transition-colors"
        autoFocus={autoFocus}
      />
    );
  }
  if (campo.tipoCampo === "booleano") {
    return (
      <div className="flex items-center gap-3 h-10">
        <Switch checked={valor || false} onCheckedChange={onChange} />
        <span className="text-sm font-medium">{valor ? "Sim" : "Não"}</span>
      </div>
    );
  }
  return (
    <Textarea
      value={valor || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Digite aqui..."}
      className="min-h-[100px] resize-y text-sm bg-background border-muted-foreground/20 focus:border-primary/50 transition-colors"
      autoFocus={autoFocus}
    />
  );
}
