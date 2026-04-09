"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { notificacoesService } from "@/services/tarefas.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notificacao { id: string; titulo: string; mensagem: string; read: boolean; createdAt: string; }

export default function NotificacoesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificacoesService.getNotificacoes().then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const marcarLida = async (id: string) => {
    try {
      await notificacoesService.marcarLida(id);
      setItems(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const marcarTodas = async () => {
    try {
      await notificacoesService.marcarTodasLidas();
      setItems(p => p.map(n => ({ ...n, read: true })));
      toast({ title: "Todas marcadas como lidas" });
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const naoLidas = items.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="font-semibold">Notificações</span>
              {naoLidas > 0 && <Badge className="h-5 text-xs px-1.5">{naoLidas}</Badge>}
            </div>
          </div>
          {naoLidas > 0 && <Button variant="ghost" size="sm" onClick={marcarTodas} className="text-xs"><CheckCheck className="w-3.5 h-3.5 mr-1" />Marcar todas</Button>}
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-2">
        {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />) :
          items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"><Bell className="w-8 h-8 text-muted-foreground" /></div>
              <div><p className="font-medium text-muted-foreground">Nenhuma notificação</p><p className="text-sm text-muted-foreground/60">Você está em dia!</p></div>
            </div>
          ) : items.map(n => (
            <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${n.read ? "bg-card border-border opacity-60" : "bg-card border-primary/20 shadow-sm"}`}>
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.titulo}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.mensagem}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{format(new Date(n.createdAt), "d MMM, HH:mm", { locale: ptBR })}</p>
              </div>
              {!n.read && (
                <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0" onClick={() => marcarLida(n.id)}>
                  <Check className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
      </main>
    </div>
  );
}
