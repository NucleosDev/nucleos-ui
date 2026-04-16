// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { NotificacaoIOS, NotificacoesContainer } from "./notification";
// import { notificationsService } from "@/services/notifications.service";
// import { handleApiError } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import type { Notificacao, NotificacaoUI } from "@/types";

// interface NotificacoesTempoRealProps {
//   intervalo?: number; // em ms, padrão 30 segundos
//   maxVisiveis?: number;
// }

// export function NotificacoesTempoReal({
//   intervalo = 30000,
//   maxVisiveis = 3,
// }: NotificacoesTempoRealProps) {
//   const [notificacoes, setNotificacoes] = useState<NotificacaoUI[]>([]);
//   const { toast } = useToast();

//   const carregarNotificacoes = useCallback(async () => {
//     try {
//       const dados = await notificationsService.listar();
//       const naoLidas = dados
//         .filter((n) => !n.read)
//         .slice(0, maxVisiveis)
//         .map((n) => formatarNotificacao(n));
//       setNotificacoes(naoLidas);
//     } catch (error) {
//       // Silenciar erro em polling
//       console.error("Erro ao carregar notificações:", handleApiError(error));
//     }
//   }, [maxVisiveis]);

//   useEffect(() => {
//     carregarNotificacoes();
//     const timer = setInterval(carregarNotificacoes, intervalo);
//     return () => clearInterval(timer);
//   }, [carregarNotificacoes, intervalo]);

//   async function marcarComoLida(id: string) {
//     try {
//       await notificationsService.marcarComoLida(id);
//       setNotificacoes((prev) => prev.filter((n) => n.id !== id));
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro",
//         description: handleApiError(error),
//       });
//     }
//   }

//   function fecharNotificacao(id: string) {
//     setNotificacoes((prev) => prev.filter((n) => n.id !== id));
//     marcarComoLida(id);
//   }

//   if (notificacoes.length === 0) {
//     return null;
//   }

//   return (
//     <NotificacoesContainer position="top-right">
//       {notificacoes.map((notificacao) => (
//         <NotificacaoIOS
//           key={notificacao.id}
//           notificacao={notificacao}
//           variant="flutuante"
//           onClose={() => fecharNotificacao(notificacao.id)}
//         />
//       ))}
//     </NotificacoesContainer>
//   );
// }

// // Helper para formatar notificação da API para UI
// function formatarNotificacao(n: Notificacao): NotificacaoUI {
//   const agora = new Date();
//   const criado = new Date(n.createdAt);
//   const diffMs = agora.getTime() - criado.getTime();
//   const diffMin = Math.floor(diffMs / 60000);
//   const diffHora = Math.floor(diffMin / 60);
//   const diffDia = Math.floor(diffHora / 24);

//   let tempo = "agora";
//   if (diffDia > 0) {
//     tempo = `${diffDia}d`;
//   } else if (diffHora > 0) {
//     tempo = `${diffHora}h`;
//   } else if (diffMin > 0) {
//     tempo = `${diffMin}min`;
//   }

//   // Inferir tipo baseado no título/mensagem
//   let tipo: NotificacaoUI["tipo"] = "info";
//   const texto = (n.titulo + " " + (n.mensagem || "")).toLowerCase();
//   if (texto.includes("conquista") || texto.includes("badge")) {
//     tipo = "conquista";
//   } else if (texto.includes("sucesso") || texto.includes("completou")) {
//     tipo = "sucesso";
//   } else if (texto.includes("alerta") || texto.includes("atenção")) {
//     tipo = "alerta";
//   } else if (texto.includes("lembrete") || texto.includes("hora de")) {
//     tipo = "lembrete";
//   }

//   return {
//     id: n.id,
//     titulo: n.titulo,
//     mensagem: n.mensagem,
//     tipo,
//     tempo,
//     lida: n.read,
//   };
// }
