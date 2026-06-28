// "use client";

// import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { NucleoProgress } from "./nucleo-progress";
// import { BlocoTarefas } from "./blocos/bloco-tarefas";
// import { BlocoHabitos } from "./blocos/bloco-habitos";
// import { BlocoLista } from "./blocos/bloco-lista";
// import { BlocoCalendario } from "./blocos/bloco-calendario";
// import { BlocoTimer } from "./blocos/bloco-timer";
// import { BlocoTexto } from "./blocos/bloco-texto";
// import { BlocoColecao } from "./blocos/bloco-colecao";
// import { nucleosService } from "@/services/nucleos.service";
// import { blocosService } from "@/services/blocos.service";
// import { handleApiError } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import type {
//   NucleoComStats,
//   Bloco,
//   TipoBloco,
//   CreateBlocoPayload,
// } from "@/types";
// import {
//   Plus,
//   Settings,
//   MoreVertical,
//   Trash2,
//   Edit,
//   GripVertical,
//   CheckSquare,
//   Repeat,
//   ListTodo,
//   Calendar,
//   Timer,
//   FileText,
//   Database,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";

// interface NucleoDetailPageProps {
//   nucleoId?: string;
//   // Props para modo mock/demo
//   nucleo?: NucleoComStats;
//   blocos?: Bloco[];
//   xpTotal?: number;
//   nivel?: number;
//   nextLevelXp?: number;
//   onAddBloco?: (tipo: TipoBloco) => void;
//   onUpdateBloco?: (id: string, dados: Partial<Bloco>) => void;
//   onDeleteBloco?: (id: string) => void;
//   onReorderBlocos?: (blocos: Bloco[]) => void;
//   className?: string;
// }

// // Mapeamento de tipos de bloco
// const TIPOS_BLOCO: {
//   tipo: TipoBloco;
//   label: string;
//   icone: React.ReactNode;
//   descricao: string;
// }[] = [
//   {
//     tipo: "tarefas",
//     label: "Tarefas",
//     icone: <CheckSquare className="size-4" />,
//     descricao: "Gerenciar tarefas e to-dos",
//   },
//   {
//     tipo: "habitos",
//     label: "Hábitos",
//     icone: <Repeat className="size-4" />,
//     descricao: "Acompanhar hábitos diários",
//   },
//   {
//     tipo: "lista",
//     label: "Lista",
//     icone: <ListTodo className="size-4" />,
//     descricao: "Listas de compras, itens, etc.",
//   },
//   {
//     tipo: "calendario",
//     label: "Calendário",
//     icone: <Calendar className="size-4" />,
//     descricao: "Eventos e compromissos",
//   },
//   {
//     tipo: "timer",
//     label: "Timer",
//     icone: <Timer className="size-4" />,
//     descricao: "Pomodoro e temporizadores",
//   },
//   {
//     tipo: "texto",
//     label: "Notas",
//     icone: <FileText className="size-4" />,
//     descricao: "Anotações e textos",
//   },
//   {
//     tipo: "colecao",
//     label: "Coleção",
//     icone: <Database className="size-4" />,
//     descricao: "Banco de dados personalizado",
//   },
// ];

// export function NucleoDetailPage({
//   nucleoId,
//   nucleo: nucleoProp,
//   blocos: blocosProp,
//   xpTotal: xpTotalProp,
//   nivel: nivelProp,
//   nextLevelXp: nextLevelXpProp,
//   onAddBloco: onAddBlocoProp,
//   onUpdateBloco: onUpdateBlocoProp,
//   onDeleteBloco: onDeleteBlocoProp,
//   onReorderBlocos: onReorderBlocosProp,
//   className,
// }: NucleoDetailPageProps) {
//   const [nucleo, setNucleo] = useState<NucleoComStats | null>(
//     nucleoProp || null,
//   );
//   const [blocos, setBlocos] = useState<Bloco[]>(blocosProp || []);
//   const [loading, setLoading] = useState(!nucleoProp && !!nucleoId);
//   const [showModalBloco, setShowModalBloco] = useState(false);
//   const [novoBloco, setNovoBloco] = useState<CreateBlocoPayload>({
//     nucleoId: nucleoId || "",
//     tipo: "tarefas",
//     titulo: "",
//   });
//   const [salvando, setSalvando] = useState(false);
//   const { toast } = useToast();

//   const isModoDemo = !!nucleoProp;

//   useEffect(() => {
//     if (nucleoId && !nucleoProp) {
//       carregarDados();
//     }
//   }, [nucleoId, nucleoProp]);

//   async function carregarDados() {
//     if (!nucleoId) return;

//     try {
//       setLoading(true);
//       const [nucleoData, blocosData] = await Promise.all([
//         nucleosService.buscarPorId(nucleoId),
//         blocosService.listarPorNucleo(nucleoId),
//       ]);
//       setNucleo(nucleoData);
//       setBlocos(blocosData.sort((a, b) => a.posicao - b.posicao));
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao carregar Nucleo",
//         description: handleApiError(error),
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function criarBloco() {
//     if (!novoBloco.tipo) return;

//     if (isModoDemo) {
//       onAddBlocoProp?.(novoBloco.tipo);
//       setShowModalBloco(false);
//       return;
//     }

//     if (!nucleoId) return;

//     try {
//       setSalvando(true);
//       const bloco = await blocosService.criar({
//         ...novoBloco,
//         nucleoId,
//         posicao: blocos.length,
//       });
//       setBlocos((prev) => [...prev, bloco]);
//       setShowModalBloco(false);
//       setNovoBloco({ nucleoId, tipo: "tarefas", titulo: "" });
//       toast({
//         title: "Bloco criado",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao criar bloco",
//         description: handleApiError(error),
//       });
//     } finally {
//       setSalvando(false);
//     }
//   }

//   async function deletarBloco(id: string) {
//     if (isModoDemo) {
//       onDeleteBlocoProp?.(id);
//       return;
//     }

//     try {
//       await blocosService.deletar(id);
//       setBlocos((prev) => prev.filter((b) => b.id !== id));
//       toast({
//         title: "Bloco excluído",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao excluir bloco",
//         description: handleApiError(error),
//       });
//     }
//   }

//   async function moverBloco(id: string, direcao: "up" | "down") {
//     const index = blocos.findIndex((b) => b.id === id);
//     if (index === -1) return;
//     if (direcao === "up" && index === 0) return;
//     if (direcao === "down" && index === blocos.length - 1) return;

//     const novosIndex = direcao === "up" ? index - 1 : index + 1;
//     const novosBlocos = [...blocos];
//     [novosBlocos[index], novosBlocos[novosIndex]] = [
//       novosBlocos[novosIndex],
//       novosBlocos[index],
//     ];

//     // Atualizar posições
//     const blocosComPosicao = novosBlocos.map((b, i) => ({ ...b, posicao: i }));
//     setBlocos(blocosComPosicao);

//     if (isModoDemo) {
//       onReorderBlocosProp?.(blocosComPosicao);
//       return;
//     }

//     try {
//       await blocosService.reordenar(
//         blocosComPosicao.map((b) => ({ id: b.id, posicao: b.posicao })),
//       );
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao reordenar",
//         description: handleApiError(error),
//       });
//       // Reverter
//       setBlocos(blocos);
//     }
//   }

//   const xpAtual = nucleo?.currentXp ?? xpTotalProp ?? 0;
//   const xpMax = nucleo?.nextLevelXp ?? nextLevelXpProp ?? 100;
//   const nivel = nucleo?.level ?? nivelProp ?? 1;

//   if (loading) {
//     return (
//       <div className={cn("space-y-6", className)}>
//         <div className="flex items-start justify-between">
//           <div className="space-y-2">
//             <Skeleton className="h-8 w-48" />
//             <Skeleton className="h-4 w-64" />
//           </div>
//           <Skeleton className="h-10 w-10" />
//         </div>
//         <Skeleton className="h-20 w-full" />
//         <div className="grid gap-4 md:grid-cols-2">
//           <Skeleton className="h-64" />
//           <Skeleton className="h-64" />
//         </div>
//       </div>
//     );
//   }

//   if (!nucleo) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16">
//         <p className="text-muted-foreground">Nucleo não encontrado</p>
//       </div>
//     );
//   }

//   return (
//     <div className={cn("space-y-6", className)}>
//       {/* Header do Nucleo */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">{nucleo.nome}</h1>
//           {nucleo.descricao && (
//             <p className="text-muted-foreground mt-1">{nucleo.descricao}</p>
//           )}
//         </div>
//         <Button variant="outline" size="icon">
//           <Settings className="size-4" />
//         </Button>
//       </div>

//       {/* Progresso do Nucleo */}
//       <Card>
//         <CardContent className="pt-6">
//           <NucleoProgress
//             xpAtual={xpAtual}
//             xpMax={xpMax}
//             nivel={nivel}
//             showDetails
//           />
//         </CardContent>
//       </Card>

//       {/* Blocos */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold">Blocos</h2>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button>
//                 <Plus className="size-4 mr-2" />
//                 Adicionar Bloco
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               {TIPOS_BLOCO.map((tipo) => (
//                 <DropdownMenuItem
//                   key={tipo.tipo}
//                   onClick={() => {
//                     setNovoBloco({
//                       ...novoBloco,
//                       tipo: tipo.tipo,
//                       titulo: tipo.label,
//                     });
//                     setShowModalBloco(true);
//                   }}
//                 >
//                   <div className="flex items-center gap-3">
//                     {tipo.icone}
//                     <div>
//                       <p className="font-medium">{tipo.label}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {tipo.descricao}
//                       </p>
//                     </div>
//                   </div>
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {blocos.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
//             <p className="text-muted-foreground mb-4">Nenhum bloco ainda</p>
//             <Button onClick={() => setShowModalBloco(true)}>
//               <Plus className="size-4 mr-2" />
//               Criar primeiro bloco
//             </Button>
//           </div>
//         ) : (
//           <div className="grid gap-4 md:grid-cols-2">
//             {blocos.map((bloco, index) => (
//               <BlocoWrapper
//                 key={bloco.id}
//                 bloco={bloco}
//                 nucleoId={nucleo.id}
//                 onDelete={() => deletarBloco(bloco.id)}
//                 onMoveUp={() => moverBloco(bloco.id, "up")}
//                 onMoveDown={() => moverBloco(bloco.id, "down")}
//                 isFirst={index === 0}
//                 isLast={index === blocos.length - 1}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal criar bloco */}
//       <Dialog open={showModalBloco} onOpenChange={setShowModalBloco}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Novo Bloco</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Tipo</label>
//               <Select
//                 value={novoBloco.tipo}
//                 onValueChange={(value: TipoBloco) =>
//                   setNovoBloco({ ...novoBloco, tipo: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {TIPOS_BLOCO.map((t) => (
//                     <SelectItem key={t.tipo} value={t.tipo}>
//                       <div className="flex items-center gap-2">
//                         {t.icone}
//                         {t.label}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Título (opcional)</label>
//               <Input
//                 placeholder="Nome do bloco..."
//                 value={novoBloco.titulo || ""}
//                 onChange={(e) =>
//                   setNovoBloco({ ...novoBloco, titulo: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowModalBloco(false)}>
//               Cancelar
//             </Button>
//             <Button onClick={criarBloco} disabled={salvando}>
//               {salvando ? "Criando..." : "Criar Bloco"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // ==========================// // BLOCO WRAPPER
// // ==========================
// interface BlocoWrapperProps {
//   bloco: Bloco;
//   nucleoId: string;
//   onDelete: () => void;
//   onMoveUp: () => void;
//   onMoveDown: () => void;
//   isFirst: boolean;
//   isLast: boolean;
// }

// function BlocoWrapper({
//   bloco,
//   nucleoId,
//   onDelete,
//   onMoveUp,
//   onMoveDown,
//   isFirst,
//   isLast,
// }: BlocoWrapperProps) {
//   const tipoInfo = TIPOS_BLOCO.find((t) => t.tipo === bloco.tipo);

//   function renderConteudo() {
//     switch (bloco.tipo) {
//       case "tarefas":
//         return <BlocoTarefas blocoId={bloco.id} />;
//       case "habitos":
//         return <BlocoHabitos blocoId={bloco.id} />;
//       case "lista":
//         return <BlocoLista blocoId={bloco.id} />;
//       case "calendario":
//         return <BlocoCalendario blocoId={bloco.id} nucleoId={nucleoId} />;
//       case "timer":
//         return <BlocoTimer blocoId={bloco.id} nucleoId={nucleoId} />;
//       case "texto":
//         return <BlocoTexto blocoId={bloco.id} />;
//       case "colecao":
//         return <BlocoColecao blocoId={bloco.id} />;
//       default:
//         return (
//           <p className="text-muted-foreground">
//             Tipo desconhecido: {bloco.tipo}
//           </p>
//         );
//     }
//   }

//   return (
//     <Card className="overflow-hidden">
//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className="text-muted-foreground">{tipoInfo?.icone}</span>
//             <CardTitle className="text-base">
//               {bloco.titulo || tipoInfo?.label || bloco.tipo}
//             </CardTitle>
//           </div>
//           <div className="flex items-center gap-1">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8"
//               onClick={onMoveUp}
//               disabled={isFirst}
//             >
//               <ChevronUp className="size-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8"
//               onClick={onMoveDown}
//               disabled={isLast}
//             >
//               <ChevronDown className="size-4" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <MoreVertical className="size-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem
//                   onClick={onDelete}
//                   className="text-destructive"
//                 >
//                   <Trash2 className="size-4 mr-2" />
//                   Excluir
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>{renderConteudo()}</CardContent>
//     </Card>
//   );
// }
