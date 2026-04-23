// src/app/(user-auth)/dashboard/inbox/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Inbox,
  Check,
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
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const marcarLida = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
      );
      toast({ title: "Marcada como lida" });
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

  const excluirSelecionadas = () => {
    setMessages((prev) => prev.filter((m) => !selectedIds.has(m.id)));
    setSelectedIds(new Set());
    toast({ title: "Mensagens removidas" });
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-primary" />
              <span className="font-semibold">Inbox</span>
              {naoLidas > 0 && (
                <Badge className="h-5 text-xs px-1.5 bg-primary text-white">
                  {naoLidas} não lidas
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={excluirSelecionadas}
                className="text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Excluir ({selectedIds.size})
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={marcarTodas}>
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              Marcar todas
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Barra de ferramentas */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={
                selectedIds.size === filteredMessages.length &&
                filteredMessages.length > 0
              }
              onCheckedChange={toggleSelectAll}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setSelectedIds(new Set())}
            >
              Limpar
            </Button>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mensagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger className="w-[140px]">
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
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "group flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer",
                  message.read
                    ? "bg-card border-border"
                    : "bg-gradient-to-r from-primary/5 to-transparent border-primary/20",
                )}
                onClick={() => marcarLida(message.id)}
              >
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
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
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
                        onClick={() => {
                          setMessages((prev) =>
                            prev.filter((m) => m.id !== message.id),
                          );
                        }}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
