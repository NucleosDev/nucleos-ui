// src/app/(user-auth)/dashboard/notificacoes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Trophy,
  Flame,
  Award,
  Star,
} from "lucide-react";
import { notificationsService } from "@/services/notifications.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { GamificationNotification } from "@/types/notifications";

// Adaptador para o formato esperado pelo componente
interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  type?: "XP" | "LEVEL_UP" | "ACHIEVEMENT" | "STREAK" | "DAILY_REWARD";
  read: boolean;
  xp_amount?: number;
  created_at: string;
}

// Função para converter GamificationNotification para Notificacao
const convertToNotificacao = (
  notification: GamificationNotification,
): Notificacao => {
  return {
    id: notification.id,
    titulo: notification.title,
    mensagem: notification.message,
    type: notification.type,
    read: notification.read,
    xp_amount: notification.xp,
    created_at: notification.createdAt.toISOString(),
  };
};

export default function NotificacoesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications();
      // Converter os dados para o formato esperado
      const converted = (Array.isArray(data) ? data : []).map(
        convertToNotificacao,
      );
      setItems(converted);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const marcarLida = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível marcar como lida",
        variant: "destructive",
      });
    }
  };

  const marcarTodas = async () => {
    try {
      await notificationsService.markAllAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      toast({
        title: "Sucesso",
        description: "Todas notificações marcadas como lidas",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível marcar todas",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "LEVEL_UP":
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case "ACHIEVEMENT":
        return <Award className="w-4 h-4 text-purple-500" />;
      case "STREAK":
        return <Flame className="w-4 h-4 text-orange-500" />;
      case "DAILY_REWARD":
        return <Star className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  const naoLidas = items.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="font-semibold">Notificações</span>
              {naoLidas > 0 && (
                <Badge className="h-5 text-xs px-1.5 bg-primary text-white">
                  {naoLidas}
                </Badge>
              )}
            </div>
          </div>
          {naoLidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={marcarTodas}
              className="text-xs"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>
      </header>

      {/* Lista de notificações */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-2">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">
                Nenhuma notificação
              </p>
              <p className="text-sm text-muted-foreground/60">
                Você está em dia!
              </p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border transition-all",
                item.read
                  ? "bg-card border-border opacity-60"
                  : "bg-card border-primary/20 shadow-sm",
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full mt-2 shrink-0",
                  item.read ? "bg-muted-foreground/30" : "bg-primary",
                )}
              />

              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {getNotificationIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.titulo}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.mensagem}
                </p>
                {item.xp_amount && (
                  <p className="text-xs text-primary mt-1">
                    +{item.xp_amount} XP
                  </p>
                )}
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {format(new Date(item.created_at), "d MMM, HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>

              {!item.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 shrink-0"
                  onClick={() => marcarLida(item.id)}
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
