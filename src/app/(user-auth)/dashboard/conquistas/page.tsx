// "use client";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, Trophy, Lock } from "lucide-react";
// import { useGamificacao } from "@/hooks/useGamificacao";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { ptBR } from "date-fns/locale";

// const ALL_CONQUISTAS = [
//   {
//     tipo: "primeiro_nucleo",
//     nome: "Primeiro Passo",
//     desc: "Criou seu primeiro Nucleo",
//     icon: "🌱",
//   },
//   {
//     tipo: "5_tarefas",
//     nome: "Produtivo",
//     desc: "Concluiu 5 tarefas",
//     icon: "✅",
//   },
//   {
//     tipo: "streak_7",
//     nome: "Consistente",
//     desc: "7 dias seguidos de atividade",
//     icon: "🔥",
//   },
//   {
//     tipo: "streak_30",
//     nome: "Disciplinado",
//     desc: "30 dias seguidos de atividade",
//     icon: "💪",
//   },
//   {
//     tipo: "nivel_5",
//     nome: "Subindo de Nível",
//     desc: "Chegou ao nível 5",
//     icon: "⬆️",
//   },
//   { tipo: "100_xp", nome: "Iniciante XP", desc: "Acumulou 100 XP", icon: "⚡" },
//   {
//     tipo: "1000_xp",
//     nome: "Guerreiro XP",
//     desc: "Acumulou 1.000 XP",
//     icon: "💛",
//   },
//   {
//     tipo: "3_nucleos",
//     nome: "Multitarefa",
//     desc: "Criou 3 Nucleos",
//     icon: "🧩",
//   },
//   {
//     tipo: "habito_30",
//     nome: "Mestre do Hábito",
//     desc: "Manteve um hábito por 30 dias",
//     icon: "🏆",
//   },
// ];

// export default function ConquistasPage() {
//   const router = useRouter();
//   const { conquistas, loading } = useGamificacao();
//   const conquistasIds = new Set(
//     conquistas.map((c: any) => c.id || c.conquistaId),
//   );
//   const conquistasMap: Record<string, any> = {};
//   conquistas.forEach((c: any) => {
//     conquistasMap[c.nome] = c;
//   });

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b border-border sticky top-0 z-10 bg-background/95">
//         <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
//           <Button variant="ghost" size="icon" onClick={() => router.back()}>
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//           <Trophy className="w-4 h-4 text-yellow-500" />
//           <span className="font-semibold">Conquistas</span>
//           <Badge
//             variant="outline"
//             className="text-xs text-yellow-600 border-yellow-300"
//           >
//             {conquistas.length} desbloqueadas
//           </Badge>
//         </div>
//       </header>
//       <main className="max-w-2xl mx-auto px-4 py-6 space-y-3">
//         {loading ? (
//           [...Array(6)].map((_, i) => (
//             <Skeleton key={i} className="h-20 rounded-xl" />
//           ))
//         ) : (
//           <>
//             {conquistas.length > 0 && (
//               <div className="space-y-2">
//                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
//                   Desbloqueadas
//                 </p>
//                 {conquistas.map((c: any) => (
//                   <div
//                     key={c.id}
//                     className="flex items-center gap-4 p-4 bg-card border border-yellow-500/20 rounded-xl shadow-sm"
//                   >
//                     <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-2xl shrink-0">
//                       🏆
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-sm">{c.nome}</p>
//                       {c.descricao && (
//                         <p className="text-xs text-muted-foreground">
//                           {c.descricao}
//                         </p>
//                       )}
//                       {c.desbloqueadoEm && (
//                         <p className="text-xs text-muted-foreground/60 mt-0.5">
//                           {format(new Date(c.desbloqueadoEm), "d 'de' MMMM", {
//                             locale: ptBR,
//                           })}
//                         </p>
//                       )}
//                     </div>
//                     <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-300 text-xs">
//                       Desbloqueada
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 pt-2">
//               Em progresso
//             </p>
//             {ALL_CONQUISTAS.map((c) => {
//               const desbloqueada = conquistas.some(
//                 (d: any) => d.nome === c.nome,
//               );
//               return !desbloqueada ? (
//                 <div
//                   key={c.tipo}
//                   className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl opacity-60"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl grayscale shrink-0">
//                     {c.icon}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-sm">{c.nome}</p>
//                     <p className="text-xs text-muted-foreground">{c.desc}</p>
//                   </div>
//                   <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
//                 </div>
//               ) : null;
//             })}
//           </>
//         )}
//       </main>
//     </div>
//   );
// }
