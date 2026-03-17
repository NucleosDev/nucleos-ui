// /components/nucleo/ui/notificacoes-tempo-real.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { NotificacaoIOS, NotificacoesContainer } from "./notification";
import Image from "next/image";
import {
  Trophy,
  Flame,
  Star,
  Zap,
  Target,
  Award,
  BookOpen,
  Heart,
  Wallet,
} from "lucide-react";

// Mock de notificações em tempo real
const notificacoesMock = [
  {
    id: "1",
    titulo: "Conquista desbloqueada!",
    mensagem: "Você completou 7 dias seguidos",
    icone: <Flame className="size-5 text-orange-500" />,
    tempo: "agora",
    tipo: "conquista" as const,
  },
  {
    id: "2",
    titulo: "Level Up!",
    mensagem: "Núcleo 'Estudos' atingiu nível 12",
    icone: <Zap className="size-5 text-primary" />,
    tempo: "2 min",
    tipo: "sucesso" as const,
  },
  {
    id: "3",
    titulo: "Meta atingida",
    mensagem: "Você completou 100% das tarefas de hoje",
    icone: <Target className="size-5 text-accent" />,
    tempo: "15 min",
    tipo: "info" as const,
  },
  {
    id: "4",
    titulo: "Novo badge!",
    mensagem: "Mestre dos Estudos - Tier Ouro",
    icone: <Award className="size-5 text-yellow-500" />,
    tempo: "1 hora",
    tipo: "conquista" as const,
  },
];

export function NotificacoesTempoReal() {
  const [notificacoes, setNotificacoes] = useState<typeof notificacoesMock>([]);

  useEffect(() => {
    // Adiciona notificações gradualmente
    let index = 0;
    const interval = setInterval(() => {
      if (index < notificacoesMock.length) {
        setNotificacoes((prev) => {
          // Garantir que prev é um array
          const currentPrev = Array.isArray(prev) ? prev : [];
          return [...currentPrev, notificacoesMock[index]];
        });
        index++;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const removerNotificacao = (id: string) => {
    setNotificacoes((prev) => {
      // Garantir que prev é um array
      const currentPrev = Array.isArray(prev) ? prev : [];
      return currentPrev.filter((n) => n && n.id !== id);
    });
  };

  // Garantir que notificacoes é sempre um array
  const notificacoesArray = Array.isArray(notificacoes) ? notificacoes : [];

  return (
    <NotificacoesContainer>
      <AnimatePresence>
        {notificacoesArray.length > 0
          ? notificacoesArray.map((notif, i) => {
              // Verificar se notif existe e tem id
              if (!notif || !notif.id) return null;

              return (
                <NotificacaoIOS
                  key={notif.id}
                  notificacao={{
                    ...notif,
                    imagem: i === 0 ? "/icon.svg" : undefined,
                  }}
                  onClose={() => removerNotificacao(notif.id)}
                  variant="flutuante"
                />
              );
            })
          : null}
      </AnimatePresence>
    </NotificacoesContainer>
  );
}
