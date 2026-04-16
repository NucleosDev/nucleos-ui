// components/listas/lista-card.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ListChecks, 
  ShoppingCart, 
  Coins, 
  MoreHorizontal,
  Calendar,
  Flag,
  Users,
  Tag,
  Clock,
  AlertCircle,
  Star,
  TrendingUp,
  DollarSign,
  Package,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Lista } from "@/types/lista";
import { cn } from "@/lib/utils";

// Mapeamento de ícones por tipo
const tipoIconMap = {
  generica: ListChecks,
  compras: ShoppingCart,
  financeiro: Coins,
};

// Mapeamento de labels por tipo
const tipoLabelMap = {
  generica: "Geral",
  compras: "Compras",
  financeiro: "Financeiro",
};

// Novos campos estendidos para a lista
interface ListaEstendida extends Lista {
  prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';
  dataLimite?: string;
  tags?: string[];
  orcamento?: number;
  membros?: string[];
  categoria?: string;
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

// Função para calcular valor total dos itens
const calcularValorTotal = (itens: any[]) => {
  if (!itens) return 0;
  return itens.reduce((total, item) => {
    const valor = (item.valorUnitario || 0) * (item.quantidade || 1);
    return total + valor;
  }, 0);
};

// Função para obter cor da prioridade
const getPriorityColor = (prioridade?: string) => {
  switch (prioridade) {
    case 'urgente': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
    case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
    case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
    case 'baixa': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
  }
};

// Função para formatar data relativa
const formatRelativeDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `Atrasado em ${Math.abs(diffDays)} dias`;
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays <= 7) return `Em ${diffDays} dias`;
  return date.toLocaleDateString('pt-BR');
};

// Componente de Progresso customizado com cores
const CustomProgress = ({ value, className, isOverBudget }: { value: number; className?: string; isOverBudget?: boolean }) => {
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className={cn(
          "h-full transition-all",
          isOverBudget ? "bg-red-500" : "bg-green-500"
        )}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
};

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
  compact = false
}: ListaCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  const Icon = tipoIconMap[lista.tipoLista] || ListChecks;
  const totalItens = lista.itens?.length ?? 0;
  const itensConcluidos = lista.itens?.filter((item) => item.checked).length ?? 0;
  const progresso = totalItens > 0 ? (itensConcluidos / totalItens) * 100 : 0;
  
  // Cálculo de valor total para listas financeiras
  const valorTotal = lista.tipoLista === 'financeiro' && lista.itens 
    ? calcularValorTotal(lista.itens)
    : 0;
  
  const valorConcluido = lista.tipoLista === 'financeiro' && lista.itens
    ? calcularValorTotal(lista.itens.filter(item => item.checked))
    : 0;

  // Cálculo de porcentagem do orçamento
  const orcamentoUtilizado = lista.orcamento && valorTotal > 0 
    ? (valorTotal / lista.orcamento) * 100 
    : 0;
  
  const isOverBudget = lista.orcamento ? valorTotal > lista.orcamento : false;

  const handleClick = () => {
    router.push(`/dashboard/nucleos/${nucleoId}/blocos/${blocoId}/listas/${lista.id}`);
  };

  const isUrgent = lista.prioridade === 'urgente' || 
    (lista.dataLimite && new Date(lista.dataLimite) < new Date());

  if (compact) {
    return (
      <Card 
        className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
                  <Badge variant="secondary" className="text-xs">
                    {tipoLabelMap[lista.tipoLista]}
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
            {(onEdit || onDelete || onDuplicate) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>}
                  {onDuplicate && <DropdownMenuItem onClick={onDuplicate}>Duplicar</DropdownMenuItem>}
                  {onDelete && <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    Excluir
                  </DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
          isUrgent && "border-red-300 bg-red-50/30"
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-md p-2 transition-all duration-300",
              isHovered ? "bg-primary/20 scale-110" : "bg-primary/10"
            )}>
              <Icon className={cn(
                "h-5 w-5 transition-all duration-300",
                isHovered ? "text-primary scale-110" : "text-primary"
              )} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {lista.nome}
                </CardTitle>
                {lista.prioridade && (
                  <Badge className={getPriorityColor(lista.prioridade)}>
                    <Flag className="h-3 w-3 mr-1" />
                    {lista.prioridade.charAt(0).toUpperCase() + lista.prioridade.slice(1)}
                  </Badge>
                )}
                {lista.tags && lista.tags.length > 0 && (
                  <Badge variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {lista.tags[0]}
                    {lista.tags.length > 1 && ` +${lista.tags.length - 1}`}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {tipoLabelMap[lista.tipoLista]}
                </Badge>
                {lista.dataLimite && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant={formatRelativeDate(lista.dataLimite)?.includes('Atrasado') ? 'destructive' : 'outline'} 
                             className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatRelativeDate(lista.dataLimite)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Data limite: {new Date(lista.dataLimite).toLocaleDateString('pt-BR')}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {lista.orcamento && lista.tipoLista === 'financeiro' && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Orçamento: R$ {lista.orcamento.toLocaleString('pt-BR')}
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
          
          {(onEdit || onDelete || onDuplicate || onShare || onArchive) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                    Editar lista
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                    Duplicar lista
                  </DropdownMenuItem>
                )}
                {onShare && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(); }}>
                    Compartilhar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onArchive && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
                    Arquivar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                    className="text-destructive"
                  >
                    Excluir lista
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        
        <CardContent className="space-y-3">
          {showProgressDetails && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {itensConcluidos} de {totalItens} itens
                </span>
                <div className="flex items-center gap-2">
                  {lista.tipoLista === 'financeiro' && valorTotal > 0 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-xs text-muted-foreground">
                          R$ {valorConcluido.toLocaleString('pt-BR')} / R$ {valorTotal.toLocaleString('pt-BR')}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Valor concluído / Valor total</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <span className="font-medium">{Math.round(progresso)}%</span>
                </div>
              </div>
              <Progress value={progresso} className="h-2" />
            </div>
          )}
          
          {/* Informações adicionais */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
            {lista.membros && lista.membros.length > 0 && (
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{lista.membros.length} membro(s)</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Membros atribuídos à lista</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {lista.categoria && (
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span>{lista.categoria}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Categoria da lista</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {isUrgent && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="h-3 w-3" />
                <span>Urgente!</span>
              </div>
            )}
            
            {progresso === 100 && totalItens > 0 && (
              <div className="flex items-center gap-1 text-green-600">
                <Star className="h-3 w-3 fill-current" />
                <span>Concluída!</span>
              </div>
            )}
          </div>
          
          {/* Barra de progresso adicional para listas financeiras */}
          {lista.tipoLista === 'financeiro' && lista.orcamento && valorTotal > 0 && (
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Orçamento utilizado</span>
                <span className={cn(
                  "font-medium",
                  isOverBudget && "text-red-600"
                )}>
                  {Math.round(orcamentoUtilizado)}%
                </span>
              </div>
              <CustomProgress 
                value={orcamentoUtilizado} 
                isOverBudget={isOverBudget}
                className="h-1.5"
              />
              {isOverBudget && (
                <p className="text-xs text-red-600 mt-1">
                  Excedeu o orçamento em R$ {(valorTotal - lista.orcamento!).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}