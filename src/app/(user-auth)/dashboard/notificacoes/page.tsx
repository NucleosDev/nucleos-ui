"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Check, CheckCheck, Trophy, Flame, Award, Star } from "lucide-react";
import { notificationsService } from "@/services/notifications.service";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { GamificationNotification } from "@/types/notifications";
import { motion } from "framer-motion";

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  type?: "XP" | "LEVEL_UP" | "ACHIEVEMENT" | "STREAK" | "DAILY_REWARD";
  read: boolean;
  xp_amount?: number;
  created_at: string;
}

const convertToNotificacao = (n: GamificationNotification): Notificacao => ({
  id: n.id,
  titulo: n.title,
  mensagem: n.message,
  type: n.type,
  read: n.read,
  xp_amount: n.xp,
  created_at: n.createdAt.toISOString(),
});

const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]";

function getIcon(type?: string) {
  switch (type) {
    case "LEVEL_UP":     return <Trophy className="h-4 w-4 text-amber-500" />;
    case "ACHIEVEMENT":  return <Award  className="h-4 w-4 text-purple-500" />;
    case "STREAK":       return <Flame  className="h-4 w-4 text-orange-500" />;
    case "DAILY_REWARD": return <Star   className="h-4 w-4 text-blue-500" />;
    default:             return <Bell   className="h-4 w-4 text-primary" />;
  }
}

export default function NotificacoesPage() {
  const router = useRouter();
  const [items, setItems]   = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications();
      setItems((Array.isArray(data) ? data : []).map(convertToNotificacao));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const marcarLida = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      toast({ title: "Erro", description: "Não foi possível marcar como lida", variant: "destructive" });
    }
  };

  const marcarTodas = async () => {
    try {
      await notificationsService.markAllAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      toast({ title: "Sucesso", description: "Todas notificações marcadas como lidas" });
    } catch {
      toast({ title: "Erro", description: "Não foi possível marcar todas", variant: "destructive" });
    }
  };

  const naoLidas = items.filter((n) => !n.read).length;

  return (
    <div className="flex-1 overflow-auto">
      {/* Page header */}
      <div className="px-5 md:px-7 pt-7 pb-5 flex items-center gap-3 border-b border-border/40">
        <button onClick={() => router.back()} className={iconBtn} aria-label="Voltar">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Bell className="h-4 w-4 text-primary" />
        <h1 className="text-base font-semibold">Notificações</h1>
        {naoLidas > 0 && (
          <span className="inline-flex items-center h-5 px-1.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
            {naoLidas}
          </span>
        )}
        {naoLidas > 0 && (
          <button
            onClick={marcarTodas}
            className="ml-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-[var(--duration-fast)]"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar todas
          </button>
        )}
      </div>

      <div className="px-5 md:px-7 py-6 max-w-2xl mx-auto space-y-2">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[76px] rounded-[var(--radius-lg)]" />
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-muted/40 flex items-center justify-center">
              <Bell className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground/60">Nenhuma notificação</p>
              <p className="text-xs text-muted-foreground/40 mt-0.5">Você está em dia!</p>
            </div>
          </div>
        ) : (
          items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border transition-all",
                item.read
                  ? "bg-card/30 border-border/30 opacity-55"
                  : "bg-card/60 backdrop-blur-sm border-primary/20 shadow-[var(--shadow-xs)]",
              )}
            >
              <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", item.read ? "bg-muted-foreground/20" : "bg-primary")} />
              <div className="w-8 h-8 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.titulo}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">{item.mensagem}</p>
                {item.xp_amount && (
                  <span className="text-[10px] font-semibold text-emerald-500 mt-1 block">
                    +{item.xp_amount} XP
                  </span>
                )}
                <p className="text-[10px] text-muted-foreground/40 mt-1">
                  {format(new Date(item.created_at), "d MMM, HH:mm", { locale: ptBR })}
                </p>
              </div>
              {!item.read && (
                <button
                  onClick={() => marcarLida(item.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]"
                  aria-label="Marcar como lida"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
