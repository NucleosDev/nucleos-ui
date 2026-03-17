"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Flame,
  Star,
  Target,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Iphone15Pro } from "../ui/iphone-15-pro";
import { NotificacaoIOS } from "@/components/nucleo/ui/notification";
import { BadgeConquista } from "@/components/nucleo/ui/badge-conquist";
import { NucleoProgress } from "@/components/nucleo/ui/nucleo-progress";
import { mockNucleos } from "@/components/nucleo/mocks/nucleo-card.mock";

// Mock de conquistas para os badges
const mockConquistas = [
  {
    id: "1",
    nome: "Primeiro Passo",
    descricao: "Complete sua primeira tarefa",
    icone: <Star className="size-5 text-yellow-500" />,
    tier: "ouro" as const,
    desbloqueada: true,
    xp: 100,
  },
  {
    id: "2",
    nome: "Em Chamas",
    descricao: "7 dias consecutivos",
    icone: <Flame className="size-5 text-orange-500" />,
    tier: "prata" as const,
    desbloqueada: true,
    xp: 250,
  },
  {
    id: "3",
    nome: "Velocista",
    descricao: "10 tarefas em um dia",
    icone: <Zap className="size-5 text-primary" />,
    tier: "bronze" as const,
    desbloqueada: false,
    progresso: 7,
    progressoMax: 10,
    xp: 200,
  },
];

// Mock de notificações flutuantes - ADICIONADO PROPRIEDADE DELAY
const notificacoesMock = [
  {
    id: "notif1",
    titulo: "Nova conquista!",
    mensagem: "Primeira Semana",
    icone: <Trophy className="size-5 text-yellow-500" />,
    tempo: "agora",
    tipo: "conquista" as const,
    delay: 0,
    position: { x: -280, y: -180 },
  },
  {
    id: "notif2",
    titulo: "Streak em chamas!",
    mensagem: "7 dias consecutivos",
    icone: <Flame className="size-5 text-orange-500" />,
    tempo: "agora",
    tipo: "conquista" as const,
    delay: 2,
    position: { x: 280, y: -150 },
  },
  {
    id: "notif3",
    titulo: "Level Up!",
    mensagem: "Nível 5 alcançado",
    icone: <Star className="size-5 text-primary" />,
    tempo: "agora",
    tipo: "sucesso" as const,
    delay: 4,
    position: { x: -250, y: 160 },
  },
  {
    id: "notif4",
    titulo: "Meta atingida!",
    mensagem: "100% das tarefas",
    icone: <Target className="size-5 text-accent" />,
    tempo: "agora",
    tipo: "info" as const,
    delay: 6,
    position: { x: 260, y: 180 },
  },
  {
    id: "notif5",
    titulo: "+250 XP",
    mensagem: "Bônus de consistência",
    icone: <Zap className="size-5 text-purple-500" />,
    tempo: "agora",
    tipo: "sucesso" as const,
    delay: 8,
    position: { x: 0, y: -220 },
  },
];

function NotificationCard({
  notificacao,
  isVisible,
}: {
  notificacao: (typeof notificacoesMock)[0];
  isVisible: boolean;
}) {
  return (
    <div
      className={`absolute transition-all duration-500 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
      style={{
        left: `calc(50% + ${notificacao.position.x}px)`,
        top: `calc(50% + ${notificacao.position.y}px)`,
        transform: "translate(-50%, -50%)",
        zIndex: 20,
      }}
    >
      <NotificacaoIOS
        notificacao={notificacao}
        variant="flutuante"
        className="shadow-xl"
      />
    </div>
  );
}

export function FloatingNotifications() {
  const [visibleStates, setVisibleStates] = useState<boolean[]>(
    new Array(notificacoesMock.length).fill(false),
  );

  useEffect(() => {
    const startLoop = () => {
      notificacoesMock.forEach((notif, index) => {
        setTimeout(() => {
          setVisibleStates((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });

          setTimeout(() => {
            setVisibleStates((prev) => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          }, 3000);
        }, notif.delay * 1000);
      });
    };

    startLoop();
    const interval = setInterval(startLoop, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
<section

      className="relative pb-60 pt-40 overflow-hidden px-4 min-h-screen sm:px-6 lg:px-8"
    >
      {/* GRADIENTES */}
      <div className="absolute top-0 left-0 right-0 h-100 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none z-5 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-black/40 dark:via-transparent dark:to-transparent" />

      <div className="container px-10 mx-auto gap-10 flex flex-col items-center text-center">
        <div className="text-center mb-16">
          <motion.div className="mx-auto max-w-5xl text-center relative z-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-pretty text-6xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-6xl"
            >
              <span className="">Celebre cada </span>
              <span className="bg-gradient-to-r from-foreground via-[#0077BE] to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                conquista
              </span>
              !
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-muted-foreground text-lg max-w-xl mx-auto"
            >
              Notificações motivacionais em tempo real para manter você engajado
            </motion.p>
          </motion.div>
        </div>

        <div className="relative h-[700px] max-w-5xl mx-auto">
          {/* Container do iPhone com conteúdo sobreposto */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 scale-70">
            <div>
              {/* iPhone SVG */}
              <Iphone15Pro width={433} height={882} src="/iphone-15-pro.svg" />

              {/* Conteúdo da tela - SOBREPOSTO ao SVG */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[95%] h-[99%] bg-card rounded-[60px] overflow-hidden shadow-inner">
                  <div className="p-4 h-full flex flex-col">
                    {/* Dynamic Island */}
                    <div className="w-30 h-9 rounded-full mx-auto mb-4 bg-white/5 backdrop-blur-sm border border-foreground/30" />

                    {/* Perfil e nível - USANDO NucleoProgress */}
                    <div className="text-center mb-4">
                      <div className="size-14 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-2 flex items-center justify-center">
                        <span className="text-xl font-bold text">100</span>
                      </div>
                      <p className="font-semibold text-sm">Nível 100</p>
                      <NucleoProgress
                        xpAtual={2847}
                        xpMax={3000}
                        nivel={12}
                        variant="minimal"
                        showDetails={true}
                        className="mt-1"
                      />
                    </div>

                    {/* Barra de progresso (já está no NucleoProgress, mas mantemos para consistência) */}
                    <div className="h-1.5 bg-muted rounded-full mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: "85%" }}
                      />
                    </div>

                    {/* Tarefas - MANTIDAS IGUAL */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <CheckCircle2 className="size-4 text-accent shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            Estudar React
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            +50 XP
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <CheckCircle2 className="size-4 text-accent shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            Academia
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            +75 XP
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 opacity-60">
                        <Target className="size-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            Meditar
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            +30 XP
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Badges de estatísticas - USANDO BadgeConquista */}
                    <div className="flex justify-center gap-2 mt-3 pt-2 border-t border-border/30">
                      {mockConquistas.slice(0, 2).map((conquista) => (
                        <BadgeConquista
                          key={conquista.id}
                          conquista={conquista}
                          variant="mini"
                        />
                      ))}
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                        <TrendingUp className="size-3" />
                        +15%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notificações flutuantes - USANDO NotificacaoIOS */}
          {notificacoesMock.map((notificacao, index) => (
            <NotificationCard
              key={notificacao.id}
              notificacao={notificacao}
              isVisible={visibleStates[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
