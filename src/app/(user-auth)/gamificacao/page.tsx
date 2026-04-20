// "use client";

// import { useRouter } from "next/navigation";
// import { ArrowLeft, Flame, Trophy, Zap, AlertCircle } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";

// import { ConquistaCard } from "@/src/components/layout-auth/ConsquistaCard";
// // import {
// //   useUserLevel,
// //   useStreaks,
// //   useConquistas,
// // } from "@/src/hooks/useGamificacao";
// import type { Conquista } from "@/src/types/";

// // ---------------------------------------------------------------------------
// // Skeleton
// // ---------------------------------------------------------------------------
// function ConquistasSkeleton() {
//   return (
//     <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
//       {Array.from({ length: 12 }).map((_, i) => (
//         <Skeleton key={i} className="h-28 rounded-xl" />
//       ))}
//     </div>
//   );
// }

// // ---------------------------------------------------------------------------
// // Agrupador de conquistas por categoria
// // ---------------------------------------------------------------------------
// const categoriaLabel: Record<Conquista["categoria"], string> = {
//   habito: "Hábitos",
//   tarefa: "Tarefas",
//   nucleo: "Nucleos",
//   especial: "Especiais",
// };

// // ---------------------------------------------------------------------------
// // Página
// // ---------------------------------------------------------------------------
// export default function GamificacaoPage() {
//   const router = useRouter();

//   // const {
//   //   data: level,
//   //   isLoading: levelLoading,
//   //   error: levelError,
//   // } = useUserLevel();
//   // const { data: streaks, isLoading: streaksLoading } = useStreaks();
//   // const {
//   //   data: conquistas,
//   //   isLoading: conquistasLoading,
//   //   error: conquistasError,
//   // } = useConquistas();

//   // const xpPercent = level
//   //   ? Math.round((level.xpAtual / level.xpProximoNivel) * 100)
//   //   : 0;

//   // // Agrupar conquistas por categoria
//   // const grupos = conquistas
//   //   ? (
//   //       ["habito", "tarefa", "nucleo", "especial"] as Conquista["categoria"][]
//   //     ).reduce<Record<string, Conquista[]>>((acc, cat) => {
//   //       const items = conquistas.filter((c) => c.categoria === cat);
//   //       if (items.length > 0) acc[cat] = items;
//   //       return acc;
//   //     }, {})
//   //   : {};

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
//         <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4 md:px-6">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8"
//             onClick={() => router.back()}
//             aria-label="Voltar"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-sm font-semibold text-foreground">Gamificação</h1>
//         </div>
//       </header>

//       <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
//         {/* Nível e XP */}
//         {levelError ? (
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               Erro ao carregar dados de nível.
//             </AlertDescription>
//           </Alert>
//         ) : (
//           <Card className="mb-6">
//             <CardContent className="p-6">
//               {levelLoading ? (
//                 <div className="flex flex-col gap-3">
//                   <Skeleton className="h-5 w-32" />
//                   <Skeleton className="h-8 w-24" />
//                   <Skeleton className="h-3 w-full" />
//                 </div>
//               ) : level ? (
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
//                   {/* Ícone de nível */}
//                   <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
//                     <Trophy className="h-8 w-8" />
//                   </div>

//                   <div className="flex flex-1 flex-col gap-2">
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-3xl font-bold text-foreground">
//                         Nível {level.nivel}
//                       </span>
//                       <Badge variant="secondary" className="text-xs">
//                         {level.titulo}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
//                       <span className="flex items-center gap-1">
//                         <Zap className="h-3 w-3" />
//                         {level.xpAtual} XP
//                       </span>
//                       <span>{level.xpProximoNivel} XP</span>
//                     </div>
//                     <Progress
//                       value={xpPercent}
//                       className="h-2.5 [&>div]:bg-primary"
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       Faltam{" "}
//                       <strong>{level.xpProximoNivel - level.xpAtual} XP</strong>{" "}
//                       para o próximo nível.
//                     </p>
//                   </div>
//                 </div>
//               ) : null}
//             </CardContent>
//           </Card>
//         )}

//         {/* Streaks */}
//         <Card className="mb-8">
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center gap-2 text-sm font-semibold">
//               <Flame className="h-4 w-4 text-destructive" />
//               Streaks
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {streaksLoading ? (
//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <Skeleton key={i} className="h-20 rounded-lg" />
//                 ))}
//               </div>
//             ) : !streaks || streaks.length === 0 ? (
//               <p className="text-xs text-muted-foreground py-2">
//                 Nenhum streak ativo ainda.
//               </p>
//             ) : (
//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//                 {streaks.map((s, i) => (
//                   <div
//                     key={i}
//                     className="flex flex-col items-center gap-1 rounded-lg border border-border bg-muted/40 p-3 text-center"
//                   >
//                     <Flame
//                       className={`h-5 w-5 ${
//                         s.ativo ? "text-destructive" : "text-muted-foreground"
//                       }`}
//                     />
//                     <span className="text-2xl font-bold text-foreground leading-none">
//                       {s.atual}
//                     </span>
//                     <span className="text-xs text-muted-foreground leading-tight">
//                       {s.tipo}
//                     </span>
//                     {s.maximo > 0 && (
//                       <span className="text-[10px] text-muted-foreground">
//                         Máx: {s.maximo}
//                       </span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Conquistas */}
//         <section>
//           <h2 className="text-sm font-semibold text-foreground mb-4">
//             Conquistas
//           </h2>

//           {conquistasError ? (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>Erro ao carregar conquistas.</AlertDescription>
//             </Alert>
//           ) : conquistasLoading ? (
//             <ConquistasSkeleton />
//           ) : !conquistas || conquistas.length === 0 ? (
//             <p className="text-sm text-muted-foreground">
//               Nenhuma conquista disponível.
//             </p>
//           ) : (
//             <div className="flex flex-col gap-8">
//               {Object.entries(grupos).map(([cat, items]) => (
//                 <div key={cat}>
//                   <div className="flex items-center gap-3 mb-3">
//                     <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//                       {categoriaLabel[cat as Conquista["categoria"]]}
//                     </span>
//                     <Separator className="flex-1" />
//                     <span className="text-xs text-muted-foreground">
//                       {items.filter((c) => c.desbloqueada).length}/
//                       {items.length}
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
//                     {items.map((c) => (
//                       <ConquistaCard key={c.id} conquista={c} />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }
