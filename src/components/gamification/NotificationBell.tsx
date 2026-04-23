// src/components/gamification/NotificationBell.tsx
"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
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
        return "🎉";
      case "ACHIEVEMENT":
        return "🏆";
      case "STREAK":
        return "🔥";
      case "DAILY_REWARD":
        return "⭐";
      default:
        return "⚡";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "LEVEL_UP":
        return "text-yellow-500";
      case "ACHIEVEMENT":
        return "text-purple-500";
      case "STREAK":
        return "text-orange-500";
      case "DAILY_REWARD":
        return "text-blue-500";
      default:
        return "text-primary";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="p-3 border-b flex items-center justify-between">
          <h4 className="font-semibold">Notificações</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* Lista de notificações */}
        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification: GamificationNotification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-3 cursor-pointer border-b last:border-0",
                  !notification.read && "bg-primary/5",
                )}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start gap-2 w-full">
                  <div
                    className={cn(
                      "text-xl",
                      getNotificationColor(notification.type),
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()} às{" "}
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </p>
                    {notification.xp && (
                      <p className="text-xs text-primary mt-1">
                        +{notification.xp} XP
                      </p>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
              <p className="text-xs">
                Complete ações para receber notificações!
              </p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
