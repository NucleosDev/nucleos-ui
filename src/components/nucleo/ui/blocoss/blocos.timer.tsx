// "use client";

// import { useState, useEffect } from "react";
// import { Timer, Play, Square, Loader2, Clock, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { toast } from "@/hooks/use-toast";
// import {
//   timersService,
//   type Timer as TimerType,
// } from "@/services/timers.service";

// interface BlocoTimerProps {
//   nucleoId: string;
// }
// export function BlocoTimer({ nucleoId }: BlocoTimerProps) {
//   const [timers, setTimers] = useState<TimerType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
//   const [elapsedSeconds, setElapsedSeconds] = useState(0);
//   const [showStartDialog, setShowStartDialog] = useState(false);
//   const [newTimerTitle, setNewTimerTitle] = useState("");
//   const [starting, setStarting] = useState(false);
//   const [stopping, setStopping] = useState(false);

//   // Carregar timers
//   const loadTimers = async () => {
//     try {
//       setLoading(true);
//       const data = await timersService.getTimers(nucleoId);
//       setTimers(data);
//       // Encontrar timer ativo (inicio preenchido e fim nulo)
//       const ativo = data.find((t) => t.inicio && !t.fim);
//       setActiveTimerId(ativo?.id || null);
//     } catch (error) {
//       toast({ title: "Erro ao carregar timers", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTimers();
//   }, [nucleoId]);

//   // Atualizar contagem do timer ativo
//   useEffect(() => {
//     if (!activeTimerId) {
//       setElapsedSeconds(0);
//       return;
//     }

//     const timer = timers.find((t) => t.id === activeTimerId);
//     if (!timer || !timer.inicio) return;

//     const inicio = new Date(timer.inicio).getTime();
//     const duracaoBase = timer.duracao_segundos || 0;

//     const interval = setInterval(() => {
//       const agora = Date.now();
//       const segundos = Math.floor((agora - inicio) / 1000) + duracaoBase;
//       setElapsedSeconds(segundos);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [activeTimerId, timers]);

//   const handleStart = async () => {
//     if (!newTimerTitle.trim()) {
//       toast({ title: "Digite um título para o timer", variant: "destructive" });
//       return;
//     }

//     setStarting(true);
//     try {
//       const novoTimer = await timersService.startTimer({
//         nucleoId,
//         titulo: newTimerTitle,
//       });
//       setTimers((prev) => [novoTimer, ...prev]);
//       setActiveTimerId(novoTimer.id);
//       setNewTimerTitle("");
//       setShowStartDialog(false);
//       toast({ title: "Timer iniciado!" });
//     } catch (error) {
//       toast({ title: "Erro ao iniciar timer", variant: "destructive" });
//     } finally {
//       setStarting(false);
//     }
//   };

//   const handleStop = async () => {
//     if (!activeTimerId) return;

//     setStopping(true);
//     try {
//       const result = await timersService.stopTimer(activeTimerId);
//       toast({ title: `Timer parado! +${result.xpGanho} XP` });
//       setActiveTimerId(null);
//       setElapsedSeconds(0);
//       // Recarregar lista para atualizar duração
//       await loadTimers();
//     } catch (error) {
//       toast({ title: "Erro ao parar timer", variant: "destructive" });
//     } finally {
//       setStopping(false);
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     if (h > 0) {
//       return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//     }
//     return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   if (loading) {
//     return (
//       <div className="space-y-3">
//         <Skeleton className="h-24 w-full rounded-lg" />
//         <Skeleton className="h-12 w-full rounded-lg" />
//       </div>
//     );
//   }

//   const timerAtivo = activeTimerId
//     ? timers.find((t) => t.id === activeTimerId)
//     : null;
//   const timersInativos = timers
//     .filter((t) => t.id !== activeTimerId)
//     .slice(0, 3);

//   return (
//     <div className="space-y-4">
//       {/* Timer ativo */}
//       {timerAtivo ? (
//         <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
//           <div className="text-sm text-muted-foreground mb-1">
//             {timerAtivo.titulo}
//           </div>
//           <div className="text-5xl font-mono font-bold text-primary mb-4 tabular-nums">
//             {formatTime(elapsedSeconds)}
//           </div>
//           <Button
//             onClick={handleStop}
//             variant="destructive"
//             size="sm"
//             disabled={stopping}
//           >
//             {stopping ? (
//               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//             ) : (
//               <Square className="w-4 h-4 mr-2" />
//             )}
//             Parar
//           </Button>
//         </div>
//       ) : (
//         <button
//           onClick={() => setShowStartDialog(true)}
//           className="w-full flex flex-col items-center gap-3 p-8 bg-muted/30 border-2 border-dashed border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 transition-all"
//         >
//           <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
//             <Play className="w-7 h-7 text-primary" />
//           </div>
//           <div>
//             <p className="font-medium">Iniciar Timer</p>
//             <p className="text-xs text-muted-foreground mt-0.5">1 min = 1 XP</p>
//           </div>
//         </button>
//       )}

//       {/* Lista de timers recentes */}
//       {timersInativos.length > 0 && (
//         <div className="space-y-2">
//           <p className="text-xs text-muted-foreground font-medium">
//             Sessões recentes
//           </p>
//           {timersInativos.map((timer) => (
//             <div
//               key={timer.id}
//               className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg text-sm"
//             >
//               <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
//               <span className="flex-1 truncate">{timer.titulo}</span>
//               <span className="text-xs tabular-nums text-muted-foreground">
//                 {timer.duracao_segundos
//                   ? formatTime(timer.duracao_segundos)
//                   : "--:--"}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal para iniciar novo timer */}
//       <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
//         <DialogContent className="max-w-sm">
//           <DialogHeader>
//             <DialogTitle>Iniciar Timer</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-2">
//             <div className="space-y-2">
//               <Label htmlFor="timer-title">Título (opcional)</Label>
//               <Input
//                 id="timer-title"
//                 placeholder="Sessão de foco"
//                 value={newTimerTitle}
//                 onChange={(e) => setNewTimerTitle(e.target.value)}
//                 autoFocus
//                 onKeyDown={(e) => e.key === "Enter" && handleStart()}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowStartDialog(false)}>
//               Cancelar
//             </Button>
//             <Button onClick={handleStart} disabled={starting}>
//               {starting ? (
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               ) : (
//                 <Play className="w-4 h-4 mr-2" />
//               )}
//               Iniciar
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
