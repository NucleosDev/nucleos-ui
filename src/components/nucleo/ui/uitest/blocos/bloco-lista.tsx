// "use client";

// import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { listasService } from "@/services/index.service";
// import { handleApiError } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import type {
//   ListaComItens,
//   ItemLista,
//   TipoLista,
//   CreateListaPayload,
// } from "@/types";
// import {
//   Plus,
//   List,
//   ShoppingCart,
//   DollarSign,
//   Trash2,
//   Package,
// } from "lucide-react";

// interface BlocoListaProps {
//   blocoId: string;
//   className?: string;
// }

// const TIPOS_LISTA: {
//   value: TipoLista;
//   label: string;
//   icone: React.ReactNode;
// }[] = [
//   { value: "generica", label: "Genérica", icone: <List className="size-4" /> },
//   {
//     value: "compras",
//     label: "Compras",
//     icone: <ShoppingCart className="size-4" />,
//   },
//   {
//     value: "financeiro",
//     label: "Financeiro",
//     icone: <DollarSign className="size-4" />,
//   },
// ];

// export function BlocoLista({ blocoId, className }: BlocoListaProps) {
//   const [listas, setListas] = useState<ListaComItens[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModalLista, setShowModalLista] = useState(false);
//   const [showModalItem, setShowModalItem] = useState(false);
//   const [listaAtiva, setListaAtiva] = useState<ListaComItens | null>(null);
//   const [novaLista, setNovaLista] = useState<CreateListaPayload>({
//     blocoId,
//     nome: "",
//     tipoLista: "generica",
//   });
//   const [novoItem, setNovoItem] = useState({
//     nome: "",
//     quantidade: 1,
//     valorUnitario: 0,
//   });
//   const [salvando, setSalvando] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     carregarListas();
//   }, [blocoId]);

//   async function carregarListas() {
//     try {
//       setLoading(true);
//       const dados = await listasService.listarPorBloco(blocoId);
//       setListas(dados);
//       if (dados.length > 0 && !listaAtiva) {
//         setListaAtiva(dados[0]);
//       }
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao carregar listas",
//         description: handleApiError(error),
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function criarLista() {
//     if (!novaLista.nome.trim()) return;

//     try {
//       setSalvando(true);
//       const lista = await listasService.criar(novaLista);
//       const listaCompleta: ListaComItens = {
//         ...lista,
//         itens: [],
//         categorias: [],
//         totalItens: 0,
//         itensChecados: 0,
//       };
//       setListas((prev) => [...prev, listaCompleta]);
//       setListaAtiva(listaCompleta);
//       setShowModalLista(false);
//       setNovaLista({ blocoId, nome: "", tipoLista: "generica" });
//       toast({
//         title: "Lista criada",
//         description: "Sua lista foi adicionada com sucesso.",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao criar lista",
//         description: handleApiError(error),
//       });
//     } finally {
//       setSalvando(false);
//     }
//   }

//   async function adicionarItem() {
//     if (!listaAtiva || !novoItem.nome.trim()) return;

//     try {
//       setSalvando(true);
//       const item = await listasService.criarItem({
//         listaId: listaAtiva.id,
//         nome: novoItem.nome,
//         quantidade: novoItem.quantidade,
//         valorUnitario: novoItem.valorUnitario || undefined,
//       });
//       setListas((prev) =>
//         prev.map((l) =>
//           l.id === listaAtiva.id
//             ? {
//                 ...l,
//                 itens: [...l.itens, item],
//                 totalItens: l.totalItens + 1,
//               }
//             : l,
//         ),
//       );
//       setListaAtiva((prev) =>
//         prev
//           ? {
//               ...prev,
//               itens: [...prev.itens, item],
//               totalItens: prev.totalItens + 1,
//             }
//           : null,
//       );
//       setShowModalItem(false);
//       setNovoItem({ nome: "", quantidade: 1, valorUnitario: 0 });
//       toast({
//         title: "Item adicionado",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao adicionar item",
//         description: handleApiError(error),
//       });
//     } finally {
//       setSalvando(false);
//     }
//   }

//   async function toggleItem(item: ItemLista) {
//     try {
//       const atualizado = await listasService.toggleItem(item.id);
//       setListas((prev) =>
//         prev.map((l) =>
//           l.id === listaAtiva?.id
//             ? {
//                 ...l,
//                 itens: l.itens.map((i) => (i.id === item.id ? atualizado : i)),
//                 itensChecados: atualizado.checked
//                   ? l.itensChecados + 1
//                   : l.itensChecados - 1,
//               }
//             : l,
//         ),
//       );
//       setListaAtiva((prev) =>
//         prev
//           ? {
//               ...prev,
//               itens: prev.itens.map((i) => (i.id === item.id ? atualizado : i)),
//               itensChecados: atualizado.checked
//                 ? prev.itensChecados + 1
//                 : prev.itensChecados - 1,
//             }
//           : null,
//       );
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao atualizar item",
//         description: handleApiError(error),
//       });
//     }
//   }

//   async function deletarItem(id: string) {
//     try {
//       await listasService.deletarItem(id);
//       setListas((prev) =>
//         prev.map((l) =>
//           l.id === listaAtiva?.id
//             ? {
//                 ...l,
//                 itens: l.itens.filter((i) => i.id !== id),
//                 totalItens: l.totalItens - 1,
//               }
//             : l,
//         ),
//       );
//       setListaAtiva((prev) =>
//         prev
//           ? {
//               ...prev,
//               itens: prev.itens.filter((i) => i.id !== id),
//               totalItens: prev.totalItens - 1,
//             }
//           : null,
//       );
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao excluir item",
//         description: handleApiError(error),
//       });
//     }
//   }

//   if (loading) {
//     return (
//       <div className={cn("space-y-3", className)}>
//         <Skeleton className="h-10 w-full" />
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div key={i} className="flex items-center gap-3 p-2">
//             <Skeleton className="w-5 h-5" />
//             <Skeleton className="h-4 flex-1" />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className={cn("space-y-4", className)}>
//       {listas.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
//           <Package className="size-10 text-muted-foreground mb-3" />
//           <p className="text-muted-foreground mb-4">Nenhuma lista ainda</p>
//           <Button onClick={() => setShowModalLista(true)}>
//             <Plus className="size-4 mr-2" />
//             Criar primeira lista
//           </Button>
//         </div>
//       ) : (
//         <>
//           {/* Seletor de lista */}
//           <div className="flex items-center gap-2">
//             <Select
//               value={listaAtiva?.id}
//               onValueChange={(id) =>
//                 setListaAtiva(listas.find((l) => l.id === id) || null)
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Selecione uma lista" />
//               </SelectTrigger>
//               <SelectContent>
//                 {listas.map((lista) => (
//                   <SelectItem key={lista.id} value={lista.id}>
//                     <div className="flex items-center gap-2">
//                       {
//                         TIPOS_LISTA.find((t) => t.value === lista.tipoLista)
//                           ?.icone
//                       }
//                       {lista.nome}
//                       <span className="text-xs text-muted-foreground">
//                         ({lista.itensChecados}/{lista.totalItens})
//                       </span>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => setShowModalLista(true)}
//             >
//               <Plus className="size-4" />
//             </Button>
//           </div>

//           {/* Itens da lista */}
//           {listaAtiva && (
//             <div className="space-y-2">
//               {listaAtiva.itens.length === 0 ? (
//                 <p className="text-sm text-muted-foreground text-center py-4">
//                   Nenhum item na lista
//                 </p>
//               ) : (
//                 listaAtiva.itens.map((item) => (
//                   <div
//                     key={item.id}
//                     className={cn(
//                       "group flex items-center gap-3 p-2 rounded-lg transition-colors",
//                       item.checked
//                         ? "bg-muted/50 opacity-60"
//                         : "hover:bg-accent/50",
//                     )}
//                   >
//                     <Checkbox
//                       checked={item.checked}
//                       onCheckedChange={() => toggleItem(item)}
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p
//                         className={cn(
//                           "text-sm",
//                           item.checked && "line-through text-muted-foreground",
//                         )}
//                       >
//                         {item.nome}
//                       </p>
//                       {(item.quantidade > 1 || item.valorUnitario) && (
//                         <p className="text-xs text-muted-foreground">
//                           {item.quantidade > 1 && `${item.quantidade}x`}
//                           {item.valorUnitario && (
//                             <span className="ml-1">
//                               R$ {item.valorUnitario.toFixed(2)}
//                             </span>
//                           )}
//                         </p>
//                       )}
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-6 w-6 opacity-0 group-hover:opacity-100"
//                       onClick={() => deletarItem(item.id)}
//                     >
//                       <Trash2 className="size-3 text-destructive" />
//                     </Button>
//                   </div>
//                 ))
//               )}

//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="w-full"
//                 onClick={() => setShowModalItem(true)}
//               >
//                 <Plus className="size-4 mr-2" />
//                 Adicionar item
//               </Button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Modal criar lista */}
//       <Dialog open={showModalLista} onOpenChange={setShowModalLista}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Nova Lista</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Nome da lista</label>
//               <Input
//                 placeholder="Ex: Lista de compras, Tarefas da casa..."
//                 value={novaLista.nome}
//                 onChange={(e) =>
//                   setNovaLista({ ...novaLista, nome: e.target.value })
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Tipo</label>
//               <Select
//                 value={novaLista.tipoLista}
//                 onValueChange={(value: TipoLista) =>
//                   setNovaLista({ ...novaLista, tipoLista: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {TIPOS_LISTA.map((t) => (
//                     <SelectItem key={t.value} value={t.value}>
//                       <div className="flex items-center gap-2">
//                         {t.icone}
//                         {t.label}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowModalLista(false)}>
//               Cancelar
//             </Button>
//             <Button
//               onClick={criarLista}
//               disabled={salvando || !novaLista.nome.trim()}
//             >
//               {salvando ? "Salvando..." : "Criar Lista"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Modal adicionar item */}
//       <Dialog open={showModalItem} onOpenChange={setShowModalItem}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Adicionar Item</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Nome do item</label>
//               <Input
//                 placeholder="Nome do item..."
//                 value={novoItem.nome}
//                 onChange={(e) =>
//                   setNovoItem({ ...novoItem, nome: e.target.value })
//                 }
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Quantidade</label>
//                 <Input
//                   type="number"
//                   min={1}
//                   value={novoItem.quantidade}
//                   onChange={(e) =>
//                     setNovoItem({
//                       ...novoItem,
//                       quantidade: parseInt(e.target.value) || 1,
//                     })
//                   }
//                 />
//               </div>

//               {listaAtiva?.tipoLista !== "generica" && (
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Valor unitário</label>
//                   <Input
//                     type="number"
//                     min={0}
//                     step={0.01}
//                     value={novoItem.valorUnitario}
//                     onChange={(e) =>
//                       setNovoItem({
//                         ...novoItem,
//                         valorUnitario: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowModalItem(false)}>
//               Cancelar
//             </Button>
//             <Button
//               onClick={adicionarItem}
//               disabled={salvando || !novoItem.nome.trim()}
//             >
//               {salvando ? "Salvando..." : "Adicionar"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
