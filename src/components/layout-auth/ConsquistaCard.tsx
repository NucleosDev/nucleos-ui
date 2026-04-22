// "use client"

// import { Lock } from "lucide-react"
// import { cn } from "@/lib/utils"
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"
// import type { Conquista } from "@/types/test"

// interface ConquistaCardProps {
//   conquista: Conquista
// }

// const raridadeStyle: Record<Conquista["raridade"], string> = {
//   comum: "border-border bg-muted/50",
//   raro: "border-nucleo-study/40 bg-nucleo-study/5",
//   epico: "border-nucleo-default/40 bg-nucleo-default/5",
//   lendario: "border-nucleo-finance/40 bg-nucleo-finance/5",
// }

// const raridadeLabel: Record<Conquista["raridade"], string> = {
//   comum: "Comum",
//   raro: "Raro",
//   epico: "Épico",
//   lendario: "Lendário",
// }

// export function ConquistaCard({ conquista }: ConquistaCardProps) {
//   return (
//     <TooltipProvider delayDuration={200}>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <div
//             className={cn(
//               "relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200",
//               conquista.desbloqueada
//                 ? raridadeStyle[conquista.raridade]
//                 : "border-border bg-muted/30 opacity-50 grayscale",
//               conquista.desbloqueada && "hover:scale-105 cursor-default"
//             )}
//             aria-label={`${conquista.nome} — ${conquista.desbloqueada ? "desbloqueada" : "bloqueada"}`}
//           >
//             {/* Ícone */}
//             <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background text-2xl shadow-sm border border-border">
//               {conquista.icone}
//               {!conquista.desbloqueada && (
//                 <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
//                   <Lock className="h-4 w-4 text-muted-foreground" />
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col gap-0.5">
//               <p className="text-xs font-semibold text-foreground leading-tight">
//                 {conquista.nome}
//               </p>
//               <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
//                 {raridadeLabel[conquista.raridade]}
//               </p>
//             </div>
//           </div>
//         </TooltipTrigger>
//         <TooltipContent side="bottom" className="max-w-48 text-center text-xs">
//           <p className="font-medium mb-0.5">{conquista.nome}</p>
//           <p className="text-muted-foreground">{conquista.descricao}</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   )
// }
