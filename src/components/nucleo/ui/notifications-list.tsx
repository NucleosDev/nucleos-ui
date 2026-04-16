// "use client";

// import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { notificationsService } from "@/services/notifications.service";
// import { handleApiError } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import type { Notificacao } from "@/types";
// import {
//   Bell,
//   Check,
//   CheckCheck,
//   Trophy,
//   Zap,
//   AlertCircle,
//   Info,
//   Clock,
//   Trash2,
// } from "lucide-react";

// interface NotificacoesListProps {
//   className?: string;
// }

// export function NotificacoesList({ className }: NotificacoesListProps) {
//   const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     carregarNotificacoes();
//   }, []);

//   async function carregarNotificacoes() {
//     try {
//       setLoading(true);
//       const dados = await notificationsService.listar();
//       setNotificacoes(dados);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao carregar notificações",
//         description: handleApiError(error),
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function marcarComoLida(id: string) {
//     try {
//       await notificationsService.marcarComoLida(id);
//       setNotificacoes((prev) =>
//         prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//       );
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro",
//         description: handleApiError(error),
//       });
//     }
//   }

//   async function marcarTodasComoLidas() {
//     try {
//       await notificationsService.marcarTodasComoLidas();
//       setNotificacoes((prev) => prev.map((n) => ({ ...n, read: true })));
//       toast({
//         title: "Notificações marcadas como lidas",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro",
//         description: handleApiError(error),
//       });
//     }
//   }

//   function getIconePorTipo(titulo: string, mensagem?: string) {
//     const texto = (titulo + " " + (mensagem || "")).toLowerCase();
//     if (texto.includes("conquista") || texto.includes("badge") || texto.includes("desbloqueou")) {
//       return <Trophy className="size-5 text-yellow-500" />;
//     }
//     if (texto.includes("xp") || texto.includes("level") || texto.includes("nível")) {
//       return <Zap className="size-5 text-primary" />;
//     }
//     if (texto.includes("alerta") || texto.includes("atenção") || texto.includes("importante")) {
//       return <AlertCircle className="size-5 text-orange-500" />;
//     }
//     if (texto.includes("lembrete") || texto.includes("hora de")) {
//       return <Clock className="size-5 text-blue-500" />;
//     }
//     return <Info className="size-5 text-muted-foreground" />;
//   }

//   function formatarTempo(dataStr: string) {
//     const data = new Date(dataStr);
//     const agora = new Date();
//     const diffMs = agora.getTime() - data.getTime();
//     const diffMin = Math.floor(diffMs / 60000);
//     const diffHora = Math.floor(diffMin / 60);
//     const diffDia = Math.floor(diffHora / 24);

//     if (diffDia > 0) return `${diffDia}d atrás`;
//     if (diffHora > 0) return `${diffHora}h atrás`;
//     if (diffMin > 0) return `${diffMin}min atrás`;
//     return "agora";
//   }

//   const naoLidas = notificacoes.filter((n) => !n.read).length;

//   if (loading) {
//     return (
//       <div className={cn("space-y-3", className)}>
//         {Array.from({ length: 4 }).map((_, i) => (
//           <div key={i} className="flex items-start gap-3 p-4 border rounded-lg">
//             <Skeleton className="w-10 h-10 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-48" />
//               <Skeleton className="h-3 w-full" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (notificacoes.length === 0) {
//     return (
//       <div className={cn("flex flex-col items-center justify-center py-12", className)}>
//         <Bell className="size-12 text-muted-foreground mb-4" />
//         <p className="text-muted-foreground">Nenhuma notificação</p>
//       </div>
//     );
//   }

//   return (
//     <div className={cn("space-y-4", className)}>
//       {/* Header com ações */}
//       {naoLidas > 0 && (
//         <div className="flex items-center justify-between">
//           <Badge variant="secondary">
//             {naoLidas} não {naoLidas === 1 ? "lida" : "lidas"}
//           </Badge>
//           <Button variant="outline" size="sm" onClick={marcarTodasComoLidas}>
//             <CheckCheck className="size-4 mr-2" />
//             Marcar todas como lidas
//           </Button>
//         </div>
//       )}

//       {/* Lista de notificações */}
//       <div className="space-y-2">
//         {notificacoes.map((notificacao) => (
//           <div
//             key={notificacao.id}
//             className={cn(
//               "group flex items-start gap-3 p-4 rounded-lg border transition-colors",
//               notificacao.read
//                 ? "bg-muted/30 opacity-70"
//                 : "bg-background hover:bg-accent/50"
//             )}
//           >
//             {/* Ícone */}
//             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
//               {getIconePorTipo(notificacao.titulo, notificacao.mensagem)}
//             </div>

//             {/* Conteúdo */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <h4
//                   className={cn(
//                     "text-sm font-medium truncate",
//                     notificacao.read && "text-muted-foreground"
//                   )}
//                 >
//                   {notificacao.titulo}
//                 </h4>
//                 {!notificacao.read && (
//                   <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
//                 )}
//               </div>
//               {notificacao.mensagem && (
//                 <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
//                   {notificacao.mensagem}
//                 </p>
//               )}
//               <p className="text-xs text-muted-foreground mt-1">
//                 {formatarTempo(notificacao.createdAt)}
//               </p>
//             </div>

//             {/* Ações */}
//             {!notificacao.read && (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 opacity-0 group-hover:opacity-100"
//                 onClick={() => marcarComoLida(notificacao.id)}
//               >
//                 <Check className="size-4" />
//               </Button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
