// src/components/gamification/NotificationBell.tsx
"use client";

import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trophy,
  Flame,
  Star,
  Zap,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { Skeleton } from "@/components/ui/skeleton";
import { GamificationNotification } from "@/types/notifications";
import { LiquidGlass } from "@/components/ui/liquid-glass";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { useGetNotifications, useUnreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { data: notifications = [], isLoading } = useGetNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();

  const handleNotificationClick = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LEVEL_UP":
        return ArrowUp;
      case "ACHIEVEMENT":
        return Trophy;
      case "STREAK":
        return Flame;
      case "DAILY_REWARD":
        return Star;
      default:
        return Zap;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "LEVEL_UP":
        return "text-yellow-400";
      case "ACHIEVEMENT":
        return "text-purple-400";
      case "STREAK":
        return "text-orange-400";
      case "DAILY_REWARD":
        return "text-primary-400";
      default:
        return "text-/70";
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "LEVEL_UP":
        return "bg-yellow-500/10";
      case "ACHIEVEMENT":
        return "bg-purple-500/10";
      case "STREAK":
        return "bg-orange-500/10";
      case "DAILY_REWARD":
        return "bg-primary-500/10";
      default:
        return "bg-/[0.06]";
    }
  };

  // Últimas 3 notificações não lidas para o badge
  const unreadNotifications = notifications
    .filter((n: GamificationNotification) => !n.read)
    .slice(0, 3);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] bg-red-500 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 border-0 bg-transparent"
      >
        <LiquidGlass
          variant="visionOS"
          blurIntensity="xl"
          radius="16px"
          className="overflow-hidden border border-/[0.08]"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-/[0.06] flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-/90">Notificações</h4>
              <p className="text-[10px] text-/30 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
                  : "Todas lidas"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] font-medium text-/50 hover:text-/80 hover:bg-/[0.06]"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>

          {/* Lista de notificações */}
          <ScrollArea className="h-80">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2.5 w-full" />
                      <Skeleton className="h-2 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification: GamificationNotification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);
                const bgClass = getNotificationBg(notification.type);

                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 p-3 cursor-pointer border-b border-/[0.04] last:border-0 transition-colors duration-200",
                      !notification.read
                        ? "bg-/[0.03] hover:bg-/[0.06]"
                        : "hover:bg-/[0.04]",
                    )}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    {/* Ícone */}
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        bgClass,
                      )}
                    >
                      <Icon className={cn("h-4 w-4", colorClass)} />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-/85 truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-/30 shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-/40 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-[10px] text-/25">
                          {new Date(notification.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}{" "}
                          às{" "}
                          {new Date(notification.createdAt).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                        {notification.xp && (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                            +{notification.xp} XP
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-/[0.04] mx-auto mb-3">
                  <Bell className="w-5 h-5 text-/20" />
                </div>
                <p className="text-sm text-/40">Nenhuma notificação</p>
                <p className="text-xs text-/25 mt-1">
                  Complete ações para receber notificações!
                </p>
              </div>
            )}
          </ScrollArea>
        </LiquidGlass>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
