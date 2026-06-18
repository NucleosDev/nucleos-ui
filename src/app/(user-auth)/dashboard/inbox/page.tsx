// src/app/(user-auth)/dashboard/inbox/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Inbox,
  CheckCheck,
  Trash2,
  Star,
  StarOff,
  Mail,
  MailOpen,
  Search,
  MoreVertical,
} from "lucide-react";
import { notificationsService } from "@/services/notifications.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  titulo: string;
  mensagem: string;
  type: string;
  read: boolean;
  starred?: boolean;
  xp_amount?: number;
  created_at: string;
}

// Função segura para formatar data
const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "Data desconhecida";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return "Data inválida";
  }
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await notificationsService.getNotifications();
      const messagesWithStar = (Array.isArray(data) ? data : []).map(
        (msg: any) => ({
          id: msg.id,
          titulo: msg.title || msg.titulo || "Notificação",
          mensagem: msg.message || msg.mensagem || "",
          type: msg.type || "XP",
          read: msg.read || false,
          xp_amount: msg.xp,
          created_at:
            msg.createdAt || msg.created_at || new Date().toISOString(),
          starred: localStorage.getItem(`starred_${msg.id}`) === "true",
        }),
      );
      setMessages(messagesWithStar);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) {
      try {
        await notificationsService.markAsRead(id);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
      } catch { /* silently ignore */ }
    }
  };

  const marcarLida = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
      );
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const marcarTodas = async () => {
    try {
      await notificationsService.markAllAsRead();
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      toast({ title: "Todas mensagens marcadas como lidas" });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const toggleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newStarred = !m.starred;
          localStorage.setItem(`starred_${id}`, String(newStarred));
          return { ...m, starred: newStarred };
        }
        return m;
      }),
    );
    toast({ title: "Mensagem favoritada" });
  };

  const excluirSelecionadas = async () => {
    const ids = Array.from(selectedIds);
    setMessages((prev) => prev.filter((m) => !selectedIds.has(m.id)));
    setSelectedIds(new Set());
    // tenta deletar no backend; falhas individuais são silenciosas
    await Promise.allSettled(
      ids.map((id) => notificationsService.deleteNotification(id)),
    );
    toast({ title: `${ids.length} notificaç${ids.length === 1 ? "ão removida" : "ões removidas"}` });
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMessages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMessages.map((m) => m.id)));
    }
  };

  const filteredMessages = messages
    .filter((m) => {
      if (filter === "unread") return !m.read;
      if (filter === "read") return m.read;
      return true;
    })
    .filter((m) => {
      if (!searchTerm) return true;
      return (
        m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.mensagem.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const naoLidas = messages.filter((m) => !m.read).length;

  const getTypeIcon = (type: string) => {
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
        return "📬";
    }
  };

  const getTypeColor = (type: string) => {
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
    <div className="flex-1 overflow-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
            <Inbox className="h-3.5 w-3.5 text-primary" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Inbox</h1>
          {naoLidas > 0 && (
            <Badge className="h-5 text-xs px-1.5 bg-primary text-primary-foreground">
              {naoLidas}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={excluirSelecionadas}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/8 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir ({selectedIds.size})
            </button>
          )}
          <button
            onClick={marcarTodas}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar todas
          </button>
        </div>
      </div>

      <div className="px-5 md:px-6 py-5 max-w-3xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2 shrink-0">
            <Checkbox
              checked={
                selectedIds.size === filteredMessages.length &&
                filteredMessages.length > 0
              }
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-xs text-muted-foreground/60">Selecionar todos</span>
            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={excluirSelecionadas}
                  className="sm:hidden inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-red-500 hover:bg-red-500/8 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Excluir ({selectedIds.size})
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  Limpar
                </button>
              </>
            )}
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
            <Input
              placeholder="Buscar mensagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger className="w-full sm:w-[130px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="unread">Não lidas</SelectItem>
              <SelectItem value="read">Lidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de mensagens */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Mail className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">
                Nenhuma mensagem
              </p>
              <p className="text-sm text-muted-foreground/60">
                {searchTerm
                  ? "Nenhum resultado para sua busca"
                  : "Sua caixa de entrada está vazia"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredMessages.map((message) => {
              const isExpanded = expandedId === message.id;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "group rounded-xl border transition-all cursor-pointer",
                    message.read
                      ? "bg-card border-border"
                      : "bg-gradient-to-r from-primary/5 to-transparent border-primary/20",
                    isExpanded && "shadow-md",
                  )}
                  onClick={() => handleRowClick(message.id)}
                >
                  {/* Cabeçalho da mensagem */}
                  <div className="flex items-start gap-3 p-4">
                    <Checkbox
                      checked={selectedIds.has(message.id)}
                      onCheckedChange={() => toggleSelect(message.id)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(message.id);
                      }}
                    >
                      {message.starred ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>

                    <div
                      className={cn(
                        "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl shrink-0",
                        getTypeColor(message.type),
                      )}
                    >
                      {getTypeIcon(message.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            !message.read && "text-primary",
                          )}
                        >
                          {message.titulo}
                        </p>
                        {!message.read && (
                          <Badge className="bg-primary/10 text-primary text-xs">
                            Nova
                          </Badge>
                        )}
                        {message.xp_amount && (
                          <Badge variant="outline" className="text-xs">
                            +{message.xp_amount} XP
                          </Badge>
                        )}
                      </div>
                      <p className={cn("text-xs text-muted-foreground mt-0.5", !isExpanded && "line-clamp-1")}>
                        {message.mensagem}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {formatDate(message.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          marcarLida(message.id);
                        }}
                      >
                        {message.read ? (
                          <MailOpen className="w-3.5 h-3.5" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="icon" className="w-7 h-7">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStar(message.id)}>
                            {message.starred ? "Remover favorito" : "Favoritar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={async (e) => {
                              e.stopPropagation();
                              setMessages((prev) => prev.filter((m) => m.id !== message.id));
                              await notificationsService.deleteNotification(message.id);
                            }}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
