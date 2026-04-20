// "use client";

// import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { gamificacaoService } from "@/services/gamificacao.service";
// import { handleApiError } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import type { ConquistaComProgresso } from "@/types";
// import {
//   Trophy,
//   Lock,
//   Star,
//   Sparkles,
//   Award,
//   Flame,
//   Zap,
//   Crown,
//   Medal,
// } from "lucide-react";

// // Tipos de tier
// type Tier = "bronze" | "prata" | "ouro" | "diamante";

// interface ConquistaUI extends ConquistaComProgresso {
//   icone?: React.ReactNode;
//   tier?: Tier;
// }

// interface BadgeConquistaProps {
//   conquista: ConquistaUI;
//   variant?: "mini" | "card";
//   className?: string;
// }

// // Cores por tier
// const TIER_CORES: Record<Tier, { bg: string; border: string; text: string }> = {
//   bronze: {
//     bg: "bg-amber-100 dark:bg-amber-950/30",
//     border: "border-amber-300 dark:border-amber-800",
//     text: "text-amber-700 dark:text-amber-400",
//   },
//   prata: {
//     bg: "bg-slate-100 dark:bg-slate-800/30",
//     border: "border-slate-300 dark:border-slate-700",
//     text: "text-slate-700 dark:text-slate-300",
//   },
//   ouro: {
//     bg: "bg-yellow-100 dark:bg-yellow-950/30",
//     border: "border-yellow-400 dark:border-yellow-700",
//     text: "text-yellow-700 dark:text-yellow-400",
//   },
//   diamante: {
//     bg: "bg-cyan-100 dark:bg-cyan-950/30",
//     border: "border-cyan-400 dark:border-cyan-700",
//     text: "text-cyan-700 dark:text-cyan-400",
//   },
// };

// const TIER_ICONES: Record<Tier, React.ReactNode> = {
//   bronze: <Medal className="size-4" />,
//   prata: <Award className="size-4" />,
//   ouro: <Trophy className="size-4" />,
//   diamante: <Crown className="size-4" />,
// };

// export function BadgeConquista({
//   conquista,
//   variant = "card",
//   className,
// }: BadgeConquistaProps) {
//   const tier = conquista.tier || "bronze";
//   const cores = TIER_CORES[tier];
//   const desbloqueada = conquista.desbloqueada;
//   const temProgresso =
//     conquista.progresso !== undefined && conquista.progressoMax !== undefined;
//   const progressoPct = temProgresso
//     ? (conquista.progresso! / conquista.progressoMax!) * 100
//     : 0;

//   if (variant === "mini") {
//     return (
//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <div
//               className={cn(
//                 "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
//                 desbloqueada
//                   ? cn(cores.bg, cores.border, "shadow-sm")
//                   : "bg-muted border-muted-foreground/20 opacity-50",
//                 className,
//               )}
//             >
//               {desbloqueada ? (
//                 <span className={cores.text}>
//                   {conquista.icone || TIER_ICONES[tier]}
//                 </span>
//               ) : (
//                 <Lock className="size-4 text-muted-foreground" />
//               )}
//               {/* Indicador de progresso circular */}
//               {!desbloqueada && temProgresso && (
//                 <svg className="absolute inset-0 w-full h-full -rotate-90">
//                   <circle
//                     cx="24"
//                     cy="24"
//                     r="22"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeDasharray={2 * Math.PI * 22}
//                     strokeDashoffset={
//                       2 * Math.PI * 22 * (1 - progressoPct / 100)
//                     }
//                     className="text-primary"
//                   />
//                 </svg>
//               )}
//             </div>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p className="font-medium">{conquista.nome}</p>
//             <p className="text-xs text-muted-foreground">
//               {conquista.descricao}
//             </p>
//             {temProgresso && !desbloqueada && (
//               <p className="text-xs mt-1">
//                 Progresso: {conquista.progresso}/{conquista.progressoMax}
//               </p>
//             )}
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>
//     );
//   }

//   // Variant card
//   return (
//     <div
//       className={cn(
//         "relative p-4 rounded-lg border-2 transition-all",
//         desbloqueada
//           ? cn(cores.bg, cores.border)
//           : "bg-muted/30 border-muted-foreground/10 opacity-70",
//         className,
//       )}
//     >
//       {/* Ícone e título */}
//       <div className="flex items-start gap-3">
//         <div
//           className={cn(
//             "flex items-center justify-center w-12 h-12 rounded-full",
//             desbloqueada
//               ? cn(
//                   cores.bg,
//                   "ring-2 ring-offset-2",
//                   `ring-${tier === "diamante" ? "cyan" : tier === "ouro" ? "yellow" : tier === "prata" ? "slate" : "amber"}-400`,
//                 )
//               : "bg-muted",
//           )}
//         >
//           {desbloqueada ? (
//             <span className={cn("size-6", cores.text)}>
//               {conquista.icone || TIER_ICONES[tier]}
//             </span>
//           ) : (
//             <Lock className="size-5 text-muted-foreground" />
//           )}
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2">
//             <h4
//               className={cn(
//                 "font-semibold text-sm",
//                 !desbloqueada && "text-muted-foreground",
//               )}
//             >
//               {conquista.nome}
//             </h4>
//             <Badge
//               variant="outline"
//               className={cn("text-xs capitalize", cores.text)}
//             >
//               {tier}
//             </Badge>
//           </div>
//           <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
//             {conquista.descricao}
//           </p>
//         </div>
//       </div>

//       {/* Progresso ou XP */}
//       <div className="mt-3">
//         {desbloqueada ? (
//           <div className="flex items-center justify-between">
//             <span className="text-xs text-muted-foreground">
//               Desbloqueada em{" "}
//               {conquista.desbloqueadaEm
//                 ? new Date(conquista.desbloqueadaEm).toLocaleDateString("pt-BR")
//                 : "-"}
//             </span>
//             <Badge className="text-xs">
//               <Zap className="size-3 mr-1" />+{conquista.xpRecompensa} XP
//             </Badge>
//           </div>
//         ) : temProgresso ? (
//           <div className="space-y-1">
//             <div className="flex justify-between text-xs">
//               <span className="text-muted-foreground">Progresso</span>
//               <span className="font-medium">
//                 {conquista.progresso}/{conquista.progressoMax}
//               </span>
//             </div>
//             <Progress value={progressoPct} className="h-1.5" />
//           </div>
//         ) : (
//           <div className="flex items-center justify-between">
//             <span className="text-xs text-muted-foreground">Bloqueada</span>
//             <Badge variant="outline" className="text-xs">
//               <Zap className="size-3 mr-1" />
//               {conquista.xpRecompensa} XP
//             </Badge>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ==========================// // GRID DE CONQUISTAS
// // ==========================
// interface ConquistasGridProps {
//   conquistas?: ConquistaUI[];
//   userId?: string;
//   className?: string;
// }

// export function ConquistasGrid({
//   conquistas: conquistasProp,
//   userId,
//   className,
// }: ConquistasGridProps) {
//   const [conquistas, setConquistas] = useState<ConquistaUI[]>(
//     conquistasProp || [],
//   );
//   const [loading, setLoading] = useState(!conquistasProp);
//   const [filtro, setFiltro] = useState<
//     "todas" | "desbloqueadas" | "bloqueadas"
//   >("todas");
//   const { toast } = useToast();

//   useEffect(() => {
//     if (!conquistasProp) {
//       carregarConquistas();
//     }
//   }, [conquistasProp]);

//   async function carregarConquistas() {
//     try {
//       setLoading(true);
//       const dados = await gamificacaoService.listarConquistas();
//       setConquistas(dados);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao carregar conquistas",
//         description: handleApiError(error),
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   const conquistasFiltradas = conquistas.filter((c) => {
//     if (filtro === "desbloqueadas") return c.desbloqueada;
//     if (filtro === "bloqueadas") return !c.desbloqueada;
//     return true;
//   });

//   const totalDesbloqueadas = conquistas.filter((c) => c.desbloqueada).length;

//   if (loading) {
//     return (
//       <div className={cn("space-y-4", className)}>
//         <div className="flex gap-2">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <Skeleton key={i} className="h-8 w-24" />
//           ))}
//         </div>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <Skeleton key={i} className="h-32" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={cn("space-y-4", className)}>
//       {/* Header com filtros */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Button
//             variant={filtro === "todas" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFiltro("todas")}
//           >
//             Todas ({conquistas.length})
//           </Button>
//           <Button
//             variant={filtro === "desbloqueadas" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFiltro("desbloqueadas")}
//           >
//             <Trophy className="size-4 mr-1" />
//             Desbloqueadas ({totalDesbloqueadas})
//           </Button>
//           <Button
//             variant={filtro === "bloqueadas" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setFiltro("bloqueadas")}
//           >
//             <Lock className="size-4 mr-1" />
//             Bloqueadas ({conquistas.length - totalDesbloqueadas})
//           </Button>
//         </div>
//       </div>

//       {/* Grid de conquistas */}
//       {conquistasFiltradas.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-12 text-center">
//           <Trophy className="size-12 text-muted-foreground mb-4" />
//           <p className="text-muted-foreground">
//             {filtro === "desbloqueadas"
//               ? "Nenhuma conquista desbloqueada ainda"
//               : filtro === "bloqueadas"
//                 ? "Todas as conquistas foram desbloqueadas!"
//                 : "Nenhuma conquista disponível"}
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {conquistasFiltradas.map((conquista) => (
//             <BadgeConquista
//               key={conquista.id}
//               conquista={conquista}
//               variant="card"
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
