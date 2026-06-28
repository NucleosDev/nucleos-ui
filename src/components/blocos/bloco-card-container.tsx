// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import {
//   ListChecks,
//   ShoppingCart,
//   Coins,
//   MoreHorizontal,
//   Calendar,
//   Flag,
//   Users,
//   Tag,
//   AlertCircle,
//   Star,
//   DollarSign,
//   Package,
//   Plus,
//   Trash2,
//   Store,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useItensLista } from "@/hooks/useItensLista";
// import { toast } from "@/hooks/use-toast";
// import type { Lista } from "@/types/lista";
// import { cn } from "@/lib/utils";

// // Mapeamento de ícones por tipo
// const tipoIconMap: Record<string, any> = {
//   generica: ListChecks,
//   compras: ShoppingCart,
//   financeiro: Coins,
// };

// const tipoLabelMap: Record<string, string> = {
//   generica: "Geral",
//   compras: "Compras",
//   financeiro: "Financeiro",
// };

// // Campos estendidos (opcionais, usados se existirem)
// interface ListaEstendida extends Lista {
//   prioridade?: "baixa" | "media" | "alta" | "urgente";
//   dataLimite?: string;
//   tags?: string[];
//   orcamento?: number;
//   membros?: string[];
//   categoria?: string;
//   localCompra?: string;
// }

// interface ListaCardProps {
//   lista: ListaEstendida;
//   nucleoId: string;
//   blocoId: string;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   onDuplicate?: () => void;
//   onShare?: () => void;
//   onArchive?: () => void;
//   showProgressDetails?: boolean;
//   compact?: boolean;
// }

// // Função para calcular valor total dos itens
// const calcularValorTotal = (itens: any[]) => {
//   if (!itens) return 0;
//   return itens.reduce((total, item) => {
//     const valor = (item.valorUnitario || 0) * (item.quantidade || 1);
//     return total + valor;
//   }, 0);
// };

// // Cor da prioridade
// const getPriorityColor = (prioridade?: string) => {
//   switch (prioridade) {
//     case "urgente":
//       return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
//     case "alta":
//       return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200";
//     case "media":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
//     case "baixa":
//       return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
//     default:
//       return "bg-gray-100 text border-gray-200 hover:bg-gray-200";
//   }
// };

// // Data relativa
// const formatRelativeDate = (dateString?: string) => {
//   if (!dateString) return null;
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffDays = Math.ceil(
//     (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
//   );
//   if (diffDays < 0) return `Atrasado em ${Math.abs(diffDays)} dias`;
//   if (diffDays === 0) return "Hoje";
//   if (diffDays === 1) return "Amanhã";
//   if (diffDays <= 7) return `Em ${diffDays} dias`;
//   return date.toLocaleDateString("pt-BR");
// };

// // Progresso customizado
// const CustomProgress = ({
//   value,
//   className,
//   isOverBudget,
// }: {
//   value: number;
//   className?: string;
//   isOverBudget?: boolean;
// }) => {
//   return (
//     <div
//       className={cn(
//         "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
//         className,
//       )}
//     >
//       <div
//         className={cn(
//           "h-full transition-all",
//           isOverBudget ? "bg-red-500" : "bg-green-500",
//         )}
//         style={{ width: `${Math.min(value, 100)}%` }}
//       />
//     </div>
//   );
// };

// export function ListaCard({
//   lista,
//   nucleoId,
//   blocoId,
//   onEdit,
//   onDelete,
//   onDuplicate,
//   onShare,
//   onArchive,
//   showProgressDetails = true,
//   compact = false,
// }: ListaCardProps) {
//   const router = useRouter();
//   const [isHovered, setIsHovered] = useState(false);
//   const [novoItemNome, setNovoItemNome] = useState("");
//   const [novoItemQuantidade, setNovoItemQuantidade] = useState<number>(1);
//   const [novoItemValor, setNovoItemValor] = useState<string>("");

//   // Hook para gerenciar itens da lista
//   const { itens, criarItem, toggleItem, excluirItem, isCreating } =
//     useItensLista(lista.id);

//   const Icon = tipoIconMap[lista.tipoLista] || ListChecks;

//   // Usa os itens carregados pelo hook, não os que vêm na prop (mais atualizados)
//   const totalItens = itens.length;
//   const itensConcluidos = itens.filter((item) => item.checked).length;
//   const progresso = totalItens > 0 ? (itensConcluidos / totalItens) * 100 : 0;

//   // Cálculos financeiros
//   const valorTotal =
//     lista.tipoLista === "financeiro" ? calcularValorTotal(itens) : 0;
//   const valorConcluido =
//     lista.tipoLista === "financeiro"
//       ? calcularValorTotal(itens.filter((item) => item.checked))
//       : 0;
//   const orcamentoUtilizado =
//     lista.orcamento && valorTotal > 0
//       ? (valorTotal / lista.orcamento) * 100
//       : 0;
//   const isOverBudget = lista.orcamento ? valorTotal > lista.orcamento : false;

//   const handleClick = () => {
//     router.push(
//       `/dashboard/nucleos/${nucleoId}/blocos/${blocoId}/listas/${lista.id}`,
//     );
//   };

//   const handleAddItem = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!novoItemNome.trim()) return;
//     try {
//       const payload: any = { listaId: lista.id, nome: novoItemNome.trim() };
//       if (lista.tipoLista !== "generica") {
//         payload.quantidade = novoItemQuantidade;
//         if (novoItemValor) payload.valorUnitario = parseFloat(novoItemValor);
//       }
//       console.log("Adicionando item:", payload);
//       await criarItem(payload);
//       setNovoItemNome("");
//       setNovoItemQuantidade(1);
//       setNovoItemValor("");
//       toast({ title: "Item adicionado com sucesso!" });
//     } catch (error: any) {
//       console.error("Erro ao adicionar item:", error);
//       toast({
//         title: "Erro ao adicionar item",
//         description: error?.message || "Tente novamente mais tarde.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleToggleItem = async (itemId: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       await toggleItem(itemId);
//     } catch (error: any) {
//       console.error("Erro ao alternar item:", error);
//       toast({
//         title: "Erro ao atualizar item",
//         description: error?.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteItem = async (itemId: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       await excluirItem(itemId);
//       toast({ title: "Item removido" });
//     } catch (error: any) {
//       console.error("Erro ao excluir item:", error);
//       toast({
//         title: "Erro ao excluir item",
//         description: error?.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const isUrgent =
//     lista.prioridade === "urgente" ||
//     (lista.dataLimite && new Date(lista.dataLimite) < new Date());

//   // Versão compacta
//   if (compact) {
//     return (
//       <Card
//         className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
//         onClick={handleClick}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <CardContent className="p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3 flex-1">
//               <div className="rounded-md bg-primary/10 p-2">
//                 <Icon className="h-4 w-4 text-primary" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium text-sm">{lista.nome}</span>
//                   <Badge variant="secondary" className="text-xs">
//                     {tipoLabelMap[lista.tipoLista]}
//                   </Badge>
//                 </div>
//                 <div className="flex items-center gap-3 mt-1">
//                   <span className="text-xs text-muted-foreground">
//                     {itensConcluidos}/{totalItens}
//                   </span>
//                   <Progress value={progresso} className="h-1.5 w-24" />
//                 </div>
//               </div>
//             </div>
//             {(onEdit || onDelete || onDuplicate) && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <MoreHorizontal className="h-3.5 w-3.5" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {onEdit && (
//                     <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
//                   )}
//                   {onDuplicate && (
//                     <DropdownMenuItem onClick={onDuplicate}>
//                       Duplicar
//                     </DropdownMenuItem>
//                   )}
//                   {onDelete && (
//                     <DropdownMenuItem
//                       onClick={onDelete}
//                       className="text-destructive"
//                     >
//                       Excluir
//                     </DropdownMenuItem>
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <TooltipProvider>
//       <Card
//         className={cn(
//           "group cursor-pointer hover:shadow-lg transition-all duration-300",
//           isUrgent && "border-red-300 bg-red-50/30",
//         )}
//         onClick={handleClick}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
//           <div className="flex items-center gap-3">
//             <div
//               className={cn(
//                 "rounded-md p-2 transition-all duration-300",
//                 isHovered ? "bg-primary/20 scale-110" : "bg-primary/10",
//               )}
//             >
//               <Icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-300",
//                   isHovered ? "text-primary scale-110" : "text-primary",
//                 )}
//               />
//             </div>
//             <div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <CardTitle className="text-lg group-hover:text-primary transition-colors">
//                   {lista.nome}
//                 </CardTitle>
//                 {lista.prioridade && (
//                   <Badge className={getPriorityColor(lista.prioridade)}>
//                     <Flag className="h-3 w-3 mr-1" />
//                     {lista.prioridade.charAt(0).toUpperCase() +
//                       lista.prioridade.slice(1)}
//                   </Badge>
//                 )}
//                 {lista.tags && lista.tags.length > 0 && (
//                   <Badge variant="outline">
//                     <Tag className="h-3 w-3 mr-1" />
//                     {lista.tags[0]}
//                     {lista.tags.length > 1 && ` +${lista.tags.length - 1}`}
//                   </Badge>
//                 )}
//               </div>
//               <div className="flex items-center gap-2 mt-1.5 flex-wrap">
//                 <Badge variant="secondary" className="text-xs">
//                   {tipoLabelMap[lista.tipoLista]}
//                 </Badge>
//                 {lista.localCompra && (
//                   <Badge variant="outline" className="text-xs">
//                     <Store className="h-3 w-3 mr-1" />
//                     {lista.localCompra}
//                   </Badge>
//                 )}
//                 {lista.dataLimite && (
//                   <Tooltip>
//                     <TooltipTrigger>
//                       <Badge
//                         variant={
//                           formatRelativeDate(lista.dataLimite)?.includes(
//                             "Atrasado",
//                           )
//                             ? "destructive"
//                             : "outline"
//                         }
//                         className="text-xs"
//                       >
//                         <Calendar className="h-3 w-3 mr-1" />
//                         {formatRelativeDate(lista.dataLimite)}
//                       </Badge>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>
//                         Data limite:{" "}
//                         {new Date(lista.dataLimite).toLocaleDateString("pt-BR")}
//                       </p>
//                     </TooltipContent>
//                   </Tooltip>
//                 )}
//                 {lista.orcamento && lista.tipoLista === "financeiro" && (
//                   <Tooltip>
//                     <TooltipTrigger>
//                       <Badge variant="outline" className="text-xs">
//                         <DollarSign className="h-3 w-3 mr-1" />
//                         Orçamento: R$ {lista.orcamento.toLocaleString("pt-BR")}
//                       </Badge>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Orçamento total definido</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 )}
//               </div>
//             </div>
//           </div>

//           {(onEdit || onDelete || onDuplicate || onShare || onArchive) && (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-48">
//                 <DropdownMenuLabel>Ações</DropdownMenuLabel>
//                 {onEdit && (
//                   <DropdownMenuItem
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onEdit();
//                     }}
//                   >
//                     Editar lista
//                   </DropdownMenuItem>
//                 )}
//                 {onDuplicate && (
//                   <DropdownMenuItem
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDuplicate();
//                     }}
//                   >
//                     Duplicar lista
//                   </DropdownMenuItem>
//                 )}
//                 {onShare && (
//                   <DropdownMenuItem
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onShare();
//                     }}
//                   >
//                     Compartilhar
//                   </DropdownMenuItem>
//                 )}
//                 <DropdownMenuSeparator />
//                 {onArchive && (
//                   <DropdownMenuItem
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onArchive();
//                     }}
//                   >
//                     Arquivar
//                   </DropdownMenuItem>
//                 )}
//                 {onDelete && (
//                   <DropdownMenuItem
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDelete();
//                     }}
//                     className="text-destructive"
//                   >
//                     Excluir lista
//                   </DropdownMenuItem>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </CardHeader>

//         <CardContent className="space-y-3">
//           {showProgressDetails && (
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">
//                   {itensConcluidos} de {totalItens} itens
//                 </span>
//                 <div className="flex items-center gap-2">
//                   {lista.tipoLista === "financeiro" && valorTotal > 0 && (
//                     <Tooltip>
//                       <TooltipTrigger>
//                         <span className="text-xs text-muted-foreground">
//                           R$ {valorConcluido.toLocaleString("pt-BR")} / R${" "}
//                           {valorTotal.toLocaleString("pt-BR")}
//                         </span>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Valor concluído / Valor total</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   )}
//                   <span className="font-medium">{Math.round(progresso)}%</span>
//                 </div>
//               </div>
//               <Progress value={progresso} className="h-2" />
//             </div>
//           )}

//           {/* Lista de itens inline */}
//           <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
//             {itens.length === 0 ? (
//               <p className="text-sm text-muted-foreground text-center py-2">
//                 Nenhum item ainda.
//               </p>
//             ) : (
//               itens.slice(0, 5).map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex items-center gap-2 text-sm group/item"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={item.checked}
//                     onChange={() => {}}
//                     onClick={(e) => handleToggleItem(item.id, e)}
//                     className="h-4 w-4 rounded border-gray-300 cursor-pointer"
//                   />
//                   <span
//                     className={cn(
//                       "flex-1",
//                       item.checked && "line-through text-muted-foreground",
//                     )}
//                   >
//                     {item.nome}
//                     {lista.tipoLista !== "generica" && item.quantidade > 1 && (
//                       <span className="text-xs text-muted-foreground ml-1">
//                         x{item.quantidade}
//                       </span>
//                     )}
//                   </span>
//                   {lista.tipoLista === "financeiro" && item.valorUnitario && (
//                     <span className="text-xs text-muted-foreground">
//                       R$ {item.valorUnitario.toFixed(2)}
//                     </span>
//                   )}
//                   {lista.tipoLista === "compras" && item.valorUnitario && (
//                     <span className="text-xs text-muted-foreground">
//                       R$ {item.valorUnitario.toFixed(2)}
//                     </span>
//                   )}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-6 w-6 opacity-0 group-hover/item:opacity-100"
//                     onClick={(e) => handleDeleteItem(item.id, e)}
//                   >
//                     <Trash2 className="h-3 w-3" />
//                   </Button>
//                 </div>
//               ))
//             )}
//             {itens.length > 5 && (
//               <p className="text-xs text-muted-foreground pt-1">
//                 +{itens.length - 5} itens
//               </p>
//             )}
//           </div>

//           {/* Formulário para adicionar item */}
//           <form
//             onSubmit={handleAddItem}
//             className="space-y-2 mt-2 pt-2 border-t"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex gap-2">
//               <Input
//                 placeholder="Item..."
//                 value={novoItemNome}
//                 onChange={(e) => setNovoItemNome(e.target.value)}
//                 className="h-9 text-sm flex-1"
//                 disabled={isCreating}
//               />
//               {lista.tipoLista !== "generica" && (
//                 <>
//                   <Input
//                     type="number"
//                     placeholder="Qtd"
//                     value={novoItemQuantidade}
//                     onChange={(e) =>
//                       setNovoItemQuantidade(parseInt(e.target.value) || 1)
//                     }
//                     className="h-9 w-20 text-sm"
//                     min="1"
//                     disabled={isCreating}
//                   />
//                   {(lista.tipoLista === "financeiro" ||
//                     lista.tipoLista === "compras") && (
//                     <Input
//                       type="number"
//                       step="0.01"
//                       placeholder="R$"
//                       value={novoItemValor}
//                       onChange={(e) => setNovoItemValor(e.target.value)}
//                       className="h-9 w-24 text-sm"
//                       disabled={isCreating}
//                     />
//                   )}
//                 </>
//               )}
//               <Button
//                 type="submit"
//                 size="icon"
//                 variant="outline"
//                 className="h-9 w-9"
//                 disabled={isCreating || !novoItemNome.trim()}
//               >
//                 <Plus className="h-4 w-4" />
//               </Button>
//             </div>
//           </form>

//           {/* Informações adicionais */}
//           <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
//             {lista.membros && lista.membros.length > 0 && (
//               <Tooltip>
//                 <TooltipTrigger className="flex items-center gap-1">
//                   <Users className="h-3 w-3" />
//                   <span>{lista.membros.length} membro(s)</span>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Membros atribuídos à lista</p>
//                 </TooltipContent>
//               </Tooltip>
//             )}

//             {lista.categoria && (
//               <Tooltip>
//                 <TooltipTrigger className="flex items-center gap-1">
//                   <Package className="h-3 w-3" />
//                   <span>{lista.categoria}</span>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Categoria da lista</p>
//                 </TooltipContent>
//               </Tooltip>
//             )}

//             {isUrgent && (
//               <div className="flex items-center gap-1 text-red-600">
//                 <AlertCircle className="h-3 w-3" />
//                 <span>Urgente!</span>
//               </div>
//             )}

//             {progresso === 100 && totalItens > 0 && (
//               <div className="flex items-center gap-1 text-green-600">
//                 <Star className="h-3 w-3 fill-current" />
//                 <span>Concluída!</span>
//               </div>
//             )}
//           </div>

//           {/* Orçamento */}
//           {lista.tipoLista === "financeiro" &&
//             lista.orcamento &&
//             valorTotal > 0 && (
//               <div className="mt-2 pt-2 border-t">
//                 <div className="flex justify-between text-xs mb-1">
//                   <span className="text-muted-foreground">
//                     Orçamento utilizado
//                   </span>
//                   <span
//                     className={cn(
//                       "font-medium",
//                       isOverBudget && "text-red-600",
//                     )}
//                   >
//                     {Math.round(orcamentoUtilizado)}%
//                   </span>
//                 </div>
//                 <CustomProgress
//                   value={orcamentoUtilizado}
//                   isOverBudget={isOverBudget}
//                   className="h-1.5"
//                 />
//                 {isOverBudget && (
//                   <p className="text-xs text-red-600 mt-1">
//                     Excedeu o orçamento em R${" "}
//                     {(valorTotal - lista.orcamento!).toLocaleString("pt-BR")}
//                   </p>
//                 )}
//               </div>
//             )}
//         </CardContent>
//       </Card>
//     </TooltipProvider>
//   );
// }
