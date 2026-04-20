"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  DollarSign,
  MoreHorizontal,
  Calendar,
  Flag,
  Plus,
  Trash2,
  Store,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useItensLista } from "@/hooks/useItensLista";
import { toast } from "@/hooks/use-toast";
import type { Lista } from "@/types/lista";
import { cn } from "@/lib/utils";

// Configuração exclusiva para tipos financeiros
const tipoConfig: Record<
  string,
  {
    label: string;
    icon: any;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  gastos: {
    label: "Gastos",
    icon: TrendingDown,
    variant: "destructive",
  },
  despesas: {
    label: "Despesas",
    icon: TrendingDown,
    variant: "destructive",
  },
  receitas: {
    label: "Receitas",
    icon: TrendingUp,
    variant: "default",
  },
  compras: {
    label: "Compras",
    icon: ShoppingCart,
    variant: "outline",
  },
  financeiro: {
    label: "Financeiro",
    icon: DollarSign,
    variant: "default",
  },
};

interface ListaEstendida extends Lista {
  prioridade?: "baixa" | "media" | "alta" | "urgente";
  dataLimite?: string;
  tags?: string[];
  orcamento?: number;
  localCompra?: string;
}

interface ListaCardProps {
  lista: ListaEstendida;
  nucleoId: string;
  blocoId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onShare?: () => void;
  onArchive?: () => void;
  showProgressDetails?: boolean;
  compact?: boolean;
}

const calcularValorTotal = (itens: any[]) => {
  if (!itens) return 0;
  return itens.reduce((total, item) => {
    const valor = (item.valorUnitario || 0) * (item.quantidade || 1);
    return total + valor;
  }, 0);
};

const getPriorityColor = (prioridade?: string) => {
  switch (prioridade) {
    case "urgente":
      return "bg-red-100 text-red-800 border-red-200";
    case "alta":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "media":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "baixa":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "";
  }
};

const formatRelativeDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 0) return `Atrasado em ${Math.abs(diffDays)} dias`;
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays <= 7) return `Em ${diffDays} dias`;
  return date.toLocaleDateString("pt-BR");
};

const CustomProgress = ({
  value,
  className,
  isOverBudget,
}: {
  value: number;
  className?: string;
  isOverBudget?: boolean;
}) => (
  <div
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
      className,
    )}
  >
    <div
      className={cn(
        "h-full transition-all",
        isOverBudget ? "bg-red-500" : "bg-green-500",
      )}
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

export function ListaCard({
  lista,
  nucleoId,
  blocoId,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  onArchive,
  showProgressDetails = true,
  compact = false,
}: ListaCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [novoItemNome, setNovoItemNome] = useState("");
  const [novoItemQuantidade, setNovoItemQuantidade] = useState<number>(1);
  const [novoItemValor, setNovoItemValor] = useState<string>("");
  const [modalItensAberto, setModalItensAberto] = useState(false);

  const { itens, criarItem, toggleItem, excluirItem, isCreating } =
    useItensLista(lista.id);

  const tipo = lista.tipoLista;
  const config = tipoConfig[tipo] || tipoConfig.financeiro;
  const Icon = config.icon;

  const totalItens = itens.length;
  const itensConcluidos = itens.filter((item) => item.checked).length;
  const progresso = totalItens > 0 ? (itensConcluidos / totalItens) * 100 : 0;

  const valorTotal = calcularValorTotal(itens);
  const valorConcluido = calcularValorTotal(
    itens.filter((item) => item.checked),
  );
  const orcamentoUtilizado =
    lista.orcamento && valorTotal > 0
      ? (valorTotal / lista.orcamento) * 100
      : 0;
  const isOverBudget = lista.orcamento ? valorTotal > lista.orcamento : false;

  const handleClick = () => {
    router.push(
      `/dashboard/nucleos/${nucleoId}/blocos/${blocoId}/listas/${lista.id}`,
    );
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoItemNome.trim() || !novoItemValor) {
      toast({
        title: "Preencha o nome e o valor do item",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload: any = {
        listaId: lista.id,
        nome: novoItemNome.trim(),
        quantidade: novoItemQuantidade,
        valorUnitario: parseFloat(novoItemValor),
      };
      await criarItem(payload);
      setNovoItemNome("");
      setNovoItemQuantidade(1);
      setNovoItemValor("");
      toast({ title: "Item adicionado com sucesso!" });
    } catch (error: any) {
      console.error("Erro ao adicionar item:", error);
      toast({
        title: "Erro ao adicionar item",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleItem = async (itemId: string) => {
    try {
      await toggleItem(itemId);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar item",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await excluirItem(itemId);
      toast({ title: "Item removido" });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir item",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const isUrgent =
    lista.prioridade === "urgente" ||
    (lista.dataLimite && new Date(lista.dataLimite) < new Date());

  if (compact) {
    return (
      <Card
        className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="rounded-md bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{lista.nome}</span>
                  <Badge variant={config.variant} className="text-xs">
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {itensConcluidos}/{totalItens}
                  </span>
                  <Progress value={progresso} className="h-1.5 w-24" />
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate}>
                    Duplicar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive"
                  >
                    Excluir
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "group cursor-pointer hover:shadow-lg transition-all duration-300",
          isUrgent && "border-red-300 bg-red-50/30",
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-md p-2 transition-all duration-300",
                isHovered ? "bg-primary/20 scale-110" : "bg-primary/10",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isHovered ? "text-primary scale-110" : "text-primary",
                )}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {lista.nome}
                </CardTitle>
                {lista.prioridade && (
                  <Badge className={getPriorityColor(lista.prioridade)}>
                    <Flag className="h-3 w-3 mr-1" />
                    {lista.prioridade.charAt(0).toUpperCase() +
                      lista.prioridade.slice(1)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant={config.variant} className="text-xs">
                  {config.label}
                </Badge>
                {lista.localCompra && (
                  <Badge variant="outline" className="text-xs">
                    <Store className="h-3 w-3 mr-1" />
                    {lista.localCompra}
                  </Badge>
                )}
                {lista.dataLimite && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant={
                          formatRelativeDate(lista.dataLimite)?.includes(
                            "Atrasado",
                          )
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatRelativeDate(lista.dataLimite)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Data limite:{" "}
                        {new Date(lista.dataLimite).toLocaleDateString("pt-BR")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {lista.orcamento && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Orçamento: R$ {lista.orcamento.toLocaleString("pt-BR")}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Orçamento total definido</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalItensAberto(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ver todos os itens</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    Editar lista
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate();
                    }}
                  >
                    Duplicar lista
                  </DropdownMenuItem>
                )}
                {onShare && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare();
                    }}
                  >
                    Compartilhar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onArchive && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive();
                    }}
                  >
                    Arquivar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="text-destructive"
                  >
                    Excluir lista
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {showProgressDetails && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {itensConcluidos} de {totalItens} itens
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({totalItens} {totalItens === 1 ? "item" : "itens"})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {valorTotal > 0 && (
                    <span className="text-xs text-muted-foreground">
                      R$ {valorConcluido.toLocaleString("pt-BR")} / R${" "}
                      {valorTotal.toLocaleString("pt-BR")}
                    </span>
                  )}
                  <span className="font-medium">{Math.round(progresso)}%</span>
                </div>
              </div>
              <Progress value={progresso} className="h-2" />
            </div>
          )}

          {/* Formulário inline */}
          <form
            onSubmit={handleAddItem}
            className="space-y-2 mt-2 pt-2 border-t"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <Input
                placeholder="Item"
                value={novoItemNome}
                onChange={(e) => setNovoItemNome(e.target.value)}
                className="h-9 text-sm flex-1"
                disabled={isCreating}
              />
              <Input
                type="number"
                placeholder="Qtd"
                value={novoItemQuantidade}
                onChange={(e) =>
                  setNovoItemQuantidade(parseInt(e.target.value) || 1)
                }
                className="h-9 w-16 text-sm"
                min="1"
                disabled={isCreating}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="R$"
                value={novoItemValor}
                onChange={(e) => setNovoItemValor(e.target.value)}
                className="h-9 w-24 text-sm"
                disabled={isCreating}
              />
              <Button
                type="submit"
                size="icon"
                variant="outline"
                className="h-9 w-9"
                disabled={isCreating || !novoItemNome.trim() || !novoItemValor}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Orçamento */}
          {lista.orcamento && valorTotal > 0 && (
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between text-xs mb-1">
                <span>Orçamento utilizado</span>
                <span className={cn(isOverBudget && "text-red-600")}>
                  {Math.round(orcamentoUtilizado)}%
                </span>
              </div>
              <CustomProgress
                value={orcamentoUtilizado}
                isOverBudget={isOverBudget}
              />
              {isOverBudget && (
                <p className="text-xs text-red-600 mt-1">
                  Excedeu em R${" "}
                  {(valorTotal - lista.orcamento!).toLocaleString("pt-BR")}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal com todos os itens */}
      <Dialog open={modalItensAberto} onOpenChange={setModalItensAberto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{lista.nome} - Itens</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {itens.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum item ainda.
              </p>
            ) : (
              itens.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-sm group/item"
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => handleToggleItem(item.id)}
                    className="mt-0.5"
                  />
                  <span
                    className={cn(
                      "flex-1",
                      item.checked && "line-through text-muted-foreground",
                    )}
                  >
                    {item.nome}
                    {item.quantidade > 1 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        x{item.quantidade}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    R$ {item.valorUnitario?.toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover/item:opacity-100"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Total: R$ {valorTotal.toLocaleString("pt-BR")}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
